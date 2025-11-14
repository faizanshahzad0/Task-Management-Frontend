import { z } from 'zod'

export const signinSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters long')
})

export type signinSchema = z.infer<typeof signinSchema>
