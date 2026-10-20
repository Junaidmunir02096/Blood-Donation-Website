---
name: fullstack-testing
description: >
  Testing workflow for LifeStream covering Node:test unit tests, Supertest
  integration tests, and Playwright E2E / browser tests. Use this skill when
  writing, fixing, or running any kind of test in this project.
---

# Fullstack Testing Skill — LifeStream

## When to Activate This Skill

Activate this skill when:
- **Writing a new test** for any backend endpoint, service, or frontend component.
- **Fixing a failing test** (unit, integration, or E2E).
- **Adding a new npm package** to the server test dependencies.
- **Setting up a new test environment** or configuring Playwright.
- **Verifying that all tests pass** before committing or deploying.

---

## 1. Test Architecture Overview

```
Blood-Donation-website/
├── tests/
│   └── utils.test.js          ← Frontend utility unit tests (Node:test, no server)
│                                 Run: npm test (from root)
│                                 Status: ✅ 5/5 passing
│
└── server/
    └── tests/
        ├── auth.test.js        ← Backend integration tests (Node:test + Supertest + MongoMemoryServer)
        │                         Run: npm --prefix server test
        │                         Status: ❌ BROKEN — missing devDependencies (see fix below)
        │
        ├── e2e/
        │   ├── auth.api.ts     ← Playwright API tests (requires live Express + MongoDB)
        │   │                     Run: npm --prefix server run test:api
        │   │
        │   └── frontend.e2e.ts ← Playwright browser E2E tests (mocked API, Chromium)
        │                         Run: npm run test:e2e (from root)
        │                         Status: ✅ 5/5 passing
        │
        └── fixtures/
            └── api.ts           ← Shared Playwright request fixtures
```

---

## 2. Fixing the Broken Backend Test Suite (Issue #1)

The file `server/tests/auth.test.js` imports two packages that are not installed:
- `mongodb-memory-server` — in-memory MongoDB for isolated tests.
- `supertest` — HTTP request library for testing Express apps.

### Fix: Install missing devDependencies

```bash
# From the project root
npm --prefix server install --save-dev mongodb-memory-server supertest
```

After installing, verify:
```bash
npm --prefix server test
```
Expected: `✔ Authentication API` with all describe blocks passing.

---

## 3. Writing Backend Integration Tests (Node:test + Supertest)

Backend tests use Node's built-in test runner (`node:test`). No external test framework (Jest, Mocha) is used.

### Template: Testing a New Endpoint

