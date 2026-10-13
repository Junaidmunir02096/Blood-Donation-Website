import { z } from 'zod';
import { BLOOD_GROUPS, PAKISTAN_PHONE_REGEX } from '../constants/user.js';

const optionalText = (maximum) => z.preprocess(
  (value) => value === '' || value == null ? undefined : value,
  z.string().trim().min(1).max(maximum).optional(),
);

const passwordSchema = z.string()
  .min(8, 'Password must contain at least 8 characters.')
  .refine(
    (password) => Buffer.byteLength(password, 'utf8') <= 72,
    'Password must not exceed 72 UTF-8 bytes.',
  );

export const registerBodySchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  password: passwordSchema,
  confirmPassword: z.string().optional(),
  bloodGroup: z.enum(BLOOD_GROUPS).optional().or(z.literal('')).transform((value) => value || undefined),
  phone: z.preprocess(
    (value) => value === '' || value == null ? undefined : value,
    z.string().trim().regex(PAKISTAN_PHONE_REGEX, 'Enter a valid Pakistani mobile number.').optional(),
  ),
  city: optionalText(80),
}).strict().superRefine((data, context) => {
  if (data.confirmPassword !== undefined && data.confirmPassword !== data.password) {
    context.addIssue({
      code: 'custom',
      path: ['confirmPassword'],
      message: 'Passwords do not match.',
    });
  }
}).transform(({ confirmPassword: _confirmPassword, ...data }) => data);

export const loginBodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(72),
}).strict();
