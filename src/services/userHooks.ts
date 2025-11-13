'use client';

import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';
import axiosInstance from '@/utils/api/axiosInstance';
import { API_ROUTES } from '@/utils/constants/apiRoutes';
import type { ErrorResponse } from '@/types/errorTypes';
import type { CreateUserInput, UpdateUserInput, UsersResponse } from '@/types/userTypes';

export const useUserHooks = () => {
  const queryClient = useQueryClient();

  const useGetUsers = (options?: {
    page?: number;
    pageSize?: number;
    search?: string;
    filters?: { role?: string };
  }) => {
    const { page = 1, pageSize = 10, search, filters } = options || {};
    return useQuery({
      queryKey: ['users', page, pageSize, search, filters],
      queryFn: async (): Promise<UsersResponse> => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        });
        if (search) {
          params.append('search', search);
        }
        if (filters?.role) {
          params.append('role', filters.role);
        }
        const response = await axiosInstance.get(`${API_ROUTES.USERS.getAllUsers}?${params.toString()}`);
        const responseData = response.data;
        return responseData;
      },
    });
  };

  const useCreateUser = () => {
    return useMutation({
      mutationFn: (data: CreateUserInput): Promise<AxiosResponse> => {
        return axiosInstance.post(API_ROUTES.USERS.createUser, data);
      },
      onSuccess: (response: AxiosResponse) => {
        const message = response.data?.message;
        if (message) {
          toast.success(message);
        }
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to create user';
        toast.error(errorMessage);
      },
    });
  };

  const useUpdateUser = () => {
    return useMutation({
      mutationFn: (data: UpdateUserInput): Promise<AxiosResponse> => {
        const { _id, ...updateData } = data;
        return axiosInstance.patch(`${API_ROUTES.USERS.updateUser.replace(':id', _id)}`, updateData);
      },
      onSuccess: (response: AxiosResponse) => {
        const message = response.data?.message;
        if (message) {
          toast.success(message);
        }
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to update user';
        toast.error(errorMessage);
      },
    });
  };

  const useDeleteUser = () => {
    return useMutation({
      mutationFn: (userId: string): Promise<AxiosResponse> => {
        return axiosInstance.delete(API_ROUTES.USERS.deleteUser.replace(':id', userId));
      },
      onSuccess: (response: AxiosResponse) => {
        const message = response.data?.message;
        if (message) {
          toast.success(message);
        }
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to delete user';
        toast.error(errorMessage);
      },
    });
  };

  return {
    useGetUsers,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
  };
};

