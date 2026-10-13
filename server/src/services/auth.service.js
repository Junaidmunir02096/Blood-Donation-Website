import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

let dummyPasswordHash;

const invalidCredentials = () => new AppError(
  401,
  'INVALID_CREDENTIALS',
  'Email or password is incorrect.',
);

export const registerUser = async (data, bcryptRounds) => {
  const duplicate = await User.exists({ email: data.email });
  if (duplicate) {
    throw new AppError(
      409,
      'EMAIL_ALREADY_EXISTS',
      'An account with this email already exists.',
    );
  }

  const passwordHash = await bcrypt.hash(data.password, bcryptRounds);
  return User.create({
    fullName: data.fullName,
    email: data.email,
    passwordHash,
    phone: data.phone,
    city: data.city,
    bloodGroup: data.bloodGroup,
    role: 'donor',
    status: 'active',
  });
};

export const authenticateUser = async ({ email, password }, bcryptRounds) => {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!dummyPasswordHash) {
    dummyPasswordHash = await bcrypt.hash('invalid-password-placeholder', bcryptRounds);
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user?.passwordHash || dummyPasswordHash,
  );

  if (!user || !passwordMatches) throw invalidCredentials();

  if (user.status !== 'active') {
    throw new AppError(
      403,
      'ACCOUNT_INACTIVE',
      'This account is inactive. Please contact support.',
    );
  }

  user.lastLoginAt = new Date();
  await user.save({ validateModifiedOnly: true });
  return user;
};

export const findActiveSessionUser = async (userId) => {
  if (!userId) return null;
  return User.findOne({ _id: userId, status: 'active' });
};
