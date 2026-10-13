export const notFound = (request, response) => {
  response.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `No API route exists for ${request.method} ${request.originalUrl}.`,
    },
  });
};
