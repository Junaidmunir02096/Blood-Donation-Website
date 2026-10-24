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
import { BloodRequest } from '../src/models/BloodRequest.js';
import bcrypt from 'bcrypt';

describe('Admin RBAC API', () => {
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
    await mongoose.connection.db.collection('bloodrequests').deleteMany({});
    await mongoose.connection.db.collection('sessions').deleteMany({});
  });

  const createUser = async (overrides = {}) => {
    const passwordHash = await bcrypt.hash('TestPassword@123', config.bcryptRounds);
    return User.create({
      fullName: 'Regular User',
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

  const createAdmin = async (overrides = {}) => {
    return createUser({
      fullName: 'Admin User',
      email: `admin-${Date.now()}@example.com`,
      role: 'admin',
      ...overrides,
    });
  };

  const loginUser = async (agent, email, password = 'TestPassword@123') => {
    return agent
      .post(`${API_PREFIX}/auth/login`)
      .send({ email, password });
  };

  describe('RBAC Access Guard', () => {
    it('blocks anonymous access with 401 UNAUTHENTICATED', async () => {
      const response = await request.get(`${API_PREFIX}/admin/users`);
      assert.equal(response.status, 401);
      assert.equal(response.body.error.code, 'UNAUTHENTICATED');
    });

    it('blocks regular donor role with 403 FORBIDDEN', async () => {
      const regularUser = await createUser();
      const agent = supertest.agent(server);
      await loginUser(agent, regularUser.email);

      const response = await agent.get(`${API_PREFIX}/admin/users`);
      assert.equal(response.status, 403);
      assert.equal(response.body.error.code, 'FORBIDDEN');
    });

    it('grants full access to admin user with 200 OK', async () => {
      const adminUser = await createAdmin();
      const agent = supertest.agent(server);
      await loginUser(agent, adminUser.email);

      const response = await agent.get(`${API_PREFIX}/admin/users`);
      assert.equal(response.status, 200);
      assert.equal(response.body.success, true);
    });
  });

  describe('User Management', () => {
    it('allows admin to list and search users', async () => {
      const admin = await createAdmin();
      await createUser({ fullName: 'Special Donor', email: 'special@example.com' });

      const agent = supertest.agent(server);
      await loginUser(agent, admin.email);

      const response = await agent.get(`${API_PREFIX}/admin/users?q=Special`);
      assert.equal(response.status, 200);
      assert.equal(response.body.data.total, 1);
      assert.equal(response.body.data.users[0].fullName, 'Special Donor');
    });

    it('allows admin to update user status and role', async () => {
      const admin = await createAdmin();
      const targetUser = await createUser();

      const agent = supertest.agent(server);
      await loginUser(agent, admin.email);

      const response = await agent
        .put(`${API_PREFIX}/admin/users/${targetUser._id}`)
        .send({ status: 'inactive' });

      assert.equal(response.status, 200);
      assert.equal(response.body.data.status, 'inactive');
    });

    it('prevents admin from removing their own admin role', async () => {
      const admin = await createAdmin();
      const agent = supertest.agent(server);
      await loginUser(agent, admin.email);

      const response = await agent
        .put(`${API_PREFIX}/admin/users/${admin._id}`)
        .send({ role: 'donor' });

      assert.equal(response.status, 400);
      assert.equal(response.body.error.code, 'OPERATION_NOT_ALLOWED');
    });

    it('allows admin to delete another user', async () => {
      const admin = await createAdmin();
      const targetUser = await createUser();

      const agent = supertest.agent(server);
      await loginUser(agent, admin.email);

      const response = await agent.delete(`${API_PREFIX}/admin/users/${targetUser._id}`);
      assert.equal(response.status, 200);

      const found = await User.findById(targetUser._id);
      assert.equal(found, null);
    });
  });

  describe('Donor Verification & Management', () => {
    it('allows admin to view pending donors and verify them', async () => {
      const admin = await createAdmin();
      const donor = await Donor.create({
        name: 'Pending Applicant',
        bloodGroup: 'B+',
        city: 'Lahore',
        phone: '0300-1122334',
        status: 'pending',
      });

      const agent = supertest.agent(server);
      await loginUser(agent, admin.email);

      // Verify donor
      const verifyRes = await agent
        .put(`${API_PREFIX}/admin/donors/${donor._id}`)
        .send({ status: 'verified' });

      assert.equal(verifyRes.status, 200);
      assert.equal(verifyRes.body.data.status, 'verified');

      const updatedInDb = await Donor.findById(donor._id);
      assert.equal(updatedInDb.status, 'verified');
    });

    it('allows admin to delete a donor profile', async () => {
      const admin = await createAdmin();
      const donor = await Donor.create({
        name: 'Remove Me',
        bloodGroup: 'O+',
        city: 'Karachi',
        phone: '0300-7766554',
        status: 'verified',
      });

      const agent = supertest.agent(server);
      await loginUser(agent, admin.email);

      const response = await agent.delete(`${API_PREFIX}/admin/donors/${donor._id}`);
      assert.equal(response.status, 200);

      const found = await Donor.findById(donor._id);
      assert.equal(found, null);
    });
  });

  describe('Blood Request Admin Management', () => {
    it('allows admin to approve and reject blood requests', async () => {
      const admin = await createAdmin();
      const bloodReq = await BloodRequest.create({
        patient: 'Need Approval',
        hospital: 'City Hospital',
        bloodGroup: 'A+',
        units: 2,
        component: 'Whole Blood',
        urgency: 'Critical',
        neededBy: new Date(Date.now() + 86400000),
        location: 'Islamabad',
        contactNumber: '0300-9988776',
        status: 'Pending',
      });

      const agent = supertest.agent(server);
      await loginUser(agent, admin.email);

      const approveRes = await agent
        .put(`${API_PREFIX}/admin/requests/${bloodReq._id}`)
        .send({ status: 'Approved' });

      assert.equal(approveRes.status, 200);
      assert.equal(approveRes.body.data.status, 'Approved');
    });

    it('allows admin to delete a blood request', async () => {
      const admin = await createAdmin();
      const bloodReq = await BloodRequest.create({
        patient: 'Spam Request',
        hospital: 'Fake Hospital',
        bloodGroup: 'O-',
        units: 1,
        component: 'Whole Blood',
        urgency: 'Routine',
        neededBy: new Date(Date.now() + 86400000),
        location: 'Lahore',
        contactNumber: '0300-1122334',
        status: 'Pending',
      });

      const agent = supertest.agent(server);
      await loginUser(agent, admin.email);

      const response = await agent.delete(`${API_PREFIX}/admin/requests/${bloodReq._id}`);
      assert.equal(response.status, 200);

      const found = await BloodRequest.findById(bloodReq._id);
      assert.equal(found, null);
    });
  });

  describe('Admin Platform Stats', () => {
    it('returns aggregate counts for admin overview', async () => {
      const admin = await createAdmin();
      await Donor.create({
        name: 'D1',
        bloodGroup: 'A+',
        city: 'Lahore',
        phone: '0300-1111111',
        status: 'verified',
      });
      await BloodRequest.create({
        patient: 'P1',
        hospital: 'H1',
        bloodGroup: 'O+',
        units: 1,
        neededBy: new Date(Date.now() + 86400000),
        location: 'Lahore',
        contactNumber: '0300-1111111',
        status: 'Pending',
      });

      const agent = supertest.agent(server);
      await loginUser(agent, admin.email);

      const response = await agent.get(`${API_PREFIX}/admin/stats`);
      assert.equal(response.status, 200);
      assert.equal(response.body.data.pendingRequests, 1);
      assert.equal(response.body.data.totalDonors, 1);
      assert.equal(response.body.data.verifiedDonors, 1);
    });
  });
});
