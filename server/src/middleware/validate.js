export const validate = (schemas) => (request, response, next) => {
  const validated = {};
  const fields = {};

  for (const [location, schema] of Object.entries(schemas)) {
    const result = schema.safeParse(request[location]);
    if (!result.success) {
      for (const issue of result.error.issues) {
        fields[issue.path.join('.') || location] = issue.message;
      }
    } else {
      validated[location] = result.data;
    }
  }

  if (Object.keys(fields).length > 0) {
    return response.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'The submitted data is invalid.',
        fields,
      },
    });
  }

  request.validated = validated;
  next();
};
