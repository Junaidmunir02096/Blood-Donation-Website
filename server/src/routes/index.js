import { Router } from 'express';
import { databaseStatus } from '../config/database.js';
import { createAuthRouter } from './auth.routes.js';
import { createDonorRouter } from './donor.routes.js';
import { createRequestRouter } from './request.routes.js';
import { createAdminRouter } from './admin.routes.js';

export const createApiRouter = (config) => {
  const router = Router();

  router.get('/health', (_request, response) => {
    const database = databaseStatus();
    const healthy = database === 'connected';
    response.status(healthy ? 200 : 503).json({
      success: healthy,
      data: {
        status: healthy ? 'healthy' : 'unhealthy',
        database,
        timestamp: new Date().toISOString(),
      },
    });
  });

  router.use('/auth', createAuthRouter(config));
  router.use('/donors', createDonorRouter(config));
  router.use('/requests', createRequestRouter(config));
  router.use('/admin', createAdminRouter(config));
  return router;
};
