import { z } from 'zod';
import { REQUEST_COMPONENTS, REQUEST_STATUSES, REQUEST_URGENCIES } from '../constants/request.js';
import { BLOOD_GROUPS, PAKISTAN_PHONE_REGEX } from '../constants/user.js';

export const createRequestSchema = z.object({
  patient: z.string().trim().min(2, 'Patient name is required.').max(80),
  hospital: z.string().trim().min(2, 'Hospital name is required.').max(120),
  bloodGroup: z.enum(BLOOD_GROUPS, { message: 'Invalid blood group.' }),
  units: z.coerce.number().int().min(1, 'Units must be at least 1.').max(10, 'Units cannot exceed 10.').default(1),
  component: z.enum(REQUEST_COMPONENTS).default('Whole Blood'),
  urgency: z.enum(REQUEST_URGENCIES).default('Urgent'),
  neededBy: z.string().trim().min(1, 'Needed-by date is required.'),
  location: z.string().trim().min(2, 'City is required.').max(80),
  contactNumber: z.string().trim().regex(PAKISTAN_PHONE_REGEX, 'Enter a valid Pakistani mobile number.'),
  email: z.string().trim().email('Enter a valid email address.').optional().or(z.literal('')),
  note: z.string().trim().max(500).optional().default(''),
}).strict();

export const updateRequestSchema = z.object({
  status: z.enum(REQUEST_STATUSES).optional(),
  units: z.coerce.number().int().min(1).max(10).optional(),
  urgency: z.enum(REQUEST_URGENCIES).optional(),
  neededBy: z.string().trim().optional(),
  note: z.string().trim().max(500).optional(),
}).strict();

export const requestQuerySchema = z.object({
  userId: z.string().trim().optional(),
  bloodGroup: z.string().trim().optional(),
  location: z.string().trim().optional(),
  status: z.string().trim().optional(),
  urgency: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
