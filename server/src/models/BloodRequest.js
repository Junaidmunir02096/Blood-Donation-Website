import mongoose from 'mongoose';
import { REQUEST_COMPONENTS, REQUEST_STATUSES, REQUEST_URGENCIES } from '../constants/request.js';
import { BLOOD_GROUPS, PAKISTAN_PHONE_REGEX } from '../constants/user.js';

const bloodRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    patient: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    hospital: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: true,
    },
    units: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      default: 1,
    },
    component: {
      type: String,
      enum: REQUEST_COMPONENTS,
      default: 'Whole Blood',
      required: true,
    },
    urgency: {
      type: String,
      enum: REQUEST_URGENCIES,
      required: true,
      default: 'Urgent',
    },
    neededBy: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => PAKISTAN_PHONE_REGEX.test(value),
        message: 'Enter a valid Pakistani mobile number.',
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    status: {
      type: String,
      enum: REQUEST_STATUSES,
      default: 'Pending',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  },
);

bloodRequestSchema.index({ status: 1, urgency: 1, createdAt: -1 });
bloodRequestSchema.index({ location: 1, bloodGroup: 1 });

export const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
