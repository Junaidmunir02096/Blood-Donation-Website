import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {
  BLOOD_GROUPS,
  PAKISTAN_PHONE_REGEX,
  USER_ROLES,
  USER_STATUSES,
} from '../constants/user.js';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: (value) => value == null || PAKISTAN_PHONE_REGEX.test(value),
        message: 'Enter a valid Pakistani mobile number.',
      },
    },
    city: {
      type: String,
      trim: true,
      maxlength: 80,
      default: null,
    },
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      default: null,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'donor',
      required: true,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: 'active',
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });

userSchema.methods.verifyPassword = function verifyPassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
