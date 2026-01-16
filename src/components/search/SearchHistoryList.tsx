import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import {
    getSearchHistory,
    deleteSearchHistoryItem,
    clearSearchHistory,
} from '@/services/firestore';
import { X, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface SearchHistoryListProps {
    onSelectQuery: (query: string) => void;
}

export const SearchHistoryList: React.FC<SearchHistoryListProps> = ({ onSelectQuery }) => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    const { data: history } = useQuery({
        queryKey: ['search-history', user?.uid],
        queryFn: () => getSearchHistory(user!.uid, 10),
        enabled: !!user,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSearchHistoryItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['search-history'] });
            toast.success('Đã xóa lịch sử');
        },
    });

    const clearMutation = useMutation({
        mutationFn: () => clearSearchHistory(user!.uid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['search-history'] });
            toast.success('Đã xóa tất cả lịch sử');
        },
    });

    if (!history || history.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Lịch sử tìm kiếm
                </h3>
                <button
                    onClick={() => clearMutation.mutate()}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Xóa tất cả
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                    {history.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <button
                                onClick={() => onSelectQuery(item.query)}
                                className="text-sm text-gray-700 dark:text-gray-300"
                            >
                                {item.query}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteMutation.mutate(item.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
