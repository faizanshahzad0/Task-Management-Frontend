import type { SignupTypes, SigninTypes } from "@/types/authTypes"

export const mapSignupData = (data: SignupTypes) => {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role
    }
  }
  
  export const mapSigninData = (data: SigninTypes) => {
    return {
      email: data.email,
      password: data.password
    }
  }