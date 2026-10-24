import mongoose from 'mongoose';
import {
  BLOOD_GROUPS,
  DONOR_STATUSES,
  PAKISTAN_PHONE_REGEX,
} from '../constants/donor.js';

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => PAKISTAN_PHONE_REGEX.test(value),
        message: 'Enter a valid Pakistani mobile number.',
      },
    },
    canContact: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: DONOR_STATUSES,
      default: 'pending',
      required: true,
    },
    lastDonated: {
      type: Date,
      default: null,
    },
    donationsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    livesSavedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    avatar: {
      type: String,
      default: null,
    },
    km: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  },
);

donorSchema.index({ bloodGroup: 1, city: 1, status: 1 });
donorSchema.index({ createdAt: -1 });

export const Donor = mongoose.model('Donor', donorSchema);
