'use client';

import { DeleteConfirmationModalProps } from "@/types/deleteModalTypes";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  description,
  deleteValue,
  isLoading = false,
  confirmButtonText = 'Delete',
  cancelButtonText = 'Cancel',
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  const defaultDescription = deleteValue
    ? `Are you sure you want to delete "${deleteValue}"? This action cannot be undone.`
    : 'Are you sure you want to delete this item? This action cannot be undone.';

  const finalDescription = description || defaultDescription;

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
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
          <p className="text-slate-300 mb-6">{finalDescription}</p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-600 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-all font-medium"
            >
              {cancelButtonText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Deleting...' : confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

