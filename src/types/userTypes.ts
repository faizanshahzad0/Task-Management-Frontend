import { USER_ROLES } from "@/utils/enums/userRoles";
import { MRT_SortingState } from "material-react-table";

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserInput extends Partial<Omit<CreateUserInput, 'password'>> {
  _id: string;
  password?: string;
}

export interface UsersResponse {
  message?: string;
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
  };
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void;
  user?: User | null;
  isLoading?: boolean;
}

export interface UserTableProps {
  usersData: User[];
  totalRecords: number;
  pagination: { pageSize: number; pageIndex: number };
  setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
  isLoading: boolean;
  sorting: MRT_SortingState;
  setSorting: (updater: MRT_SortingState | ((prev: MRT_SortingState) => MRT_SortingState)) => void;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  filters: { role?: string };
  setFilters: React.Dispatch<React.SetStateAction<{ role?: string }>>;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isDeleting?: boolean;
}

