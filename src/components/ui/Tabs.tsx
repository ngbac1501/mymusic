import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/utils/cn';

interface TabsContextValue {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within Tabs');
    }
    return context;
};

interface TabsProps {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    defaultValue,
    value: controlledValue,
    onValueChange,
    children,
    className,
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = controlledValue ?? internalValue;

    const handleValueChange = (newValue: string) => {
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ activeTab: value, setActiveTab: handleValueChange }}>
            <div className={cn('w-full', className)}>{children}</div>
        </TabsContext.Provider>
    );
};

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'pills';
}

export const TabsList: React.FC<TabsListProps> = ({
    children,
    className,
    variant = 'default'
}) => {
    const baseStyles = variant === 'pills'
        ? 'inline-flex gap-2 p-1 bg-dark-800 rounded-xl'
        : 'flex border-b border-dark-700';

    return (
        <div className={cn(baseStyles, className)}>
            {children}
        </div>
    );
};

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'pills';
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
    value,
    children,
    className,
    variant = 'default'
}) => {
    const { activeTab, setActiveTab } = useTabsContext();
    const isActive = activeTab === value;

    const baseStyles = variant === 'pills'
        ? 'px-4 py-2 rounded-lg font-medium transition-all duration-200'
        : 'px-4 py-3 font-medium transition-all duration-200 border-b-2 -mb-[1px]';

    const activeStyles = variant === 'pills'
        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
        : 'border-primary-500 text-primary-400';

    const inactiveStyles = variant === 'pills'
        ? 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'
        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-dark-600';

    return (
        <button
            onClick={() => setActiveTab(value)}
            className={cn(
                baseStyles,
                isActive ? activeStyles : inactiveStyles,
                className
            )}
        >
            {children}
        </button>
    );
};

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
    value,
    children,
    className
}) => {
    const { activeTab } = useTabsContext();

    if (activeTab !== value) return null;

    return (
        <div className={cn('mt-4 animate-fade-in', className)}>
            {children}
        </div>
    );
};
