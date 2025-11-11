import { z } from "zod";
import { USER_ROLES } from "../enums/userRoles";

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
const USER_ROLE_VALUES: ReadonlyArray<UserRole> = Object.values(USER_ROLES) as ReadonlyArray<UserRole>;

const roleSchema = z
    .string()
    .min(1, "Role is required")
    .refine((value) => USER_ROLE_VALUES.includes(value as UserRole), {
        message: "Invalid role selected",
    })
    .transform((value) => value as UserRole);

export const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    role: roleSchema,
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long")
        .refine((value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(value), {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }),
});
