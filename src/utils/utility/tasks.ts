import { TASKS_PRIORITIES, TASKS_STATUSES } from "../enums/taskStatus";

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case TASKS_STATUSES.COMPLETED:
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case TASKS_STATUSES.INPROGRESS:
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    case TASKS_STATUSES.BLOCKER:
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    case TASKS_STATUSES.PENDING:
    default:
      return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
  }
};

export const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case TASKS_PRIORITIES.URGENT:
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    case TASKS_PRIORITIES.HIGH:
      return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
    case TASKS_PRIORITIES.MEDIUM:
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    case TASKS_PRIORITIES.LOW:
    default:
      return "bg-slate-500/20 text-slate-400 border border-slate-500/30";
  }
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};
