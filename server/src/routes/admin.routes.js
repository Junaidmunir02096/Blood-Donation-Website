import { Router } from 'express';
import { createAdminController } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  adminQuerySchema,
  updateDonorAdminSchema,
  updateRequestAdminSchema,
  updateUserAdminSchema,
} from '../schemas/admin.schema.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createAdminRouter = (_config) => {
  const router = Router();
  const controller = createAdminController();

  // Guard entire admin router
  router.use(authenticate, authorize('admin'));

  router.get('/stats', asyncHandler(controller.getStats));

  // Users management
  router.get(
    '/users',
    validate({ query: adminQuerySchema }),
    asyncHandler(controller.getUsers),
  );
  router.put(
    '/users/:id',
    validate({ body: updateUserAdminSchema }),
    asyncHandler(controller.updateUser),
  );
  router.delete(
    '/users/:id',
    asyncHandler(controller.deleteUser),
  );

  // Donors management
  router.get(
    '/donors',
    validate({ query: adminQuerySchema }),
    asyncHandler(controller.getDonors),
  );
  router.put(
    '/donors/:id',
    validate({ body: updateDonorAdminSchema }),
    asyncHandler(controller.updateDonor),
  );
  router.delete(
    '/donors/:id',
    asyncHandler(controller.deleteDonor),
  );

  // Requests management
  router.get(
    '/requests',
    validate({ query: adminQuerySchema }),
    asyncHandler(controller.getRequests),
  );
  router.put(
    '/requests/:id',
    validate({ body: updateRequestAdminSchema }),
    asyncHandler(controller.updateRequest),
  );
  router.delete(
    '/requests/:id',
    asyncHandler(controller.deleteRequest),
  );

  return router;
};
