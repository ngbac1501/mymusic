import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlaylists, useAddToPlaylist } from '@/hooks/usePlaylists';
import { useModalStore } from '@/store/useModalStore';
import { Button } from '@/components/common/Button';
import { Skeleton } from '@/components/common/Skeleton';

export const AddToPlaylistModal: React.FC = () => {
    const { isAddToPlaylistOpen, selectedSong, closeAddToPlaylist, openCreatePlaylist } =
        useModalStore();
    const { data: playlists, isLoading } = usePlaylists();
    const { mutate: addToPlaylist, isPending } = useAddToPlaylist();
    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

    const handleTogglePlaylist = (playlistId: string) => {
        setSelectedPlaylists((prev) =>
            prev.includes(playlistId)
                ? prev.filter((id) => id !== playlistId)
                : [...prev, playlistId]
        );
    };

    const handleAdd = () => {
        if (!selectedSong || selectedPlaylists.length === 0) return;

        // Add to all selected playlists
        selectedPlaylists.forEach((playlistId) => {
            addToPlaylist({ playlistId, songId: selectedSong.encodeId });
        });

        handleClose();
    };

    const handleClose = () => {
        setSelectedPlaylists([]);
        closeAddToPlaylist();
    };

    const handleCreateNew = () => {
        closeAddToPlaylist();
        openCreatePlaylist();
    };

    return (
        <AnimatePresence>
            {isAddToPlaylistOpen && (
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
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        Thêm vào playlist
                                    </h2>
                                    {selectedSong && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {selectedSong.title}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Create New Button */}
                            <button
                                onClick={handleCreateNew}
                                className="w-full flex items-center gap-3 p-4 mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    Tạo playlist mới
                                </span>
                            </button>

                            {/* Playlists List */}
                            <div className="max-h-96 overflow-y-auto space-y-2 mb-6">
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                                    ))
                                ) : playlists && playlists.length > 0 ? (
                                    playlists.map((playlist) => (
                                        <label
                                            key={playlist.playlistId}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedPlaylists.includes(playlist.playlistId)}
                                                onChange={() => handleTogglePlaylist(playlist.playlistId)}
                                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {playlist.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {playlist.songs.length} bài hát
                                                </p>
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Bạn chưa có playlist nào
                                        </p>
                                        <button
                                            onClick={handleCreateNew}
                                            className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            Tạo playlist đầu tiên
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    className="flex-1"
                                    disabled={isPending}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleAdd}
                                    className="flex-1"
                                    isLoading={isPending}
                                    disabled={selectedPlaylists.length === 0}
                                >
                                    Thêm ({selectedPlaylists.length})
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
