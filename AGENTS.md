# LifeStream — Agent & Contributor Reference

> **Last updated:** 2026-10-20 (Monorepo restructure complete)  
> **Product:** LifeStream Blood Donation Network  
> **Target Market:** Pakistan-focused healthcare SaaS (B2B + voluntary donor consumer)

---

## 1. Project Overview

LifeStream is a blood donation matching platform that connects voluntary blood donors with patients and hospitals across Pakistan.

**Architecture (current):** Full-stack monorepo — `client/` (React 19, Vite) + `server/` (Express 5, Node.js ESM) + MongoDB (Mongoose). Root orchestrated with npm workspaces + concurrently. Session-based authentication with HTTP-only cookies.

**Architecture (target):** Full-stack SaaS with multi-tenant Hospital/BloodBank accounts, role-based access control, subscription billing, and SMS/email notification dispatch.

### Repository Structure

```
Blood-Donation-website/          ← Monorepo root (npm workspaces)
├── client/                      ← React 19 frontend (Vite) — workspace: lifestream-client
│   ├── src/
│   │   ├── api/                 ← Fetch client (client.js) + service exports
│   │   ├── components/          ← Reusable UI components (BEM/SCSS)
│   │   ├── context/             ← AuthContext (backend session), AppDataContext (localStorage mock – to be retired)
│   │   ├── constants/           ← Blood groups, Pakistan cities/phones
│   │   ├── data/                ← Static seed / FAQ data
│   │   ├── hooks/               ← useAuth, useAppData, usePageTitle, etc.
│   │   ├── pages/               ← Route-level page components
│   │   ├── routes/              ← AppRoutes.jsx (React Router v6)
│   │   ├── services/            ← Domain service modules (donor, request, dashboard, etc.)
│   │   ├── styles/              ← global.scss, _variables.scss
│   │   └── utils/               ← avatar, csv, dateFormat, navigation, object, status
│   ├── public/                  ← Static assets (favicons, etc.)
│   ├── tests/
│   │   └── utils.test.js        ← Frontend utility unit tests (Node:test)
│   ├── index.html               ← Vite entry
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── .env                     ← VITE_API_BASE_URL (never commit real values)
│   └── package.json             ← name: "lifestream-client"
├── server/                      ← Express 5 backend (Node.js ESM) — workspace: lifestream-api
│   ├── src/
│   │   ├── app.js               ← Express factory (helmet, cors, session, routes)
│   │   ├── server.js            ← Entry point, DB connect, graceful shutdown
│   │   ├── config/              ← environment.js (Zod-validated), database.js, session.js
│   │   ├── constants/           ← user.js (roles, blood groups, phone regex)
│   │   ├── controllers/         ← auth.controller.js
│   │   ├── middleware/          ← validate.js, errorHandler.js, rateLimiters.js, notFound.js
│   │   ├── models/              ← User.js (only model so far)
│   │   ├── routes/              ← index.js (health), auth.routes.js
│   │   ├── schemas/             ← auth.schema.js (Zod)
│   │   ├── services/            ← auth.service.js
│   │   └── utils/               ← AppError.js, asyncHandler.js, sessionPromises.js, userResponse.js
│   ├── tests/
│   │   ├── auth.test.js         ← Node:test + Supertest integration tests (23 tests)
│   │   └── e2e/
│   │       ├── auth.api.ts      ← Playwright API tests (requires live server)
│   │       └── frontend.e2e.ts  ← Playwright browser E2E tests (Chromium, mocked API)
│   ├── .env                     ← Backend secrets (never commit real values)
│   └── package.json             ← name: "lifestream-api"
├── .gemini/skills/              ← AI agent skill files
│   ├── saas-architecture/SKILL.md
│   ├── fullstack-testing/SKILL.md
│   └── pakistan-health-reg/SKILL.md
├── .github/workflows/
│   └── ci.yml                   ← CI: frontend lint+test+build, backend tests, Playwright E2E
├── AGENTS.md                    ← This file
├── .gitignore
└── package.json                 ← Root monorepo orchestrator (workspaces + concurrently)
```

