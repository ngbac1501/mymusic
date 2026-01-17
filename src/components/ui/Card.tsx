import React, { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'elevated' | 'outline';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = 'default',
            padding = 'md',
            hover = false,
            children,
            ...props
        },
        ref
    ) => {
        const variants = {
            default: 'bg-dark-800 border border-dark-700',
            glass: 'glass',
            elevated: 'bg-dark-800 shadow-xl border border-dark-700/50',
            outline: 'border-2 border-primary-500/30 bg-transparent',
        };

        const paddings = {
            none: '',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl transition-all duration-300',
                    variants[variant],
                    paddings[padding],
                    hover && 'card-hover cursor-pointer',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
