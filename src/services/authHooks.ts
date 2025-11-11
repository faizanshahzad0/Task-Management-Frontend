'use client';

import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError, AxiosResponse } from 'axios'
import axiosInstance from '@/utils/api/axiosInstance'
import { API_ROUTES } from '@/utils/constants/apiRoutes'
import type { ErrorResponse } from '@/types/errorTypers'
import { mapSignupData, mapSigninData } from './utility/auth'
import { SignupTypes, SigninTypes } from '@/types/authTypes'
import { useRouter } from 'next/navigation'

export const useAuthHooks = () => {

  const router = useRouter()

  const useSignup = () => {
    const mutation = useMutation({
      mutationFn: (data: SignupTypes): Promise<AxiosResponse> => {
        const useSignupData = mapSignupData(data)
        return axiosInstance.post(API_ROUTES.AUTH.signupUrl, useSignupData)
      },
      onSuccess: async (response: AxiosResponse) => {
        const message = response.data?.message;
        if (message) {
          toast.success(message);
          router.push('/')
        }
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.error || error.message || 'Signup failed'
        toast.error(errorMessage)
      }
    })

    return {
      data: mutation.data,
      error: mutation.error,
      isLoading: mutation.isPending,
      isSuccess: mutation.isSuccess,
      mutate: mutation.mutate
    }
  }

  const useSignin = () => {
    const mutation = useMutation({
      mutationFn: (data: SigninTypes): Promise<AxiosResponse> => {
        const useSigninData = mapSigninData(data)
        return axiosInstance.post(API_ROUTES.AUTH.signinUrl, useSigninData)
      },
      onSuccess: async ({ data }: { data: AxiosResponse }) => {
        const token = data?.data?.accessToken
        if (token) {
          localStorage.setItem('token', token)
        }
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.error || error.message || 'Signin failed'
        toast.error(errorMessage)
      }
    })

    return {
      data: mutation.data,
      error: mutation.error,
      isLoading: mutation.isPending,
      isSuccess: mutation.isSuccess,
      mutate: mutation.mutate
    }
  }

  return {
    useSignup,
    useSignin
  }
}
