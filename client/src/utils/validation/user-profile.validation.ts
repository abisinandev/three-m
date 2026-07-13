import { z } from 'zod';

export const userProfileSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .min(2, 'Name too short'),
    phone: z
        .string()
        .trim()
        .refine(val => !val || /^\d{10}$/.test(val), 'Invalid phone number')
        .optional(),
    email: z
        .string()
        .trim()
        .email('Invalid email')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email')
});
