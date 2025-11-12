'use client';

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError, AxiosResponse } from 'axios'
import axiosInstance from '@/utils/api/axiosInstance'
import { API_ROUTES } from '@/utils/constants/apiRoutes'
import type { ErrorResponse } from '@/types/errorTypes'
import { mapSignupData, mapSigninData } from './utility/auth'
import { SignupTypes, SigninTypes } from '@/types/authTypes'
import { useRouter } from 'next/navigation'
import { getUserIdFromToken } from '@/utils/utility/jwt'

export const useAuthHooks = () => {

  const router = useRouter()
  const queryClient = useQueryClient()

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
      onSuccess: async (response: AxiosResponse) => {
        try {
          const responseData = response.data;
          const token = 
            responseData?.accessToken || 
            responseData?.token ||
            responseData?.data?.accessToken ||
            responseData?.data?.token;
          const refreshToken = 
            responseData?.refreshToken || 
            responseData?.data?.refreshToken;
          const message = responseData?.message || responseData?.data?.message;
          
          if (token) {
            localStorage.setItem('token', token);
            if (refreshToken) {
              localStorage.setItem('refreshToken', refreshToken);
            }
            queryClient.invalidateQueries({ queryKey: ['loggedInUser'] });
            toast.success(message || 'Sign in successful');
            router.push('/tasks');
          } else {
            toast.error('No access token received');
          }
        } catch (error) {
          console.error('Error processing signin response:', error);
          toast.error('Error processing signin response');
        }
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Signin failed';
        toast.error(errorMessage);
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

  const useGetLoggedInUser = () => {
    const getInitialState = () => {
      if (typeof window === 'undefined') {
        return { userId: null, hasToken: false };
      }
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      return {
        userId: token ? getUserIdFromToken() : null,
        hasToken: !!token
      };
    };

    const [userId, setUserId] = useState<string | null>(() => getInitialState().userId);
    const [hasToken, setHasToken] = useState(() => getInitialState().hasToken);

    const query = useQuery({
      queryKey: ['loggedInUser', userId],
      queryFn: async (): Promise<any> => {
        if (!userId) {
          throw new Error('User ID not found in token');
        }
        const response = await axiosInstance.get(`${API_ROUTES.USERS.loggedInUser}/${userId}`);
        return response.data;
      },
      enabled: hasToken && !!userId,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

    useEffect(() => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const tokenExists = !!token;
      const decodedUserId = tokenExists ? getUserIdFromToken() : null;
      
      if (tokenExists !== hasToken || decodedUserId !== userId) {
        setHasToken(tokenExists);
        setUserId(decodedUserId);
      }
    }, []);
    
    return query;
  };

  return {
    useSignup,
    useSignin,
    useGetLoggedInUser
  }
}
