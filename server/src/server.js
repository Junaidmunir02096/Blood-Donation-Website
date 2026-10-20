import 'dotenv/config';
import { createServer } from 'node:http';
import pino from 'pino';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { loadEnvironment } from './config/environment.js';
import { createSessionStore } from './config/session.js';

const startServer = async () => {
  const config = loadEnvironment();
  const logger = pino({ level: config.logLevel });

  logger.info('Starting LifeStream API...');

  await connectDatabase(config.mongoUri);
  logger.info('MongoDB connected');

  const sessionStore = createSessionStore(config);
  const app = createApp(config, sessionStore);
  const server = createServer(app);

  server.on('error', (err) => {
    logger.fatal({ err }, 'Server error');
  });

  server.listen(config.port, '::', () => {
    logger.info({ port: config.port }, 'LifeStream API started');
  });

  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, 'Shutting down LifeStream API');

    const forceExit = setTimeout(() => {
      logger.error('Graceful shutdown timed out');
      process.exit(1);
    }, 10_000);
    forceExit.unref();

    server.close(async () => {
      try {
        await sessionStore.close();
        await disconnectDatabase();
        clearTimeout(forceExit);
        process.exit(0);
      } catch (error) {
        logger.error({ err: error }, 'Shutdown failed');
        process.exit(1);
      }
    });
  };

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.fatal({ err: reason, promise }, 'Unhandled promise rejection');
  });

  process.on('uncaughtException', (error) => {
    logger.fatal({ err: error }, 'Uncaught exception');
    process.exit(1);
  });

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch((error) => {
  const logger = pino();
  logger.fatal({ err: error }, 'LifeStream API failed to start');
  process.exit(1);
});
