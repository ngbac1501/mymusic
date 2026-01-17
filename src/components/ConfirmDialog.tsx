import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    variant = 'warning',
    isLoading = false,
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <Card
                variant="glass"
                padding="lg"
                className="relative max-w-md w-full animate-scale-in"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Icon */}
                <div className="mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-red-500/20' :
                            variant === 'warning' ? 'bg-yellow-500/20' :
                                'bg-blue-500/20'
                        }`}>
                        <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-red-400' :
                                variant === 'warning' ? 'text-yellow-400' :
                                    'text-blue-400'
                            }`} />
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                    {title}
                </h3>

                {description && (
                    <p className="text-gray-400 mb-6">
                        {description}
                    </p>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        className="flex-1"
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </Card>
        </div>
    );
};
