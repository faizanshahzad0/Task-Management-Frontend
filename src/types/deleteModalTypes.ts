export interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    deleteValue?: string;
    isLoading?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
}