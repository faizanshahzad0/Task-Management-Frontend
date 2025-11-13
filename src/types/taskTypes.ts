import { TASKS_STATUSES, TASKS_PRIORITIES } from "@/utils/enums/taskStatus";
import { MRT_SortingState } from "material-react-table";

type TaskStatus = typeof TASKS_STATUSES[keyof typeof TASKS_STATUSES];
type TaskPriority = typeof TASKS_PRIORITIES[keyof typeof TASKS_PRIORITIES];

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
  } | string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  _id: string;
}

export interface TasksResponse {
  message?: string;
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
  };
}

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void;
  task?: Task | null;
  isLoading?: boolean;
}


export interface TaskTableProps {
  tasksData: Task[];
  totalRecords: number;
  pagination: { pageSize: number; pageIndex: number };
  setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
  isLoading: boolean;
  sorting: MRT_SortingState;
  setSorting: (updater: MRT_SortingState | ((prev: MRT_SortingState) => MRT_SortingState)) => void;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  filters: { status?: string; priority?: string; dueDate?: string };
  setFilters: React.Dispatch<React.SetStateAction<{ status?: string; priority?: string; dueDate?: string }>>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  isDeleting?: boolean;
}

