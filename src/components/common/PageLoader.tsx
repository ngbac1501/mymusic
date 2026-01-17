import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
    message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message = 'Đang tải...' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">{message}</p>
            </div>
        </div>
    );
};
