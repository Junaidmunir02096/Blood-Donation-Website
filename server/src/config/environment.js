import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required.'),
  CLIENT_ORIGIN: z.string().url('CLIENT_ORIGIN must be a valid URL.'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must contain at least 32 characters.'),
  SESSION_NAME: z.string().min(1).default('lifestream.sid'),
  SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(30).default(7),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export const loadEnvironment = (source = process.env) => {
  const result = environmentSchema.safeParse(source);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid server environment:\n${details}`);
  }

  const values = result.data;
  const isProduction = values.NODE_ENV === 'production';

  return {
    nodeEnv: values.NODE_ENV,
    isProduction,
    isTest: values.NODE_ENV === 'test',
    port: values.PORT,
    mongoUri: values.MONGODB_URI,
    clientOrigin: values.CLIENT_ORIGIN.replace(/\/$/, ''),
    session: {
      name: values.SESSION_NAME,
      secret: values.SESSION_SECRET,
      ttlDays: values.SESSION_TTL_DAYS,
      secure: isProduction,
      sameSite: 'lax',
    },
    bcryptRounds: values.BCRYPT_ROUNDS,
    logLevel: values.LOG_LEVEL,
  };
};
