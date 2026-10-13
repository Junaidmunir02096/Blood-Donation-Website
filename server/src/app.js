import { randomUUID } from 'node:crypto';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { createSessionMiddleware } from './config/session.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { createApiRouter } from './routes/index.js';
import { AppError } from './utils/AppError.js';

export const createApp = (config, sessionStore) => {
  const app = express();
  app.set('env', config.nodeEnv);
  app.disable('x-powered-by');

  if (config.isProduction) app.set('trust proxy', 1);

  const logger = pino({ level: config.logLevel });
  app.use(pinoHttp({
    logger,
    genReqId: (request, response) => {
      const requestId = request.headers['x-request-id'] || randomUUID();
      response.setHeader('X-Request-Id', requestId);
      return requestId;
    },
    redact: [
      'req.headers.cookie',
      'req.headers.authorization',
      'req.body.password',
      'req.body.confirmPassword',
    ],
    autoLogging: !config.isTest,
  }));

  app.use(helmet());
  app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || origin.replace(/\/$/, '') === config.clientOrigin) {
        callback(null, true);
        return;
      }
      callback(new AppError(403, 'ORIGIN_NOT_ALLOWED', 'This origin is not allowed.'));
    },
  }));
  app.use(express.json({ limit: '100kb' }));
  app.use(createSessionMiddleware(config, sessionStore));

  app.use('/api/v1', createApiRouter(config));
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
