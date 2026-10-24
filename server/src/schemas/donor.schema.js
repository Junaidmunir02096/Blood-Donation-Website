import { z } from 'zod';
import { BLOOD_GROUPS, DONOR_STATUSES, PAKISTAN_PHONE_REGEX } from '../constants/donor.js';

export const createDonorSchema = z.object({
  name: z.string().trim().min(2, 'Name must contain at least 2 characters.').max(80),
  bloodGroup: z.enum(BLOOD_GROUPS, { message: 'Invalid blood group.' }),
  city: z.string().trim().min(2, 'City is required.').max(80),
  phone: z.string().trim().regex(PAKISTAN_PHONE_REGEX, 'Enter a valid Pakistani mobile number.'),
  canContact: z.boolean().default(true),
  lastDonationDate: z.string().trim().optional().or(z.literal('')),
}).strict();

export const updateDonorSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  bloodGroup: z.enum(BLOOD_GROUPS).optional(),
  city: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().regex(PAKISTAN_PHONE_REGEX, 'Enter a valid Pakistani mobile number.').optional(),
  canContact: z.boolean().optional(),
  status: z.enum(DONOR_STATUSES).optional(),
  lastDonationDate: z.string().trim().optional().or(z.literal('')),
}).strict();

export const donorQuerySchema = z.object({
  bloodGroup: z.string().trim().optional(),
  city: z.string().trim().optional(),
  q: z.string().trim().optional(),
  status: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
