import { USER_ROLES } from "@/utils/enums/userRoles";

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface SignupTypes {
  firstName: string
  lastName: string;
  email: string
  password: string
  role: UserRole
}

export interface SigninTypes {
  email: string
  password: string
}