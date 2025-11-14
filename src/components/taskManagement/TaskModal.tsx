'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TASKS_STATUSES, TASKS_PRIORITIES } from '@/utils/enums/taskStatus';
import { taskSchema, type TaskFormData } from '@/utils/schema/taskSchema';
import type { Task, CreateTaskInput, TaskModalProps } from '@/types/taskTypes';

const TaskModal = ({ isOpen, onClose, onSubmit, task, isLoading }: TaskModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      status: '' as any,
      priority: '' as any,
      dueDate: '',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: '' as any,
        priority: '' as any,
        dueDate: '',
      });
    }
  }, [task, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data as CreateTaskInput);
  };

  const handleBackdropClick = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Title *
              </label>
              <input
                type="text"
                {...register('title')}
                className={`w-full px-4 py-2.5 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all ${
                  errors.title
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-600'
                }`}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className={`w-full px-4 py-2.5 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 resize-none transition-all ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-600'
                }`}
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  Status *
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className={`w-full px-4 py-2.5 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all ${
                    errors.status
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-600'
                  }`}
                >
                  <option value="" className="bg-slate-700">
                    Select Status
                  </option>
                  {Object.values(TASKS_STATUSES).map((status) => (
                    <option key={status} value={status} className="bg-slate-700">
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  Priority *
                </label>
                <select
                  {...register('priority', { required: 'Priority is required' })}
                  className={`w-full px-4 py-2.5 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all ${
                    errors.priority
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-600'
                  }`}
                >
                  <option value="" className="bg-slate-700">
                    Select Priority
                  </option>
                  {Object.values(TASKS_PRIORITIES).map((priority) => (
                    <option key={priority} value={priority} className="bg-slate-700">
                      {priority}
                    </option>
                  ))}
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Due Date
              </label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all [color-scheme:dark]"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2.5 border border-slate-600 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isLoading ? (task ? 'Updating...' : 'Creating...') : (task ? 'Update Task' : 'Create Task')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
