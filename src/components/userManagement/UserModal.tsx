'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { USER_ROLES } from '@/utils/enums/userRoles';
import { userSchema, updateUserSchema, type UserFormData, type UpdateUserFormData } from '@/utils/schema/userSchema';
import type { User, CreateUserInput, UpdateUserInput, UserModalProps } from '@/types/userTypes';

const UserModal = ({ isOpen, onClose, onSubmit, user, isLoading }: UserModalProps) => {
  const isEditMode = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEditMode ? updateUserSchema : userSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '' as any,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '' as any,
      });
    }
  }, [user, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: UserFormData | UpdateUserFormData) => {
    if (isEditMode) {
      const updateData: UpdateUserInput = {
        _id: user!._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        ...(data.password && data.password.trim() !== '' ? { password: data.password } : {}),
      };
      onSubmit(updateData);
    } else {
      onSubmit(data as CreateUserInput);
    }
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
              {user ? 'Edit User' : 'Create New User'}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  First Name *
                </label>
                <input
                  type="text"
                  {...register('firstName')}
                  className={`w-full px-4 py-2.5 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all ${
                    errors.firstName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-600'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  Last Name *
                </label>
                <input
                  type="text"
                  {...register('lastName')}
                  className={`w-full px-4 py-2.5 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all ${
                    errors.lastName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-600'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Email *
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-4 py-2.5 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-600'
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Password {isEditMode ? '(Leave empty to keep current password)' : '*'}
              </label>
              <input
                type="password"
                {...register('password')}
                className={`w-full px-4 py-2.5 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-600'
                }`}
                placeholder={isEditMode ? 'Enter new password (optional)' : 'Enter password'}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Role *
              </label>
              <select
                {...register('role', { required: 'Role is required' })}
                className={`w-full px-4 py-2.5 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all ${
                  errors.role
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-600'
                }`}
              >
                <option value="" className="bg-slate-700">
                  Select Role
                </option>
                {Object.values(USER_ROLES).map((role) => (
                  <option key={role} value={role} className="bg-slate-700">
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.role.message}
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
                {isLoading ? (user ? 'Updating...' : 'Creating...') : (user ? 'Update User' : 'Create User')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;

