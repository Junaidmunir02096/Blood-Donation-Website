---
name: saas-architecture
description: >
  Multi-tenancy, Role-Based Access Control (RBAC), subscription billing,
  and SaaS API design patterns for LifeStream. Use this skill when building
  new backend resources, tenant isolation logic, RBAC middleware, or payment
  integration features.
---

# SaaS Architecture Skill — LifeStream

## When to Activate This Skill

Activate this skill when:
- Adding a new **Mongoose model** to the backend.
- Building a new **Express router or controller** for a domain resource.
- Implementing **authentication guards or role checks** on endpoints.
- Designing the **multi-tenant Hospital/Organization** model.
- Integrating **subscription billing** (Stripe, LemonSqueezy, or PayFast).
- Designing any feature that involves **data isolation between tenants**.

---

## 1. Multi-Tenancy Model (Target Architecture)

LifeStream uses a **shared-database, shared-schema** multi-tenancy approach where every tenant-owned record carries an `organizationId` foreign key.

```
Global Entities (no tenant):      User, Donor
Tenant-Owned Entities:            BloodRequest, Inventory, Staff, Notification
Platform Admin Entities:          Organization (Tenant), Subscription, AuditLog
```

### Organization (Tenant) Schema Pattern
```js
// server/src/models/Organization.js
import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true, maxlength: 120 },
    type:         { type: String, enum: ['hospital', 'blood_bank', 'ngo'], required: true },
    city:         { type: String, required: true },
    address:      { type: String, default: null },
    phone:        { type: String, default: null },
    licenseNumber:{ type: String, default: null },
    status:       { type: String, enum: ['active', 'suspended', 'pending'], default: 'pending' },
    planTier:     { type: String, enum: ['free', 'clinic', 'hospital', 'enterprise'], default: 'free' },
    adminUserId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

organizationSchema.index({ city: 1, status: 1 });
export const Organization = mongoose.model('Organization', organizationSchema);
```

### Adding Tenant Context to Owned Resources
```js
// Every tenant-owned resource must include:
organizationId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Organization',
  required: true,
  index: true,
},
```

---

## 2. Role-Based Access Control (RBAC)

### User Roles Hierarchy
```
admin              > hospital_admin > hospital_staff > donor
(platform super)     (tenant owner)   (tenant member)  (public)
```

### Middleware Pattern — Authenticate + Authorize
```js
// server/src/middleware/auth.middleware.js

import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

// Step 1: Verify a valid session exists and attach user to request
export const authenticate = async (request, _response, next) => {
  const userId = request.session?.userId;
  if (!userId || !mongoose.isValidObjectId(userId)) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'You must be logged in.'));
  }
  const user = await User.findOne({ _id: userId, status: 'active' });
  if (!user) return next(new AppError(401, 'UNAUTHENTICATED', 'Session is invalid.'));
  request.user = user;
  next();
};

// Step 2: Check the user has one of the required roles
export const authorize = (...roles) => (request, _response, next) => {
  if (!roles.includes(request.user?.role)) {
    return next(new AppError(403, 'FORBIDDEN', 'You do not have permission for this action.'));
  }
  next();
};
```

### Applying Middleware to Routes
```js
// Usage in a router file — protect admin endpoints:
import { authenticate, authorize } from '../middleware/auth.middleware.js';

router.get('/admin/users',
  authenticate,
  authorize('admin'),
  asyncHandler(adminController.listUsers),
);

// Protect donor registration (must be logged in):
router.post('/donors',
  authenticate,
  validate({ body: donorBodySchema }),
  asyncHandler(donorController.register),
);
```

---

## 3. Standard Controller Pattern

All controllers in this project follow a **factory function pattern** that receives `config` and returns a controller object.

