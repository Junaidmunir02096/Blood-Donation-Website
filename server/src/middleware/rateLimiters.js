import { rateLimit } from 'express-rate-limit';

const rateLimitResponse = {
  success: false,
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many attempts. Please try again later.',
  },
};

const createAuthLimiter = (limit, skip) => rateLimit({
  windowMs: 15 * 60 * 1000,
  limit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: rateLimitResponse,
  skip,
});

export const createAuthLimiters = ({ disabled = false } = {}) => ({
  register: createAuthLimiter(5, () => disabled),
  login: createAuthLimiter(10, () => disabled),
});