```js
// server/tests/donor.test.js
import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { createApp } from '../src/app.js';
import { createSessionStore } from '../src/config/session.js';
import { loadEnvironment } from '../src/config/environment.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { createServer } from 'node:http';

describe('Donor API', () => {
  let mongod, server, request, config;

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
    const sessionStore = createSessionStore(config);
    const app = createApp(config, sessionStore);
    server = createServer(app);
    server.listen(0);
    const port = server.address().port;
    request = supertest(`http://localhost:${port}`);
  });

  after(async () => {
    server.close();
    await disconnectDatabase();
    await mongod.stop();
  });

  // ── Happy path ─────────────────────────────────────────────
  it('GET /api/v1/donors returns empty list when no donors exist', async () => {
    const res = await request.get('/api/v1/donors');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.donors));
    assert.equal(res.body.data.donors.length, 0);
  });

  // ── Auth guard ─────────────────────────────────────────────
  it('POST /api/v1/donors requires authentication', async () => {
    const res = await request
      .post('/api/v1/donors')
      .send({ bloodGroup: 'O+', city: 'Lahore', phone: '0300-1234567' });
    assert.equal(res.status, 401);
    assert.equal(res.body.error.code, 'UNAUTHENTICATED');
  });

  // ── Validation error ───────────────────────────────────────
  it('POST /api/v1/donors returns 400 for missing required fields', async () => {
    // (Assumes session helper to log in first — see auth.test.js for pattern)
    // ... get session cookie from login, then:
    const res = await request
      .post('/api/v1/donors')
      .set('Cookie', 'SESSION_COOKIE_HERE')
      .send({});
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
    assert.ok(res.body.error.fields);
  });
});
```

### Key Patterns from `auth.test.js` to Reuse

1. **Session cookie helper:** After `POST /auth/login`, extract the `set-cookie` header and attach it to subsequent requests.
2. **User factory:** Use `User.create({...})` directly in `beforeEach` for test data — do NOT seed via API unless testing the API itself.
3. **Clean state:** `beforeEach` should run `await collection.deleteMany({})` to isolate each test.

---

## 4. Writing Frontend E2E Tests (Playwright)

Frontend E2E tests live in `server/tests/e2e/frontend.e2e.ts` and run in Chromium.

### Critical Rule: Mock All API Calls

Frontend tests must not depend on a real MongoDB or Express server. Every `**/api/v1/**` route must be intercepted with `page.route()`.

```ts
// server/tests/e2e/frontend.e2e.ts — adding a new test

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/**', async (route) => {
    const path = new URL(route.request().url()).pathname;

    // Always mock the session check (unauthenticated by default)
    if (path.endsWith('/auth/session')) {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { authenticated: false, user: null } }),
      });
      return;
    }

    // Mock the donors list
    if (path.endsWith('/donors')) {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { donors: MOCK_DONORS, total: 2 } }),
      });
      return;
    }

    // Default: return 404 for unmocked routes
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, error: { message: 'Not mocked' } }),
    });
  });
});

// New test example
test('shows empty state when no donors match filter', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('button', { name: 'B-', exact: true }).click();
  // With mock data containing only O+ and A+ donors, B- should show empty state
  await expect(page.getByText('No donors found')).toBeVisible();
});
```

### Playwright Commands Reference
```bash
# Run frontend E2E tests (headless Chromium + Vite auto-start)
npm run test:e2e

# Run with visible browser window (for debugging)
npm run test:e2e:headed

# Open Playwright interactive UI
npm run test:e2e:ui

# Run API E2E tests (requires live server at localhost:5000)
npm --prefix server run test:api
```

---

## 5. Frontend Unit Tests (Node:test)

Frontend utility tests live in `tests/utils.test.js` and run from the root with `npm test`.

```js
// tests/utils.test.js — adding a new utility test
import test from 'node:test';
import assert from 'node:assert/strict';
import { myNewUtil } from '../src/utils/myNewUtil.js';

test('myNewUtil handles edge cases correctly', () => {
  assert.equal(myNewUtil(null), '');
  assert.equal(myNewUtil('valid'), 'VALID');
});
```

---

## 6. Test Acceptance Checklist

Before marking any feature as complete:

### Backend Feature Checklist
- [ ] Happy path test passes (correct data, correct HTTP status).
- [ ] Validation error test passes (missing/invalid fields → 400 + `fields` map).
- [ ] Auth guard test passes (unauthenticated → 401).
- [ ] Role guard test passes (wrong role → 403), if applicable.
- [ ] Rate limit test passes (if endpoint has a rate limiter).
- [ ] `npm --prefix server test` shows 0 failing tests.

### Frontend Feature Checklist
- [ ] Primary user interaction covered by a Playwright test.
- [ ] Empty state rendered correctly when API returns zero results.
- [ ] Loading state shown while data is fetching.
- [ ] Error state shown when API returns an error.
- [ ] `npm run test:e2e` shows 0 failing tests.

### General Checklist
- [ ] `npx eslint src` reports 0 errors.
- [ ] `npm run build` completes without warnings.

---

## 7. Common Test Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `ERR_MODULE_NOT_FOUND: mongodb-memory-server` | Missing devDependency in `server/` | `npm --prefix server install --save-dev mongodb-memory-server supertest` |
| `Cannot find package 'supertest'` | Same as above | Same fix |
| Playwright `net::ERR_CONNECTION_REFUSED` | Vite dev server not starting | Check `playwright.config.ts` `webServer` config; run `npm run dev` manually |
| `ApiError` thrown in test | Frontend test hitting unmocked route | Add the route pattern to `page.route('**/api/v1/**', ...)` handler |
| `TypeError: Cannot read properties of undefined` | Missing mock session response | Always mock `/auth/session` in `beforeEach` |

---

## 8. CI/CD Test Pipeline (Target)

When CI is set up (GitHub Actions), tests run in this order:
1. `npm test` — Frontend utility tests (fast, no dependencies).
2. `npm run build` — Production build verification.
3. `npx eslint src` — Linting.
4. `npm --prefix server test` — Backend integration tests (with MongoDB in-memory).
5. `npm run test:e2e` — Playwright browser tests (Chromium, mocked API).

All 5 steps must pass before a PR can be merged.
