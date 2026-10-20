import { Router } from 'express';
import { databaseStatus } from '../config/database.js';
import { createAuthRouter } from './auth.routes.js';

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
  return router;
};
