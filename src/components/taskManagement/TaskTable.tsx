'use client';

import { useState, useEffect } from 'react';
import { MaterialReactTable, MRT_Cell, MRT_SortingState, type MRT_Row } from 'material-react-table';
import type { Task } from '@/types/taskTypes';
import { TASKS_STATUSES, TASKS_PRIORITIES } from '@/utils/enums/taskStatus';
import DeleteConfirmationModal from '@/components/common/deleteConfirmationModal';
import type { TaskTableProps } from '@/types/taskTypes';
import { getStatusBadgeColor, getPriorityBadgeColor, formatDate } from '@/utils/utility/tasks';
import { DebouncedInput } from '../common/debounceInput';

const TaskTable = ({
  tasksData,
  totalRecords,
  pagination,
  setPagination,
  isLoading,
  sorting,
  setSorting,
  globalFilter,
  setGlobalFilter,
  filters,
  setFilters,
  onEdit,
  onDelete,
  isDeleting = false,
}: TaskTableProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [wasDeleting, setWasDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (wasDeleting && !isDeleting) {
      setDeleteModalOpen(false);
      setSelectedTask(null);
      setWasDeleting(false);
    }
  }, [isDeleting, wasDeleting]);

  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    onEdit(task);
  };

  const handleDeleteConfirm = () => {
    if (selectedTask) {
      setWasDeleting(true);
      onDelete(selectedTask);
    }
  };

  const handleFilterChange = (key: 'status' | 'priority' | 'dueDate', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = filters.status || filters.priority || filters.dueDate;

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
      size: 200,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      size: 300,
      Cell: ({ cell }: { cell: MRT_Cell<Task> }) => (
        <div className="max-w-xs truncate">{cell.getValue<string>()}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      Cell: ({ cell }: { cell: MRT_Cell<Task> }) => {
        const status = cell.getValue<string>();
        return (
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(status)}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      size: 120,
      Cell: ({ cell }: { cell: MRT_Cell<Task> }) => {
        const priority = cell.getValue<string>();
        return (
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(priority)}`}
          >
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      size: 120,
      Cell: ({ cell }: { cell: MRT_Cell<Task> }) => (
        <span>{formatDate(cell.getValue<string>())}</span>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      enableSorting: false,
      enableColumnFilter: false,
      size: 100,
      Cell: ({ row }: { row: MRT_Row<Task> }) => {
        const isDeletingThisTask = isDeleting && selectedTask?._id === row.original._id;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEditClick(row.original)}
              disabled={isDeleting}
              className="p-2 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => handleDeleteClick(row.original)}
              disabled={isDeleting}
              className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative"
              title="Delete"
            >
              {isDeletingThisTask ? (
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-y-8 task-table-wrapper">
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        description={`Are you sure you want to delete the task "${selectedTask?.title}"? This action cannot be undone.`}
        deleteValue={selectedTask?.title}
        isLoading={isDeleting}
      />
      {/* Filter Section */}
      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 mb-4">
        <div className={`flex items-center justify-between ${showFilters ? 'mb-4' : ''}`}>
          <h3 className="text-sm font-semibold text-white">Filter Tasks</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                hasActiveFilters
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500 border border-slate-500'
              }`}
              title="Toggle Filters"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {[filters.status, filters.priority, filters.dueDate].filter(Boolean).length}
                </span>
              )}
            </button>
            <button
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className="px-4 py-2.5 text-sm font-medium text-blue-400 hover:text-blue-300 border border-blue-500/50 hover:border-blue-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-blue-400"
            >
              Clear All
            </button>
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showFilters 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div 
            className={`transform transition-all duration-300 ${
              showFilters 
                ? 'translate-y-0 scale-100' 
                : '-translate-y-2 scale-95'
            }`}
          >
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-xs font-medium text-slate-300">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm transition-all"
                >
                  <option value="" className="bg-slate-800">
                    All Statuses
                  </option>
                  {Object.values(TASKS_STATUSES).map((status) => (
                    <option key={status} value={status} className="bg-slate-800">
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-slate-300">
                  Priority
                </label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm transition-all"
                >
                  <option value="" className="bg-slate-800">
                    All Priorities
                  </option>
                  {Object.values(TASKS_PRIORITIES).map((priority) => (
                    <option key={priority} value={priority} className="bg-slate-800">
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-slate-300">
                  Due Date
                </label>
                <input
                  type="date"
                  value={filters.dueDate || ''}
                  onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm transition-all [color-scheme:dark]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <MaterialReactTable
        columns={columns}
        data={tasksData ?? []}
        manualPagination={true}
        rowCount={totalRecords}
        enableGlobalFilter={false}
        enableColumnFilters={true}
        enableSorting={tasksData && tasksData.length > 1 ? true : false}
        manualSorting={true}
        enableRowSelection={false}
        positionToolbarAlertBanner="none"
        getRowId={(row) => String(row._id)}
        state={{
          pagination,
          isLoading,
          sorting,
          globalFilter,
        }}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        renderTopToolbarCustomActions={() => (
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
          />
        )}
        muiTableContainerProps={{
          sx: {
            backgroundColor: '#1e293b',
            borderRadius: '0.5rem',
          },
        }}
        muiTablePaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: '#1e293b',
            color: '#f1f5f9',
            borderBottom: '1px solid #334155',
            fontWeight: 600,
            fontSize: '0.875rem',
                '& .MuiTableSortLabel-root': {
              color: '#94a3b8 !important',
              '&:hover': {
                color: '#f1f5f9 !important',
              },
              '&.Mui-active': {
                color: '#3b82f6 !important',
              },
              '& .MuiTableSortLabel-icon': {
                color: '#94a3b8 !important',
              },
              '&.Mui-active .MuiTableSortLabel-icon': {
                color: '#3b82f6 !important',
              },
            },
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            backgroundColor: '#1e293b',
            color: '#f1f5f9',
            borderBottom: '1px solid #334155',
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            '&:hover': {
              backgroundColor: '#334155',
            },
          },
        }}
        muiTopToolbarProps={{
          sx: {
            backgroundColor: 'transparent',
            minHeight: '3.5rem',
            '& .MuiIconButton-root': {
              color: '#94a3b8 !important',
              '&:hover': {
                backgroundColor: '#334155 !important',
                color: '#f1f5f9 !important',
              },
            },
            '& .MuiButton-root': {
              color: '#94a3b8 !important',
              '&:hover': {
                backgroundColor: '#334155 !important',
                color: '#f1f5f9 !important',
              },
            },
            '& .MuiToggleButton-root': {
              color: '#94a3b8 !important',
              borderColor: '#475569 !important',
              '&:hover': {
                backgroundColor: '#334155 !important',
                color: '#f1f5f9 !important',
              },
              '&.Mui-selected': {
                backgroundColor: '#3b82f6 !important',
                color: '#ffffff !important',
                borderColor: '#3b82f6 !important',
                '&:hover': {
                  backgroundColor: '#2563eb !important',
                },
              },
            },
            '& .MuiSvgIcon-root': {
              color: '#94a3b8 !important',
            },
            '& *': {
              color: '#94a3b8 !important',
            },
          },
        }}
        muiToolbarAlertBannerProps={{
          sx: {
            backgroundColor: 'transparent',
            color: '#f1f5f9',
          },
        }}
        muiToolbarAlertBannerChipProps={{
          sx: {
            backgroundColor: '#334155',
            color: '#f1f5f9',
          },
        }}
        muiBottomToolbarProps={{
          sx: {
            backgroundColor: 'transparent',
            color: '#94a3b8',
            '& .MuiTablePagination-toolbar': {
              color: '#f1f5f9',
            },
            '& .MuiTablePagination-displayedRows': {
              color: '#f1f5f9 !important',
            },
            '& .MuiTablePagination-selectLabel': {
              color: '#94a3b8 !important',
              margin: 0,
            },
            '& .MuiTablePagination-select': {
              color: '#f1f5f9 !important',
              '& .MuiSvgIcon-root': {
                color: '#94a3b8',
              },
            },
            '& .MuiTablePagination-selectIcon': {
              color: '#94a3b8',
            },
            '& .MuiIconButton-root': {
              color: '#94a3b8 !important',
              '&:hover': {
                backgroundColor: '#334155',
              },
              '&.Mui-disabled': {
                color: '#475569 !important',
              },
            },
            '& .MuiTypography-root': {
              color: '#f1f5f9 !important',
            },
            '& *': {
              color: '#f1f5f9 !important',
            },
          },
        }}
        muiPaginationProps={{
          sx: {
            color: '#f1f5f9',
            '& .MuiTablePagination-toolbar': {
              color: '#f1f5f9',
            },
            '& .MuiTablePagination-selectLabel': {
              color: '#94a3b8 !important',
            },
            '& .MuiTablePagination-displayedRows': {
              color: '#f1f5f9 !important',
            },
            '& .MuiTablePagination-select': {
              color: '#f1f5f9 !important',
            },
            '& .MuiTablePagination-selectIcon': {
              color: '#94a3b8',
            },
            '& .MuiIconButton-root': {
              color: '#94a3b8 !important',
              '&:hover': {
                backgroundColor: '#334155',
              },
              '&.Mui-disabled': {
                color: '#475569 !important',
              },
            },
          },
        }}
        muiSearchTextFieldProps={{
          sx: {
            backgroundColor: '#1e293b',
            '& .MuiOutlinedInput-root': {
              color: '#f1f5f9',
              '& fieldset': {
                borderColor: '#475569',
              },
              '&:hover fieldset': {
                borderColor: '#64748b',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
              },
            },
          },
        }}
        muiFilterTextFieldProps={{
          sx: {
            backgroundColor: '#1e293b',
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#1e293b',
              color: '#f1f5f9',
              '& fieldset': {
                borderColor: '#475569',
              },
              '&:hover fieldset': {
                borderColor: '#64748b',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
              },
            },
            '& .MuiInputBase-input': {
              color: '#f1f5f9 !important',
            },
            '& .MuiInputLabel-root': {
              color: '#94a3b8 !important',
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#64748b !important',
              opacity: 1,
            },
          },
        }}
        localization={{
          noRecordsToDisplay: 'No tasks found',
          rowsPerPage: 'Rows per page',
          of: 'of',
        }}
      />
    </div>
  );
};

export default TaskTable;
