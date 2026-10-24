import { Router } from 'express';
import { createRequestController } from '../controllers/request.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createRequestSchema,
  requestQuerySchema,
  updateRequestSchema,
} from '../schemas/request.schema.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createRequestRouter = (_config) => {
  const router = Router();
  const controller = createRequestController();

  router.get(
    '/',
    optionalAuth,
    validate({ query: requestQuerySchema }),
    asyncHandler(controller.getRequests),
  );

  router.get(
    '/:id',
    optionalAuth,
    asyncHandler(controller.getRequestById),
  );

  router.post(
    '/',
    optionalAuth,
    validate({ body: createRequestSchema }),
    asyncHandler(controller.createRequest),
  );

  router.put(
    '/:id',
    authenticate,
    validate({ body: updateRequestSchema }),
    asyncHandler(controller.updateRequest),
  );

  router.delete(
    '/:id',
    authenticate,
    asyncHandler(controller.cancelRequest),
  );

  return router;
};
