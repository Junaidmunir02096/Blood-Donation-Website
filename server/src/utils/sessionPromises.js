export const regenerateSession = (request) => new Promise((resolve, reject) => {
  request.session.regenerate((error) => error ? reject(error) : resolve());
});

export const saveSession = (request) => new Promise((resolve, reject) => {
  request.session.save((error) => error ? reject(error) : resolve());
});

export const destroySession = (request) => new Promise((resolve, reject) => {
  request.session.destroy((error) => error ? reject(error) : resolve());
});

export const establishUserSession = async (request, userId) => {
  await regenerateSession(request);
  request.session.userId = String(userId);
  await saveSession(request);
};
