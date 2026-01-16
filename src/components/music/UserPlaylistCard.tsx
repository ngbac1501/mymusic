import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Music, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useDeletePlaylist } from '@/hooks/usePlaylists';
import type { UserPlaylist } from '@/types';

interface UserPlaylistCardProps {
    playlist: UserPlaylist;
}

export const UserPlaylistCard: React.FC<UserPlaylistCardProps> = ({ playlist }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const { mutate: deletePlaylist, isPending } = useDeletePlaylist();

    // Lấy 4 bài hát đầu tiên để hiển thị thumbnail (nếu có)
    const thumbnailCount = Math.min(playlist.songs.length, 4);

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowConfirm(true);
    };

    const confirmDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        deletePlaylist(playlist.playlistId);
        setShowConfirm(false);
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowConfirm(false);
    };

    return (
        <div className="relative">
            <Link to={`/user-playlist/${playlist.playlistId}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                >
                    {/* Thumbnail */}
                    <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary-500 to-purple-500">
                        {playlist.songs.length > 0 ? (
                            <div className="grid grid-cols-2 gap-0.5 w-full h-full">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            'bg-gray-200 dark:bg-gray-700',
                                            i >= thumbnailCount && 'opacity-30'
                                        )}
                                    >
                                        {i < thumbnailCount && (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Music className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Music className="w-16 h-16 text-white/50" />
                            </div>
                        )}

                        {/* Play button overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                                <Play className="w-6 h-6 fill-current ml-0.5" />
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                            {playlist.name}
                        </h3>
                        {playlist.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                                {playlist.description}
                            </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {playlist.songs.length} bài hát
                        </p>
                    </div>

                    {/* Delete button */}
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </motion.div>
            </Link>

            {/* Confirmation Dialog */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={cancelDelete}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Xóa playlist?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Bạn có chắc chắn muốn xóa playlist "{playlist.name}"? Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isPending}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {isPending ? 'Đang xóa...' : 'Xóa'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