```js
// server/src/controllers/donor.controller.js
import { registerDonor, getDonors } from '../services/donor.service.js';
import { toUserResponse } from '../utils/userResponse.js';

export const createDonorController = (_config) => ({
  // GET /api/v1/donors
  list: async (request, response) => {
    const { bloodGroup, city, page = 1, limit = 20 } = request.query;
    const donors = await getDonors({ bloodGroup, city, page: +page, limit: +limit });
    response.status(200).json({ success: true, data: donors });
  },

  // POST /api/v1/donors
  register: async (request, response) => {
    const donor = await registerDonor(request.user._id, request.validated.body);
    response.status(201).json({
      success: true,
      data: { donor },
      message: 'Donor registration submitted. Pending verification.',
    });
  },
});
```

---

## 4. Standard Service Pattern

Services contain **all business logic and database queries**. Controllers must not call Mongoose directly.

```js
// server/src/services/donor.service.js
import { Donor } from '../models/Donor.js';
import { AppError } from '../utils/AppError.js';

export const getDonors = async ({ bloodGroup, city, page, limit }) => {
  const filter = { status: 'verified' };
  if (bloodGroup) filter.bloodGroup = bloodGroup;
  if (city) filter.city = new RegExp(city, 'i');

  const skip = (page - 1) * limit;
  const [donors, total] = await Promise.all([
    Donor.find(filter).select('-__v').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Donor.countDocuments(filter),
  ]);
  return { donors, total, page, totalPages: Math.ceil(total / limit) };
};

export const registerDonor = async (userId, data) => {
  const existing = await Donor.findOne({ userId });
  if (existing) throw new AppError(409, 'DONOR_EXISTS', 'You are already registered as a donor.');
  return Donor.create({ userId, ...data, status: 'pending' });
};
```

---

## 5. Zod Validation Schema Pattern

Every new endpoint must have a Zod schema in `server/src/schemas/`.

```js
// server/src/schemas/donor.schema.js
import { z } from 'zod';
import { BLOOD_GROUPS, PAKISTAN_PHONE_REGEX } from '../constants/user.js';

export const donorBodySchema = z.object({
  phone: z.string().trim().regex(PAKISTAN_PHONE_REGEX, 'Enter a valid Pakistani mobile number.'),
  city:  z.string().trim().min(2).max(80),
  bloodGroup: z.enum(BLOOD_GROUPS),
  lastDonationDate: z.string().date().optional().or(z.literal('')).transform(v => v || undefined),
}).strict();
```

---

## 6. Subscription & Billing Integration (Future — Stripe Pattern)

When integrating billing:

1. **Create a `Subscription` model** with `organizationId`, `planTier`, `stripeCustomerId`, `stripeSubscriptionId`, `status`, `currentPeriodEnd`.
2. **Add a `/billing` router** with endpoints: `POST /billing/create-checkout-session`, `POST /billing/portal-session`, `POST /billing/webhook`.
3. **Webhook handler** must verify the Stripe signature before processing events (`stripe.webhooks.constructEvent`).
4. **Never store card data** — Stripe handles PCI compliance. Store only the `stripeCustomerId`.
5. **Protect premium features** with a `requirePlan('hospital')` middleware that checks `organization.planTier`.

---

## 7. API Response Shape Convention

All API responses must follow this shape for consistency with the frontend `apiClient`:

```js
// Success
{ success: true, data: <payload>, message: '<optional human message>' }

// Error
{ success: false, error: { code: 'ERROR_CODE', message: '<human message>', fields: {} } }
```

---

## 8. Data Migration Strategy (localStorage → Backend)

When migrating a frontend feature from `localStorage` (AppDataContext) to the real backend API:

1. **Build the backend endpoint first** and write integration tests.
2. **Update the service file** (`src/services/<domain>.service.js`) to call the real API endpoint instead of `localStorage`.
3. **Remove the corresponding `AppDataContext` method** once the service is connected and tested.
4. **Update Playwright E2E tests** to mock the new endpoint response.
5. **Verify** that the frontend renders correctly with both empty state and populated state.

Do NOT delete `AppDataContext` wholesale — retire it one domain at a time.
