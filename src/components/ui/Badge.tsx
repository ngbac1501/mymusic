import React, { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md' | 'lg';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    (
        {
            className,
            variant = 'default',
            size = 'md',
            children,
            ...props
        },
        ref
    ) => {
        const variants = {
            default: 'bg-dark-700 text-gray-300 border border-dark-600',
            primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
            success: 'bg-green-500/20 text-green-300 border border-green-500/30',
            warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
            error: 'bg-red-500/20 text-red-300 border border-red-500/30',
            info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        };

        const sizes = {
            sm: 'px-2 py-0.5 text-xs',
            md: 'px-2.5 py-1 text-sm',
            lg: 'px-3 py-1.5 text-base',
        };

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-medium rounded-full',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';
