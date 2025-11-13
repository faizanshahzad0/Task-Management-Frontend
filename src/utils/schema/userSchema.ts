import { z } from 'zod';
import { USER_ROLES } from '@/utils/enums/userRoles';

export const userSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .refine((value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(value), {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }),
  role: z
    .string()
    .min(1, 'Role is required')
    .refine(
      (value) => Object.values(USER_ROLES).includes(value as any),
      { message: 'Please select a valid role' }
    ),
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .refine((value) => !value || value.trim() === '' || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(value), {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    })
    .optional()
    .or(z.literal('')),
  role: z
    .string()
    .min(1, 'Role is required')
    .refine(
      (value) => Object.values(USER_ROLES).includes(value as any),
      { message: 'Please select a valid role' }
    ),
});

export type UserFormData = z.infer<typeof userSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

