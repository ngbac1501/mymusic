import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreatePlaylist } from '@/hooks/usePlaylists';
import { useModalStore } from '@/store/useModalStore';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const createPlaylistSchema = z.object({
    name: z.string().min(1, 'Tên playlist không được để trống'),
    description: z.string().optional(),
});

type CreatePlaylistFormData = z.infer<typeof createPlaylistSchema>;

export const CreatePlaylistModal: React.FC = () => {
    const { isCreatePlaylistOpen, closeCreatePlaylist } = useModalStore();
    const { mutate: createPlaylist, isPending } = useCreatePlaylist();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreatePlaylistFormData>({
        resolver: zodResolver(createPlaylistSchema),
    });

    const onSubmit = (data: CreatePlaylistFormData) => {
        createPlaylist(data, {
            onSuccess: () => {
                reset();
                closeCreatePlaylist();
            },
        });
    };

    const handleClose = () => {
        reset();
        closeCreatePlaylist();
    };

    return (
        <AnimatePresence>
            {isCreatePlaylistOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Tạo playlist mới
                                </h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <Input
                                    label="Tên playlist"
                                    placeholder="Nhập tên playlist..."
                                    error={errors.name?.message}
                                    {...register('name')}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Mô tả (tùy chọn)
                                    </label>
                                    <textarea
                                        {...register('description')}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        placeholder="Mô tả về playlist của bạn..."
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        className="flex-1"
                                        disabled={isPending}
                                    >
                                        Hủy
                                    </Button>
                                    <Button type="submit" className="flex-1" isLoading={isPending}>
                                        Tạo
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
