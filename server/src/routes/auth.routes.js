import { Router } from 'express';
import { createAuthController } from '../controllers/auth.controller.js';
import { createAuthLimiters } from '../middleware/rateLimiters.js';
import { validate } from '../middleware/validate.js';
import { loginBodySchema, registerBodySchema } from '../schemas/auth.schema.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createAuthRouter = (config) => {
  const router = Router();
  const controller = createAuthController(config);
  const limiters = createAuthLimiters({ disabled: config.isTest });

  router.post(
    '/register',
    limiters.register,
    validate({ body: registerBodySchema }),
    asyncHandler(controller.register),
  );
  router.post(
    '/login',
    limiters.login,
    validate({ body: loginBodySchema }),
    asyncHandler(controller.login),
  );
  router.post('/logout', asyncHandler(controller.logout));
  router.get('/session', asyncHandler(controller.session));

  return router;
};
