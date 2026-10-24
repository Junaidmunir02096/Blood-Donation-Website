import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

/**
 * Ensures the incoming request has a valid, active session and attaches the User document.
 */
export const authenticate = async (request, _response, next) => {
  try {
    const userId = request.session?.userId;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return next(new AppError(401, 'UNAUTHENTICATED', 'You must be logged in to perform this action.'));
    }

    const user = await User.findOne({ _id: userId, status: 'active' });
    if (!user) {
      return next(new AppError(401, 'UNAUTHENTICATED', 'Session is invalid or account is inactive.'));
    }

    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Populates request.user if a session exists, but allows unauthenticated access if not.
 */
export const optionalAuth = async (request, _response, next) => {
  try {
    const userId = request.session?.userId;
    if (userId && mongoose.isValidObjectId(userId)) {
      const user = await User.findOne({ _id: userId, status: 'active' });
      if (user) {
        request.user = user;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Checks that the authenticated user possesses one of the allowed roles.
 */
export const authorize = (...roles) => (request, _response, next) => {
  if (!request.user) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Authentication required.'));
  }
  if (!roles.includes(request.user.role)) {
    return next(new AppError(403, 'FORBIDDEN', 'You do not have permission to perform this action.'));
  }
  next();
};
