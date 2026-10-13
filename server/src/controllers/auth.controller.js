import mongoose from 'mongoose';
import { sessionClearCookieOptions } from '../config/session.js';
import {
  authenticateUser,
  findActiveSessionUser,
  registerUser,
} from '../services/auth.service.js';
import {
  destroySession,
  establishUserSession,
} from '../utils/sessionPromises.js';
import { toUserResponse } from '../utils/userResponse.js';

const anonymousSessionResponse = {
  success: true,
  data: {
    authenticated: false,
    user: null,
  },
};

const clearSessionCookie = (response, config) => {
  response.clearCookie(
    config.session.name,
    sessionClearCookieOptions(config),
  );
};

export const createAuthController = (config) => ({
  register: async (request, response) => {
    const user = await registerUser(
      request.validated.body,
      config.bcryptRounds,
    );
    await establishUserSession(request, user._id);

    response.status(201).json({
      success: true,
      data: { user: toUserResponse(user) },
      message: 'Account created successfully.',
    });
  },

  login: async (request, response) => {
    const user = await authenticateUser(
      request.validated.body,
      config.bcryptRounds,
    );
    await establishUserSession(request, user._id);

    response.status(200).json({
      success: true,
      data: { user: toUserResponse(user) },
      message: 'Signed in successfully.',
    });
  },

  logout: async (request, response) => {
    await destroySession(request);
    clearSessionCookie(response, config);
    response.status(204).send();
  },

  session: async (request, response) => {
    const userId = request.session?.userId;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return response.status(200).json(anonymousSessionResponse);
    }

    const user = await findActiveSessionUser(userId);
    if (!user) {
      await destroySession(request);
      clearSessionCookie(response, config);
      return response.status(200).json(anonymousSessionResponse);
    }

    return response.status(200).json({
      success: true,
      data: {
        authenticated: true,
        user: toUserResponse(user),
      },
    });
  },
});
