import { z } from 'zod';
import { TASKS_STATUSES, TASKS_PRIORITIES } from '@/utils/enums/taskStatus';

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .trim(),
  status: z
    .string()
    .min(1, 'Status is required')
    .refine(
      (value) => Object.values(TASKS_STATUSES).includes(value as any),
      { message: 'Please select a valid status' }
    ),
  priority: z
    .string()
    .min(1, 'Priority is required')
    .refine(
      (value) => Object.values(TASKS_PRIORITIES).includes(value as any),
      { message: 'Please select a valid priority' }
    ),
  dueDate: z.string().optional().or(z.literal('')),
});

export type TaskFormData = z.infer<typeof taskSchema>;

