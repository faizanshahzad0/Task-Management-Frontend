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
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState<{ status?: string; priority?: string; dueDate?: string }>({});

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const { useGetTasks, useCreateTask, useUpdateTask, useDeleteTask } = useTaskHooks();
  
  const page = pagination.pageIndex + 1;
  const pageSize = pagination.pageSize;
  
  const { data, isLoading, error } = useGetTasks(page, pageSize, globalFilter, filters);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [globalFilter, filters]);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    deleteTaskMutation.mutate(task._id, {
      onSuccess: () => {
        const newTotalPages = Math.ceil(((data?.pagination?.totalTasks || 1) - 1) / pagination.pageSize);
        if (pagination.pageIndex >= newTotalPages) {
          setPagination((prev) => ({
            ...prev,
            pageIndex: Math.max(0, newTotalPages - 1),
          }));
        }
      },
    });
  };

  const handleModalSubmit = (data: CreateTaskInput) => {
    if (selectedTask) {
      const updateData: UpdateTaskInput = {
        _id: selectedTask._id,
        ...data,
      };
      updateTaskMutation.mutate(updateData, {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedTask(null);
        },
      });
    } else {
      createTaskMutation.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };


  if (isLoading && !data) {
    return <Loader fullScreen text="Loading tasks..." />;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Task Management
            </h1>
            <p className="text-slate-400 text-sm">
              Manage and organize your tasks efficiently
            </p>
          </div>
          <button
            onClick={handleCreateTask}
            disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="flex items-center gap-2">
              {createTaskMutation.isPending || updateTaskMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Create New Task
                </>
              )}
            </span>
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-6">
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
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            isDeleting={deleteTaskMutation.isPending}
          />
        </div>

        {/* Create/Edit Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          onSubmit={handleModalSubmit}
          task={selectedTask}
          isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
        />

      </div>
    </div>
  );
};

export default TasksPage;
