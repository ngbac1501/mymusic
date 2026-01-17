import React from 'react';
import { AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    variant?: 'default' | 'info' | 'success' | 'error';
    className?: string;
}

const variantConfig = {
    default: {
        iconBg: 'bg-gray-500/20',
        iconColor: 'text-gray-400',
        Icon: Info,
    },
    info: {
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-400',
        Icon: Info,
    },
    success: {
        iconBg: 'bg-green-500/20',
        iconColor: 'text-green-400',
        Icon: CheckCircle,
    },
    error: {
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-400',
        Icon: XCircle,
    },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    variant = 'default',
    className,
}) => {
    const config = variantConfig[variant];
    const DefaultIcon = config.Icon;

    return (
        <div className={cn('text-center py-12 px-4', className)}>
            <div className={cn(
                'w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center',
                config.iconBg
            )}>
                {icon || <DefaultIcon className={cn('w-10 h-10', config.iconColor)} />}
            </div>

            <h3 className="text-xl font-bold text-gray-100 mb-2">
                {title}
            </h3>

            {description && (
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    {description}
                </p>
            )}

            {action && (
                <div className="flex justify-center">
                    {action}
                </div>
            )}
        </div>
    );
};
