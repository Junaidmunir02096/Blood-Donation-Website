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
import { Donor } from '../src/models/Donor.js';
import bcrypt from 'bcrypt';

describe('Donor API', () => {
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
    await mongoose.connection.db.collection('donors').deleteMany({});
    await mongoose.connection.db.collection('sessions').deleteMany({});
  });

  const createTestUser = async (overrides = {}) => {
    const passwordHash = await bcrypt.hash('TestPassword@123', config.bcryptRounds);
    return User.create({
      fullName: 'Test User',
      email: `user-${Date.now()}@example.com`,
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

  describe('GET /api/v1/donors', () => {
    it('returns verified donors with masked phone numbers for anonymous visitors', async () => {
      await Donor.create([
        {
          name: 'Tariq Mehmood',
          bloodGroup: 'O+',
          city: 'Lahore',
          phone: '0300-9876543',
          canContact: true,
          status: 'verified',
        },
        {
          name: 'Pending Donor',
          bloodGroup: 'A+',
          city: 'Karachi',
          phone: '0321-1122334',
          canContact: true,
          status: 'pending',
        },
      ]);

      const response = await request.get(`${API_PREFIX}/donors`);
      assert.equal(response.status, 200);
      assert.equal(response.body.success, true);
      assert.equal(response.body.data.total, 1);
      assert.equal(response.body.data.donors.length, 1);
      assert.equal(response.body.data.donors[0].name, 'Tariq Mehmood');
      // Phone should be masked for anonymous user
      assert.match(response.body.data.donors[0].phone, /0300-\*\*\*6543/);
    });

    it('filters donors by bloodGroup and city', async () => {
      await Donor.create([
        {
          name: 'Donor Lahore O+',
          bloodGroup: 'O+',
          city: 'Lahore',
          phone: '0300-1111111',
          canContact: true,
          status: 'verified',
        },
        {
          name: 'Donor Karachi O+',
          bloodGroup: 'O+',
          city: 'Karachi',
          phone: '0300-2222222',
          canContact: true,
          status: 'verified',
        },
        {
          name: 'Donor Lahore B+',
          bloodGroup: 'B+',
          city: 'Lahore',
          phone: '0300-3333333',
          canContact: true,
          status: 'verified',
        },
      ]);

      const response = await request.get(`${API_PREFIX}/donors?bloodGroup=${encodeURIComponent('O+')}&city=Lahore`);
      assert.equal(response.status, 200);
      assert.equal(response.body.data.total, 1);
      assert.equal(response.body.data.donors[0].name, 'Donor Lahore O+');
    });
  });

  describe('GET /api/v1/donors/:id', () => {
    it('returns a donor by ID', async () => {
      const donor = await Donor.create({
        name: 'Single Donor',
        bloodGroup: 'AB+',
        city: 'Islamabad',
        phone: '0300-5555555',
        canContact: true,
        status: 'verified',
      });

      const response = await request.get(`${API_PREFIX}/donors/${donor._id}`);
      assert.equal(response.status, 200);
      assert.equal(response.body.success, true);
      assert.equal(response.body.data.name, 'Single Donor');
    });

    it('returns 404 when donor is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request.get(`${API_PREFIX}/donors/${nonExistentId}`);
      assert.equal(response.status, 404);
      assert.equal(response.body.error.code, 'DONOR_NOT_FOUND');
    });
  });

  describe('POST /api/v1/donors', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const response = await request
        .post(`${API_PREFIX}/donors`)
        .send({
          name: 'Unauthorized Donor',
          bloodGroup: 'O+',
          city: 'Lahore',
          phone: '0300-1234567',
        });

      assert.equal(response.status, 401);
      assert.equal(response.body.error.code, 'UNAUTHENTICATED');
    });

    it('registers donor profile for logged-in user with status pending', async () => {
      const user = await createTestUser();
      const agent = supertest.agent(server);
      await loginUser(agent, user.email);

      const response = await agent
        .post(`${API_PREFIX}/donors`)
        .send({
          name: 'Logged In Donor',
          bloodGroup: 'A+',
          city: 'Rawalpindi',
          phone: '0300-7654321',
          canContact: true,
        });

      assert.equal(response.status, 201);
      assert.equal(response.body.success, true);
      assert.equal(response.body.data.name, 'Logged In Donor');
      assert.equal(response.body.data.status, 'pending');
      assert.equal(response.body.data.userId, String(user._id));
      // User viewing their own profile sees full phone
      assert.equal(response.body.data.phone, '0300-7654321');
    });

    it('rejects invalid Pakistani phone with 400', async () => {
      const user = await createTestUser();
      const agent = supertest.agent(server);
      await loginUser(agent, user.email);

      const response = await agent
        .post(`${API_PREFIX}/donors`)
        .send({
          name: 'Invalid Phone',
          bloodGroup: 'A+',
          city: 'Rawalpindi',
          phone: '12345',
        });

      assert.equal(response.status, 400);
      assert.equal(response.body.error.code, 'VALIDATION_ERROR');
    });

    it('rejects invalid blood group with 400', async () => {
      const user = await createTestUser();
      const agent = supertest.agent(server);
      await loginUser(agent, user.email);

      const response = await agent
        .post(`${API_PREFIX}/donors`)
        .send({
          name: 'Invalid Blood',
          bloodGroup: 'Z+',
          city: 'Rawalpindi',
          phone: '0300-1234567',
        });

      assert.equal(response.status, 400);
      assert.equal(response.body.error.code, 'VALIDATION_ERROR');
    });
  });

  describe('PUT /api/v1/donors/:id', () => {
    it('allows owner to update their donor profile', async () => {
      const user = await createTestUser();
      const donor = await Donor.create({
        userId: user._id,
        name: 'Initial Name',
        bloodGroup: 'O+',
        city: 'Lahore',
        phone: '0300-1122334',
        status: 'pending',
      });

      const agent = supertest.agent(server);
      await loginUser(agent, user.email);

      const response = await agent
        .put(`${API_PREFIX}/donors/${donor._id}`)
        .send({
          name: 'Updated Name',
          city: 'Faisalabad',
        });

      assert.equal(response.status, 200);
      assert.equal(response.body.data.name, 'Updated Name');
      assert.equal(response.body.data.city, 'Faisalabad');
    });

    it('prevents regular users from elevating status to verified with 403', async () => {
      const user = await createTestUser();
      const donor = await Donor.create({
        userId: user._id,
        name: 'Hacker Attempt',
        bloodGroup: 'O+',
        city: 'Lahore',
        phone: '0300-1122334',
        status: 'pending',
      });

      const agent = supertest.agent(server);
      await loginUser(agent, user.email);

      const response = await agent
        .put(`${API_PREFIX}/donors/${donor._id}`)
        .send({
          status: 'verified',
        });

      assert.equal(response.status, 403);
      assert.equal(response.body.error.code, 'FORBIDDEN');
    });
  });
});
