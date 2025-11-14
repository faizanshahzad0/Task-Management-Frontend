'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MRT_SortingState } from 'material-react-table';
import { useTaskHooks } from '@/services/taskHooks';
import TaskTable from '@/components/taskManagement/TaskTable';
import TaskModal from '@/components/taskManagement/TaskModal';
import Loader from '@/components/common/Loader';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types/taskTypes';

const TasksPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState<{
    status?: string;
    priority?: string;
    dueDate?: string;
  }>({});

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const { useGetTasks, useCreateTask, useUpdateTask, useDeleteTask } = useTaskHooks();
  const { data, isLoading, error } = useGetTasks({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id || 'createdAt',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    ...filters,
  });

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleCreateTask = (taskData: CreateTaskInput | UpdateTaskInput) => {
    createTaskMutation.mutate(taskData as CreateTaskInput, {
      onSuccess: () => {
        setIsModalOpen(false);
        setSelectedTask(null);
      },
    });
  };

  const handleUpdateTask = (taskData: CreateTaskInput | UpdateTaskInput) => {
    if ('_id' in taskData) {
      updateTaskMutation.mutate(taskData as UpdateTaskInput, {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedTask(null);
        },
      });
    }
  };

  const handleDeleteTask = (task: Task) => {
    deleteTaskMutation.mutate(task._id, {
      onSuccess: () => {
        if (data && data.tasks.length === 1 && pagination.pageIndex > 0) {
          setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
        }
      },
    });
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  if (isLoading && !data) {
    return <Loader fullScreen />;
  }

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-slate-400">Manage your tasks efficiently</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={createTaskMutation.isPending}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          {createTaskMutation.isPending && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {createTaskMutation.isPending ? 'Creating...' : 'Create New Task'}
        </button>
      </div>

      <TaskTable
        tasksData={data?.tasks || []}
        totalRecords={data?.pagination?.totalTasks || 0}
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
        onDelete={handleDeleteTask}
        isDeleting={deleteTaskMutation.isPending}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
        isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
      />
    </div>
  );
};

export default TasksPage;
