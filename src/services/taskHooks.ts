'use client';

import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';
import axiosInstance from '@/utils/api/axiosInstance';
import { API_ROUTES } from '@/utils/constants/apiRoutes';
import type { ErrorResponse } from '@/types/errorTypes';
import type { CreateTaskInput, UpdateTaskInput, TasksResponse } from '@/types/taskTypes';

export const useTaskHooks = () => {
  const queryClient = useQueryClient();

  const useGetTasks = (options?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
  }) => {
    const { page = 1, limit = 10, search, sortBy, sortOrder, status, priority, dueDate } = options || {};
    return useQuery({
      queryKey: ['tasks', page, limit, search, sortBy, sortOrder, status, priority, dueDate],
      queryFn: async (): Promise<TasksResponse> => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) {
          params.append('search', search);
        }
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        if (sortOrder) {
          params.append('sortOrder', sortOrder);
        }
        if (status) {
          params.append('status', status);
        }
        if (priority) {
          params.append('priority', priority);
        }
        if (dueDate) {
          params.append('dueDate', dueDate);
        }
        const response = await axiosInstance.get(`${API_ROUTES.Tasks.getTasks}?${params.toString()}`);
        return response.data;
      },
    });
  };

  const useCreateTask = () => {
    return useMutation({
      mutationFn: (data: CreateTaskInput): Promise<AxiosResponse> => {
        return axiosInstance.post(API_ROUTES.Tasks.createTask, data);
      },
      onSuccess: (response: AxiosResponse) => {
        const message = response.data?.message;
        if (message) {
          toast.success(message);
        }
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to create task';
        toast.error(errorMessage);
      },
    });
  };

  const useUpdateTask = () => {
    return useMutation({
      mutationFn: (data: UpdateTaskInput): Promise<AxiosResponse> => {
        return axiosInstance.patch(`${API_ROUTES.Tasks.updateTask}/${data._id}`, data);
      },
      onSuccess: (response: AxiosResponse) => {
        const message = response.data?.message;
        if (message) {
          toast.success(message);
        }
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to update task';
        toast.error(errorMessage);
      },
    });
  };

  const useDeleteTask = () => {
    return useMutation({
      mutationFn: (taskId: string): Promise<AxiosResponse> => {
        return axiosInstance.delete(`${API_ROUTES.Tasks.deleteTask}/${taskId}`);
      },
      onSuccess: (response: AxiosResponse) => {
        const message = response.data?.message;
        if (message) {
          toast.success(message);
        }
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to delete task';
        toast.error(errorMessage);
      },
    });
  };

  return {
    useGetTasks,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
  };
};