---

## 2. Technology Stack

| Layer | Technology | Version |
| :--- | :--- | :--- |
| Frontend Runtime | React | 19.2.6 |
| Frontend Build | Vite | 8.0.12 |
| Routing | React Router DOM | 6.30.3 |
| Styling | Sass/SCSS (BEM) | 1.105.1 |
| Icons | FontAwesome SVG Core | 6.7.2 |
| Maps | Leaflet + React-Leaflet | 1.9.4 / 5.0.0 |
| Charts | Recharts | 3.10.1 |
| Backend Runtime | Node.js (ES Modules) | ≥22 required |
| Backend Framework | Express | 5.3.0 |
| Database | MongoDB + Mongoose | 9.11.2 |
| Authentication | express-session + connect-mongo + bcrypt | 1.19.0 / 6.0.0 / 6.0.0 |
| Input Validation | Zod | 4.6.7 |
| Security | helmet, cors, express-rate-limit | Latest |
| Logging | pino + pino-http | 10.x / 11.x |
| Testing (Unit/Integration) | Node:test + Supertest + mongodb-memory-server | Built-in / 7.x / 10.x |
| Testing (E2E / Browser) | Playwright | 1.64.0 |

---

## 3. Active API Endpoints

### Backend (Express — `server/`)
```
─── Health & Auth ──────────────────────────────────────────
GET    /api/v1/health                 ← Database health check
POST   /api/v1/auth/register          ← Create account (rate limited: 5/15min)
POST   /api/v1/auth/login             ← Authenticate (rate limited: 10/15min)
POST   /api/v1/auth/logout            ← Destroy session
GET    /api/v1/auth/session           ← Rehydrate session (used on page load)

─── Donor ───────────────────────────────────────────────────
GET    /api/v1/donors                 ← Search/list verified donors (masked phones for public)
GET    /api/v1/donors/:id             ← Donor detail
POST   /api/v1/donors                 ← Register/update donor profile [auth required]
PUT    /api/v1/donors/:id             ← Update donor profile [owner or admin]

─── Blood Requests ──────────────────────────────────────────
GET    /api/v1/requests               ← List requests (filtered by user or public)
POST   /api/v1/requests               ← Create blood request [guests or logged-in users]
GET    /api/v1/requests/:id           ← Request detail
PUT    /api/v1/requests/:id           ← Update request status [owner or admin]
DELETE /api/v1/requests/:id           ← Cancel request [owner or admin]
```

### Planned Endpoints (NOT yet implemented — build these in order)
```
─── Dashboard / Stats ───────────────────────────────────────
GET  /api/v1/dashboard/summary      ← Active requests + nearby donors
GET  /api/v1/dashboard/stats        ← Aggregate counts

─── Admin ───────────────────────────────────────────────────
GET  /api/v1/admin/users            ← List all users [admin only]
GET  /api/v1/admin/donors           ← List all donors [admin only]
GET  /api/v1/admin/requests         ← List all requests [admin only]
PUT  /api/v1/admin/users/:id        ← Update user role/status [admin only]
```

---

## 4. Coding Standards

### 4.1 General Rules
- **No premature abstraction.** Write the simplest code that solves the problem. Refactor when patterns emerge.
- **Explicit over implicit.** Name variables, functions, and files clearly.
- **Small, reviewable changes.** Every change should be one complete, testable unit of work.
- **No secrets in code.** Never hardcode credentials, connection strings, or API keys. Use `.env` (local) and environment variables (production).

