import { z } from 'zod';
import { USER_ROLES, USER_STATUSES } from '../constants/user.js';
import { DONOR_STATUSES } from '../constants/donor.js';
import { REQUEST_STATUSES } from '../constants/request.js';

export const updateUserAdminSchema = z.object({
  role: z.enum(USER_ROLES).optional(),
  status: z.enum(USER_STATUSES).optional(),
}).strict();

export const updateDonorAdminSchema = z.object({
  status: z.enum(DONOR_STATUSES).optional(),
  canContact: z.boolean().optional(),
}).strict();

export const updateRequestAdminSchema = z.object({
  status: z.enum(REQUEST_STATUSES).optional(),
}).strict();

export const adminQuerySchema = z.object({
  q: z.string().trim().optional(),
  status: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
