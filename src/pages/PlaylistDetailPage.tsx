import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPlaylist } from '@/services/firestore';
import { getSong } from '@/services/zingmp3';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useRemoveFromPlaylist } from '@/hooks/usePlaylists';
import { SongCard } from '@/components/music/SongCard';
import { Skeleton } from '@/components/common/Skeleton';
import { Button } from '@/components/common/Button';
import { Play, Music, ArrowLeft, X } from 'lucide-react';
import { ROUTES } from '@/constants';
import toast from 'react-hot-toast';

export const PlaylistDetailPage: React.FC = () => {
    const { playlistId } = useParams<{ playlistId: string }>();
    const navigate = useNavigate();
    const { setQueue, setCurrentIndex, play } = usePlayerStore();
    const { mutate: removeSong } = useRemoveFromPlaylist();

    // Fetch playlist data
    const { data: playlist, isLoading: playlistLoading } = useQuery({
        queryKey: ['playlist', playlistId],
        queryFn: () => getPlaylist(playlistId!),
        enabled: !!playlistId,
    });

    // Log playlist changes for debugging
    React.useEffect(() => {
        if (playlist) {
            console.log('📌 Playlist data updated:', {
                name: playlist.name,
                songsCount: playlist.songs?.length || 0,
                songs: playlist.songs,
            });
        }
    }, [playlist]);

    // Fetch songs data
    const songsQuery = useQuery({
        queryKey: ['playlist-songs', playlistId],
        queryFn: async () => {
            if (!playlist) {
                return [];
            }
            
            if (!playlist.songs || playlist.songs.length === 0) {
                return [];
            }

            const songPromises = playlist.songs.map(async (songId) => {
                try {
                    const song = await getSong(songId);
                    return song;
                } catch (err) {
                    console.error(`❌ Failed to fetch song ${songId}:`, (err as any)?.message);
                    // getSong now has fallback, so this shouldn't happen
                    // But just in case, return the fallback manually
                    return {
                        encodeId: songId,
                        title: `Song ${songId}`,
                        alias: songId,
                        artists: [],
                        artistNames: '',
                        thumbnail: '',
                        thumbnailM: '',
                        duration: 0,
                    };
                }
            });

            const results = await Promise.all(songPromises);
            const validSongs = results.filter((song) => song !== null && song !== undefined);
            return validSongs;
        },
        enabled: !!playlist && !!playlist.songs && playlist.songs.length > 0,
        staleTime: 0, // Always refetch when invalidated
        refetchOnMount: true, // Refetch when component mounts
        refetchOnWindowFocus: true, // Refetch when window regains focus
    });

    const { data: songs, isLoading: songsLoading, error: songsError, refetch: refetchSongs } = songsQuery;

    // Auto refetch songs when playlist changes
    React.useEffect(() => {
        if (playlist?.songs && playlist.songs.length > 0) {
            refetchSongs();
        }
    }, [playlist?.songs, refetchSongs]);

    const isLoading = playlistLoading || songsLoading;

    const handlePlayAll = () => {
        if (!songs || songs.length === 0) {
            toast.error('Playlist chưa có bài hát');
            return;
        }
        setQueue(songs);
        setCurrentIndex(0);
        // Set current song to first song
        if (songs.length > 0) {
            const { setCurrentSong } = usePlayerStore.getState();
            setCurrentSong(songs[0]);
        }
        play();
        toast.success('Đang phát playlist');
    };

    const handleRemoveSong = (songId: string) => {
        if (!playlistId) return;
        removeSong({ playlistId, songId });
    };

    if (playlistLoading) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <Skeleton className="h-8 w-32 mb-6" />
                    <Skeleton className="h-48 w-full mb-6" />
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto text-center py-16">
                    <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Không tìm thấy playlist
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        ID: {playlistId}
                    </p>
                    <Button onClick={() => navigate(ROUTES.MY_MUSIC)}>
                        Quay lại thư viện
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate(ROUTES.MY_MUSIC)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>

                {/* Playlist Header */}
                <div className="bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg p-8 mb-6">
                    <div className="flex items-end gap-6">
                        {/* Thumbnail */}
                        <div className="w-48 h-48 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                            <Music className="w-24 h-24 text-white/50" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-white">
                            <p className="text-sm font-medium mb-2 opacity-90">PLAYLIST</p>
                            <h1 className="text-4xl font-bold mb-4">{playlist.name}</h1>
                            {playlist.description && (
                                <p className="text-white/90 mb-4">{playlist.description}</p>
                            )}
                            <p className="text-white/80">
                                {playlist.songs.length} bài hát
                            </p>
                        </div>
                    </div>

                    {/* Play All Button */}
                    <div className="mt-6">
                        <Button
                            onClick={handlePlayAll}
                            disabled={!songs || songs.length === 0}
                            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full flex items-center gap-2"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Phát tất cả
                        </Button>
                    </div>
                </div>

                {/* Songs List */}
                {isLoading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                ) : songsError ? (
                    <div className="text-center py-16">
                        <Music className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Lỗi tải bài hát
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            {(songsError as any)?.message || 'Không thể tải danh sách bài hát'}
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Tải lại
                        </Button>
                    </div>
                ) : songs && songs.length > 0 ? (
                    <div className="space-y-2">
                        {songs.map((song, index) => (
                            <div key={song.encodeId} className="group relative">
                                <SongCard song={song} index={index} showIndex />
                                {/* Remove button */}
                                <button
                                    onClick={() => handleRemoveSong(song.encodeId)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    title="Xóa khỏi playlist"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Playlist chưa có bài hát
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Thêm bài hát vào playlist để bắt đầu nghe nhạc
                        </p>
                        
                        {/* Debug info in development */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-6 text-left bg-gray-100 dark:bg-gray-900 p-4 rounded text-xs font-mono inline-block max-w-md">
                                <p className="text-gray-600 dark:text-gray-400 mb-2">🔍 Debug Info:</p>
                                <p>Playlist ID: {playlistId}</p>
                                <p>Playlist Name: {playlist?.name}</p>
                                <p>Songs Array: {JSON.stringify(playlist?.songs)}</p>
                                <p>Songs Length: {playlist?.songs?.length ?? 'undefined'}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