### 4.2 Backend (Express / Node.js)
- All backend code uses **ES Modules** (`import`/`export`) — no `require()`.
- Node.js minimum version: **22**. Use modern Node.js APIs freely.
- **Every route handler** must be wrapped with `asyncHandler` from `utils/asyncHandler.js`.
- **All inputs** entering controller functions must first pass a `validate({ body: schema })` middleware using a **Zod schema** defined in `server/src/schemas/`.
- **Throw `AppError`** (from `utils/AppError.js`) for all business logic errors. Never call `res.status(500).send(...)` directly in controllers.
- **Models** live in `server/src/models/`. Every model must have:
  - Indexed fields (email, role+status, tenant, bloodGroup+city for geo-search).
  - Schema-level validation (not just application-level).
  - `timestamps: true` on all schemas.
- **Services** contain business logic. **Controllers** only orchestrate request→service→response. Do not put DB queries inside controllers.

### 4.3 Frontend (React)
- Use **functional components** only. No class components.
- All data fetching lives in `src/services/` files (e.g., `donor.service.js`). Page/component JSX files must not contain raw `fetch()` or `apiClient` calls directly.
- State management: **React Context** for auth + app-wide data. **Local `useState`** for UI-only state (modals, form fields, loading flags).
- Styling: **SCSS with BEM methodology**. One `.scss` file per component. No inline styles except for truly dynamic values (e.g., `style={{ color: avatarColor }}`).
- Router guard: Use `ProtectedRoute` wrapper for any route requiring authentication. Check `useAuth().isLoggedIn` before rendering private content.
- Never read or write to `localStorage` from a React component directly. Use the context layer (`AppDataContext`, and eventually the API service layer).

### 4.4 API Client (Frontend)
- All backend calls go through `src/api/client.js` (`apiClient`).
- Auth-specific calls go through `authApi` (exported from `client.js`).
- Always handle `ApiError` in service files and return `{ ok: boolean, data?, error? }` shapes to callers.
- Include `credentials: 'include'` on all requests (already configured in `apiClient`).

---

## 5. Authentication & Authorization Model

### User Roles (Current)
```
'donor'   ← Default role for all registrations
'admin'   ← Full platform access (set manually in DB or by admin API)
```

### User Roles (Target — multi-tenant SaaS)
```
'donor'          ← Voluntary blood donor (global)
'hospital_admin' ← Manages a specific hospital/blood bank Organization
'hospital_staff' ← Read-only access to their Organization's requests
'admin'          ← Super-admin across all tenants
```

### Session Flow
1. User logs in → `POST /auth/login` → session saved in MongoDB (`sessions` collection) → HTTP-only cookie set.
2. On page load → `GET /auth/session` → session rehydrated in `AuthContext`.
3. Protected routes check `useAuth().isLoggedIn` client-side AND `request.session.userId` server-side.
4. Admin routes must verify `request.session.userId` AND `user.role === 'admin'` via middleware.

---

## 6. Database Conventions

- **Collection names:** Mongoose defaults (plural lowercase): `users`, `donors`, `bloodrequests`, `donations`, `sessions`.
- **ObjectId references:** Use `type: mongoose.Schema.Types.ObjectId, ref: 'ModelName'` for all foreign keys.
- **Indexes to always create:**
  - `email` (unique) on `users`.
  - `{ bloodGroup: 1, city: 1, status: 1 }` on `donors` for geo-search performance.
  - `{ status: 1, urgency: 1, createdAt: -1 }` on `bloodrequests`.
  - `{ userId: 1 }` on all user-owned sub-collections.
- **Never store plaintext passwords.** Only `passwordHash` (bcrypt, minimum 12 rounds).
- **Do not run destructive DB operations** (`drop`, `deleteMany`, `dropCollection`) without explicit human approval.

---

## 7. Environment Variables

### Frontend (`/client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Backend (`/server/.env`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lifestream
CLIENT_ORIGIN=http://localhost:5173
SESSION_SECRET=<minimum-32-character-random-secret>
SESSION_NAME=lifestream.sid
SESSION_TTL_DAYS=7
BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

