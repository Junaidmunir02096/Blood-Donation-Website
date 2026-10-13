import { describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { createApp } from '../src/app.js';
import { createSessionStore } from '../src/config/session.js';
import { loadEnvironment } from '../src/config/environment.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { createServer } from 'node:http';

describe('Authentication API', () => {
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
    await connectDatabase(config.mongoUri);
    sessionStore = createSessionStore(config);
    const app = createApp(config, sessionStore);
    server = createServer(app);
    server.listen(0);
    const port = server.address().port;
    request = supertest(`http://localhost:${port}`);
  });

  after(async () => {
    await server.close();
    await sessionStore.close();
    await disconnectDatabase();
    await mongod.stop();
  });

  beforeEach(async () => {
    await mongoose.connection.db.collection('users').deleteMany({});
    await mongoose.connection.db.collection('sessions').deleteMany({});
  });

  const validRegistration = {
    fullName: 'Ahmed Khan',
    email: 'ahmed@example.com',
    password: 'StrongPassword@123',
    confirmPassword: 'StrongPassword@123',
    bloodGroup: 'O+',
    phone: '0300-1234567',
    city: 'Lahore',
  };

  describe('POST /api/v1/auth/register', () => {
    it('registers a valid user and creates a session', async () => {
      const response = await request
        .post(`${API_PREFIX}/auth/register`)
        .send(validRegistration)
        .expect(201);

      assert.equal(response.body.success, true);
      assert.ok(response.body.data.user);
      assert.equal(response.body.data.user.email, validRegistration.email);
      assert.equal(response.body.data.user.role, 'donor');
      assert.ok(response.body.data.user.id);
      assert.ok(!response.body.data.user.passwordHash);

      const cookie = response.headers['set-cookie'];
      assert.ok(cookie);
      assert.ok(cookie.some((c) => c.startsWith('lifestream.sid=')));
    });

    it('normalizes email to lowercase', async () => {
      await request
        .post(`${API_PREFIX}/auth/register`)
        .send({ ...validRegistration, email: 'AHMED@EXAMPLE.COM' })
        .expect(201);

      const user = await mongoose.connection.db.collection('users').findOne({ email: 'ahmed@example.com' });
      assert.ok(user);
    });

    it('hashes password and never returns it', async () => {
      const response = await request
        .post(`${API_PREFIX}/auth/register`)
        .send(validRegistration)
        .expect(201);

      const user = await mongoose.connection.db.collection('users').findOne({ email: validRegistration.email });
      assert.notEqual(user.passwordHash, validRegistration.password);
      assert.ok(user.passwordHash.startsWith('$2b$'));
      assert.equal(response.body.data.user.passwordHash, undefined);
    });

    it('rejects duplicate email case-insensitively', async () => {
      await request
        .post(`${API_PREFIX}/auth/register`)
        .send(validRegistration)
        .expect(201);

      const response = await request
        .post(`${API_PREFIX}/auth/register`)
        .send({ ...validRegistration, email: 'AHMED@EXAMPLE.COM' })
        .expect(409);

      assert.equal(response.body.error.code, 'EMAIL_ALREADY_EXISTS');
    });

    it('rejects invalid email format', async () => {
      await request
        .post(`${API_PREFIX}/auth/register`)
        .send({ ...validRegistration, email: 'not-an-email' })
        .expect(400);
    });

    it('rejects weak password', async () => {
      await request
        .post(`${API_PREFIX}/auth/register`)
        .send({ ...validRegistration, password: 'weak', confirmPassword: 'weak' })
        .expect(400);
    });

    it('rejects mismatched passwords', async () => {
      await request
        .post(`${API_PREFIX}/auth/register`)
        .send({ ...validRegistration, confirmPassword: 'DifferentPassword@123' })
        .expect(400);
    });

    it('rejects invalid Pakistani phone', async () => {
      await request
        .post(`${API_PREFIX}/auth/register`)
        .send({ ...validRegistration, phone: '555-1234' })
        .expect(400);
    });

    it('rejects invalid blood group', async () => {
      await request
        .post(`${API_PREFIX}/auth/register`)
        .send({ ...validRegistration, bloodGroup: 'X+' })
        .expect(400);
    });

    it('rejects submitted admin role', async () => {
      await request
        .post(`${API_PREFIX}/auth/register`)
        .send({ ...validRegistration, role: 'admin' })
        .expect(201);

      const user = await mongoose.connection.db.collection('users').findOne({ email: validRegistration.email });
      assert.equal(user.role, 'donor');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request
        .post(`${API_PREFIX}/auth/register`)
        .send(validRegistration)
        .expect(201);
    });

    it('logs in with correct credentials', async () => {
      const response = await request
        .post(`${API_PREFIX}/auth/login`)
        .send({ email: validRegistration.email, password: validRegistration.password })
        .expect(200);

      assert.equal(response.body.success, true);
      assert.equal(response.body.data.user.email, validRegistration.email);
      assert.ok(response.headers['set-cookie']);
    });

    it('rejects wrong password with generic error', async () => {
      const response = await request
        .post(`${API_PREFIX}/auth/login`)
        .send({ email: validRegistration.email, password: 'WrongPassword@123' })
        .expect(401);

      assert.equal(response.body.error.code, 'INVALID_CREDENTIALS');
    });

    it('rejects unknown email with same generic error', async () => {
      const response = await request
        .post(`${API_PREFIX}/auth/login`)
        .send({ email: 'unknown@example.com', password: validRegistration.password })
        .expect(401);

      assert.equal(response.body.error.code, 'INVALID_CREDENTIALS');
    });

    it('rejects inactive account after correct password', async () => {
      await mongoose.connection.db.collection('users').updateOne(
        { email: validRegistration.email },
        { $set: { status: 'inactive' } }
      );

      const response = await request
        .post(`${API_PREFIX}/auth/login`)
        .send({ email: validRegistration.email, password: validRegistration.password })
        .expect(403);

      assert.equal(response.body.error.code, 'ACCOUNT_INACTIVE');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('destroys session and clears cookie', async () => {
      const agent = supertest.agent(request.app);
      await agent
        .post(`${API_PREFIX}/auth/register`)
        .send(validRegistration)
        .expect(201);

      const logoutResponse = await agent
        .post(`${API_PREFIX}/auth/logout`)
        .expect(204);

      const cookie = logoutResponse.headers['set-cookie'];
      assert.ok(cookie);
      assert.ok(cookie.some((c) => c.startsWith('lifestream.sid=;')) || cookie.some((c) => c.startsWith('lifestream.sid=; ')));
    });

    it('is idempotent', async () => {
      const agent = supertest.agent(request.app);
      await agent
        .post(`${API_PREFIX}/auth/register`)
        .send(validRegistration)
        .expect(201);

      await agent.post(`${API_PREFIX}/auth/logout`).expect(204);
      await agent.post(`${API_PREFIX}/auth/logout`).expect(204);
    });
  });

  describe('GET /api/v1/auth/session', () => {
    it('returns authenticated: false when anonymous', async () => {
      const response = await request
        .get(`${API_PREFIX}/auth/session`)
        .expect(200);

      assert.equal(response.body.success, true);
      assert.equal(response.body.data.authenticated, false);
      assert.equal(response.body.data.user, null);
    });

    it('returns authenticated user when logged in', async () => {
      const agent = supertest.agent(request.app);
      await agent
        .post(`${API_PREFIX}/auth/register`)
        .send(validRegistration)
        .expect(201);

      const response = await agent
        .get(`${API_PREFIX}/auth/session`)
        .expect(200);

      assert.equal(response.body.success, true);
      assert.equal(response.body.data.authenticated, true);
      assert.equal(response.body.data.user.email, validRegistration.email);
    });

    it('destroys stale session for deleted user', async () => {
      const agent = supertest.agent(request.app);
      await agent
        .post(`${API_PREFIX}/auth/register`)
        .send(validRegistration)
        .expect(201);

      await mongoose.connection.db.collection('users').deleteOne({ email: validRegistration.email });

      const response = await agent
        .get(`${API_PREFIX}/auth/session`)
        .expect(200);

      assert.equal(response.body.data.authenticated, false);
      assert.equal(response.body.data.user, null);
    });

    it('destroys stale session for inactive user', async () => {
      const agent = supertest.agent(request.app);
      await agent
        .post(`${API_PREFIX}/auth/register`)
        .send(validRegistration)
        .expect(201);

      await mongoose.connection.db.collection('users').updateOne(
        { email: validRegistration.email },
        { $set: { status: 'inactive' } }
      );

      const response = await agent
        .get(`${API_PREFIX}/auth/session`)
        .expect(200);

      assert.equal(response.body.data.authenticated, false);
    });
  });

  describe('Health endpoint', () => {
    it('reports database as connected', async () => {
      const response = await request
        .get(`${API_PREFIX}/health`)
        .expect(200);

      assert.equal(response.body.success, true);
      assert.equal(response.body.data.database, 'connected');
    });
  });

  describe('Rate limiting', () => {
    it('limits register attempts', async () => {
      const agent = supertest.agent(request.app);
      for (let i = 0; i < 5; i++) {
        await agent
          .post(`${API_PREFIX}/auth/register`)
          .send({ ...validRegistration, email: `user${i}@example.com` })
          .expect(201);
      }

      const response = await agent
        .post(`${API_PREFIX}/auth/register`)
        .send({ ...validRegistration, email: 'limited@example.com' })
        .expect(429);

      assert.equal(response.body.error.code, 'RATE_LIMIT_EXCEEDED');
    });

    it('limits login attempts', async () => {
      const agent = supertest.agent(request.app);
      await agent
        .post(`${API_PREFIX}/auth/register`)
        .send(validRegistration)
        .expect(201);

      for (let i = 0; i < 10; i++) {
        await agent
          .post(`${API_PREFIX}/auth/login`)
          .send({ email: validRegistration.email, password: 'WrongPassword@123' })
          .expect(401);
      }

      const response = await agent
        .post(`${API_PREFIX}/auth/login`)
        .send({ email: validRegistration.email, password: 'WrongPassword@123' })
        .expect(429);

      assert.equal(response.body.error.code, 'RATE_LIMIT_EXCEEDED');
    });
  });
});