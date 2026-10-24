import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { createServer } from 'node:http';
import { createApp } from '../src/app.js';
import { createSessionStore } from '../src/config/session.js';
import { loadEnvironment } from '../src/config/environment.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { User } from '../src/models/User.js';
import { BloodRequest } from '../src/models/BloodRequest.js';
import bcrypt from 'bcrypt';

describe('Blood Request API', () => {
  let mongod;
  let server;
  let request;
  let config;
  let sessionStore;
  const API_PREFIX = '/api/v1';

  before(async () => {
    mongod = await MongoMemoryServer.create();
    config = loadEnvironment({
      NODE_ENV: 'test',
      PORT: 0,
      MONGODB_URI: mongod.getUri(),
      CLIENT_ORIGIN: 'http://localhost:5173',
      SESSION_SECRET: 'test-secret-at-least-32-characters-long',
      SESSION_NAME: 'lifestream.sid',
      SESSION_TTL_DAYS: '1',
      BCRYPT_ROUNDS: '10',
      LOG_LEVEL: 'silent',
    });
    config.rateLimitDisabled = true;
    await connectDatabase(config.mongoUri);
    sessionStore = createSessionStore(config);
    const app = createApp(config, sessionStore);
    server = createServer(app);
    server.listen(0);
    const port = server.address().port;
    request = supertest(`http://localhost:${port}`);
    request.app = server;
  });

  after(async () => {
    await server.close();
    await sessionStore.close();
    await disconnectDatabase();
    await mongod.stop();
  });

  beforeEach(async () => {
    await mongoose.connection.db.collection('users').deleteMany({});
    await mongoose.connection.db.collection('bloodrequests').deleteMany({});
    await mongoose.connection.db.collection('sessions').deleteMany({});
  });

  const createTestUser = async (overrides = {}) => {
    const passwordHash = await bcrypt.hash('TestPassword@123', config.bcryptRounds);
    return User.create({
      fullName: 'Request Owner',
      email: `requester-${Date.now()}@example.com`,
      passwordHash,
      phone: '0300-1234567',
      city: 'Lahore',
      bloodGroup: 'O+',
      role: 'donor',
      status: 'active',
      ...overrides,
    });
  };

  const loginUser = async (agent, email, password = 'TestPassword@123') => {
    return agent
      .post(`${API_PREFIX}/auth/login`)
      .send({ email, password });
  };

  describe('POST /api/v1/requests', () => {
    const validRequestBody = {
      patient: 'Sara Ahmed',
      hospital: 'Mayo Hospital',
      bloodGroup: 'O+',
      units: 2,
      component: 'Whole Blood',
      urgency: 'Critical',
      neededBy: new Date(Date.now() + 86400000).toISOString(),
      location: 'Lahore',
      contactNumber: '0300-5550101',
      email: 'sara@example.com',
      note: 'Emergency surgery',
    };

    it('creates blood request as guest (anonymous)', async () => {
      const response = await request
        .post(`${API_PREFIX}/requests`)
        .send(validRequestBody);

      assert.equal(response.status, 201);
      assert.equal(response.body.success, true);
      assert.equal(response.body.data.patient, 'Sara Ahmed');
      assert.equal(response.body.data.userId, null);
      assert.equal(response.body.data.status, 'Pending');
    });

    it('creates and links request to user when logged in', async () => {
      const user = await createTestUser();
      const agent = supertest.agent(server);
      await loginUser(agent, user.email);

      const response = await agent
        .post(`${API_PREFIX}/requests`)
        .send(validRequestBody);

      assert.equal(response.status, 201);
      assert.equal(response.body.data.userId, String(user._id));
    });

    it('rejects invalid Pakistani phone with 400', async () => {
      const response = await request
        .post(`${API_PREFIX}/requests`)
        .send({
          ...validRequestBody,
          contactNumber: '000-111',
        });

      assert.equal(response.status, 400);
      assert.equal(response.body.error.code, 'VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/requests', () => {
    it('returns public list of requests', async () => {
      await BloodRequest.create({
        patient: 'Patient A',
        hospital: 'Hospital A',
        bloodGroup: 'B+',
        units: 1,
        component: 'Whole Blood',
        urgency: 'Urgent',
        neededBy: new Date(Date.now() + 86400000),
        location: 'Islamabad',
        contactNumber: '0300-1122334',
        status: 'Pending',
      });

      const response = await request.get(`${API_PREFIX}/requests`);
      assert.equal(response.status, 200);
      assert.equal(response.body.data.total, 1);
      assert.equal(response.body.data.requests[0].patient, 'Patient A');
    });

    it('filters requests by location and bloodGroup', async () => {
      await BloodRequest.create([
        {
          patient: 'Lahore O+',
          hospital: 'Hosp 1',
          bloodGroup: 'O+',
          units: 1,
          component: 'Whole Blood',
          urgency: 'Urgent',
          neededBy: new Date(Date.now() + 86400000),
          location: 'Lahore',
          contactNumber: '0300-1122334',
          status: 'Pending',
        },
        {
          patient: 'Karachi A+',
          hospital: 'Hosp 2',
          bloodGroup: 'A+',
          units: 1,
          component: 'Whole Blood',
          urgency: 'Routine',
          neededBy: new Date(Date.now() + 86400000),
          location: 'Karachi',
          contactNumber: '0300-5566778',
          status: 'Pending',
        },
      ]);

      const response = await request.get(`${API_PREFIX}/requests?bloodGroup=${encodeURIComponent('O+')}&location=Lahore`);
      assert.equal(response.status, 200);
      assert.equal(response.body.data.total, 1);
      assert.equal(response.body.data.requests[0].patient, 'Lahore O+');
    });
  });

  describe('PUT /api/v1/requests/:id & DELETE /api/v1/requests/:id', () => {
    it('allows owner to update note or urgency', async () => {
      const user = await createTestUser();
      const bloodReq = await BloodRequest.create({
        userId: user._id,
        patient: 'Owner Patient',
        hospital: 'Owner Hosp',
        bloodGroup: 'AB+',
        units: 1,
        component: 'Platelets',
        urgency: 'Routine',
        neededBy: new Date(Date.now() + 86400000),
        location: 'Lahore',
        contactNumber: '0300-1122334',
        status: 'Pending',
      });

      const agent = supertest.agent(server);
      await loginUser(agent, user.email);

      const response = await agent
        .put(`${API_PREFIX}/requests/${bloodReq._id}`)
        .send({
          urgency: 'Critical',
          note: 'Condition worsened, need ASAP',
        });

      assert.equal(response.status, 200);
      assert.equal(response.body.data.urgency, 'Critical');
      assert.equal(response.body.data.note, 'Condition worsened, need ASAP');
    });

    it('rejects update from unauthorized user with 403', async () => {
      const owner = await createTestUser({ email: 'owner@test.com' });
      const stranger = await createTestUser({ email: 'stranger@test.com' });

      const bloodReq = await BloodRequest.create({
        userId: owner._id,
        patient: 'Owner Patient',
        hospital: 'Owner Hosp',
        bloodGroup: 'AB+',
        units: 1,
        component: 'Platelets',
        urgency: 'Routine',
        neededBy: new Date(Date.now() + 86400000),
        location: 'Lahore',
        contactNumber: '0300-1122334',
        status: 'Pending',
      });

      const agent = supertest.agent(server);
      await loginUser(agent, stranger.email);

      const response = await agent
        .put(`${API_PREFIX}/requests/${bloodReq._id}`)
        .send({ urgency: 'Critical' });

      assert.equal(response.status, 403);
      assert.equal(response.body.error.code, 'FORBIDDEN');
    });

    it('allows owner to cancel their request', async () => {
      const user = await createTestUser();
      const bloodReq = await BloodRequest.create({
        userId: user._id,
        patient: 'Cancel Me',
        hospital: 'Hosp',
        bloodGroup: 'O-',
        units: 1,
        component: 'Whole Blood',
        urgency: 'Urgent',
        neededBy: new Date(Date.now() + 86400000),
        location: 'Lahore',
        contactNumber: '0300-1122334',
        status: 'Pending',
      });

      const agent = supertest.agent(server);
      await loginUser(agent, user.email);

      const response = await agent.delete(`${API_PREFIX}/requests/${bloodReq._id}`);
      assert.equal(response.status, 200);
      assert.equal(response.body.data.status, 'Cancelled');
    });
  });
});