> **Security Rule:** Never log, print, or include environment variable values in code reviews or AI responses. Reference only the variable name.

---

## 8. Testing Requirements

### Running Tests
```bash
# From monorepo root — run all tests
npm run test          # client unit tests (5) + server integration tests (23)
npm run test:all      # all three: client + server + Playwright E2E

# Individual workspaces
npm run test:client   # Frontend utility unit tests (5 tests, ~1s, no server needed)
npm run test:server   # Backend integration tests (23 tests, uses mongodb-memory-server)
npm run test:e2e      # Playwright E2E (5 tests, Chromium + Vite auto-start from client/)

# Or directly in each workspace
npm --prefix client test
npm --prefix server test
npm --prefix server run test:e2e
```

### Test Acceptance Criteria
Every new **API endpoint** must have:
1. **Happy path test** (valid input → correct HTTP status + response shape).
2. **Validation error test** (invalid input → 400 with `VALIDATION_ERROR` code and `fields` map).
3. **Auth guard test** (no session → 401 or redirect to login).
4. **Rate limit test** (exceeding limit → 429 with `RATE_LIMIT_EXCEEDED` code).

Every new **React component** with significant logic must have:
1. **Playwright E2E test** covering primary user interaction.
2. **Empty state test** (what renders when the API returns zero results).

### Before Committing Code
```bash
npm run test:client   # Must pass: 5/5
npm run test:server   # Must pass: 23/23
npm run test:e2e      # Must pass: 5/5
npm run lint          # Must report 0 errors (runs client eslint)
```

---

## 9. Safe Development Practices

### DO NOT
- Modify or delete files without understanding their purpose first.
- Assume a feature works because the file exists. Verify with tests.
- Expose `passwordHash`, session secrets, or raw MongoDB connection strings in logs or responses.
- Run `deleteMany({})`, `drop()`, or destructive migrations without human approval.
- Commit directly to `main`. Always use feature branches.

### ALWAYS
- Read the relevant `SKILL.md` file before starting a specialized task.
- Add an entry to the test suite for every new API route or complex frontend component.
- Follow the existing file-naming conventions (PascalCase for components, camelCase for utilities, kebab-case for SCSS files is acceptable per existing convention).
- Update `AGENTS.md` when adding new API endpoints or changing the project architecture significantly.

---

## 10. Current Known Issues (Technical Debt)

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | `server/tests/auth.test.js` fails: `mongodb-memory-server` and `supertest` missing from `server/package.json` | 🔴 Critical | ✅ Fixed |
| 2 | Split-brain: `SearchBloodPage` calls `/api/v1/donors` (404), while `DonorRegistrationPage` saves to `localStorage` | 🔴 Critical | ✅ Fixed (Stage 2) |
| 3 | ESLint hangs when run from root (traverses `server/node_modules`). Add ignore pattern. | 🟡 High | ✅ Fixed (eslint now runs from `client/`) |
| 4 | 4 ESLint `no-unused-vars` errors in `src/` (unused `omitKey`, `delay` leftovers) | 🟡 High | ✅ Fixed |
| 5 | `AdminPanel.jsx` performs admin operations only in localStorage — no server-side RBAC enforcement | 🟠 Medium | Open — Stage 3 |
| 6 | Password reset flow (`ForgotPasswordPage`, `ResetPasswordPage`) has no backend API endpoints | 🟠 Medium | Open — Stage 3 |
| 7 | React Router v6 future flag warnings in Playwright logs (`v7_startTransition`, `v7_relativeSplatPath`) | 🟢 Low | Open |

---

## 11. Contact & Project Context

- **Stack type:** Pakistan-focused HealthTech SaaS
- **Target customers:** Hospitals, blood banks, voluntary donor organizations
- **Demo accounts:** `admin@lifestream.com` / `Admin@1234` | `john@example.com` / `Test@1234`
- **Active skills:** See `.gemini/skills/` for AI agent skill files
