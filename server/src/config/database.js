import mongoose from 'mongoose';

export const connectDatabase = async (mongoUri) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10_000,
  });
  return mongoose.connection;
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export const databaseStatus = () => {
  const labels = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return labels[mongoose.connection.readyState] ?? 'unknown';
};
