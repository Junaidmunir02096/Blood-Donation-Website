import session from 'express-session';
import MongoStore from 'connect-mongo';

export const sessionCookieOptions = (config) => ({
  httpOnly: true,
  secure: config.session.secure,
  sameSite: config.session.sameSite,
  path: '/',
  maxAge: config.session.ttlDays * 24 * 60 * 60 * 1000,
});

export const sessionClearCookieOptions = (config) => ({
  httpOnly: true,
  secure: config.session.secure,
  sameSite: config.session.sameSite,
  path: '/',
});

export const createSessionStore = (config) => MongoStore.create({
  mongoUrl: config.mongoUri,
  collectionName: 'sessions',
  ttl: config.session.ttlDays * 24 * 60 * 60,
  touchAfter: 24 * 60 * 60,
});

export const createSessionMiddleware = (config, store) => session({
  name: config.session.name,
  secret: config.session.secret,
  store,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: sessionCookieOptions(config),
});
