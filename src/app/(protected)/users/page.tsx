'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MRT_SortingState } from 'material-react-table';
import { useUserHooks } from '@/services/userHooks';
import UserTable from '@/components/userManagement/UserTable';
import UserModal from '@/components/userManagement/UserModal';
import Loader from '@/components/common/Loader';
import type { User, CreateUserInput, UpdateUserInput } from '@/types/userTypes';

const UsersPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState<{
    role?: string;
  }>({});

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const { useGetUsers, useCreateUser, useUpdateUser, useDeleteUser } = useUserHooks();
  const { data, isLoading, error } = useGetUsers({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search: globalFilter || undefined,
    filters: filters.role ? filters : undefined,
  });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleCreateUser = (userData: CreateUserInput) => {
    createUserMutation.mutate(userData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setSelectedUser(null);
      },
    });
  };

  const handleUpdateUser = (userData: UpdateUserInput) => {
    updateUserMutation.mutate(userData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setSelectedUser(null);
      },
    });
  };

  const handleDeleteUser = (user: User) => {
    deleteUserMutation.mutate(user._id, {
      onSuccess: () => {
        if (data && data.users.length === 1 && pagination.pageIndex > 0) {
          setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
        }
      },
    });
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (isLoading && !data) {
    return <Loader fullScreen />;
  }

  const totalUsers = data?.pagination?.totalUsers ?? 0;

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
          <p className="text-slate-400">Manage your users efficiently</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={createUserMutation.isPending}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          {createUserMutation.isPending && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {createUserMutation.isPending ? 'Creating...' : 'Create New User'}
        </button>
      </div>

      <UserTable
        usersData={data?.users || []}
        totalRecords={totalUsers}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        sorting={sorting}
        setSorting={setSorting}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        filters={filters}
        setFilters={setFilters}
        onEdit={handleEdit}
        onDelete={handleDeleteUser}
        isDeleting={deleteUserMutation.isPending}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
        user={selectedUser}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
      />
    </div>
  );
};

export default UsersPage;

