export const errorHandler = (error, request, response, _next) => {
  if (response.headersSent) return;

  if (error?.code === 11000) {
    return response.status(409).json({
      success: false,
      error: {
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'An account with this email already exists.',
      },
    });
  }

  const status = error.status || 500;
  const operational = error.isOperational === true;

  if (!operational) {
    request.log?.error({ err: error }, 'Unhandled request error');
  }

  return response.status(status).json({
    success: false,
    error: {
      code: operational ? error.code : 'INTERNAL_SERVER_ERROR',
      message: operational ? error.message : 'An unexpected server error occurred.',
      ...(operational && error.fields ? { fields: error.fields } : {}),
      ...(!operational && request.app.get('env') !== 'production'
        ? { developmentMessage: error.message }
        : {}),
    },
  });
};
