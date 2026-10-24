import { Router } from 'express';
import { createDonorController } from '../controllers/donor.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createDonorSchema,
  donorQuerySchema,
  updateDonorSchema,
} from '../schemas/donor.schema.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createDonorRouter = (_config) => {
  const router = Router();
  const controller = createDonorController();

  router.get(
    '/',
    optionalAuth,
    validate({ query: donorQuerySchema }),
    asyncHandler(controller.getDonors),
  );

  router.get(
    '/:id',
    optionalAuth,
    asyncHandler(controller.getDonorById),
  );

  router.post(
    '/',
    authenticate,
    validate({ body: createDonorSchema }),
    asyncHandler(controller.registerDonor),
  );

  router.put(
    '/:id',
    authenticate,
    validate({ body: updateDonorSchema }),
    asyncHandler(controller.updateDonor),
  );

  return router;
};
