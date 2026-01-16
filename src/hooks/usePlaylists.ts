import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import {
    getUserPlaylists,
    getPlaylist,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
} from '@/services/firestore';
import { TOAST_MESSAGES } from '@/constants';
import toast from 'react-hot-toast';

/**
 * Hook để lấy danh sách playlists của user
 */
export function usePlaylists() {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['playlists', user?.uid],
        queryFn: () => getUserPlaylists(user!.uid),
        enabled: !!user,
    });
}

/**
 * Hook để lấy chi tiết một playlist
 */
export function usePlaylist(playlistId: string) {
    return useQuery({
        queryKey: ['playlist', playlistId],
        queryFn: () => getPlaylist(playlistId),
        enabled: !!playlistId,
    });
}

/**
 * Hook để tạo playlist mới
 */
export function useCreatePlaylist() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, description }: { name: string; description?: string }) => {
            if (!user) throw new Error('User not authenticated');
            const playlistId = await createPlaylist(user.uid, name, description);
            return playlistId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists', user?.uid] });
            toast.success(TOAST_MESSAGES.PLAYLIST_CREATED);
        },
        onError: (error) => {
            toast.error(TOAST_MESSAGES.ERROR);
            console.error('Create playlist error:', error);
        },
    });
}

/**
 * Hook để thêm bài hát vào playlist
 */
export function useAddToPlaylist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ playlistId, songId }: { playlistId: string; songId: string }) => {
            await addSongToPlaylist(playlistId, songId);
            return { playlistId, songId };
        },
        onSuccess: (data) => {
            console.log('🔄 Invalidating queries for playlist:', data.playlistId);
            
            // Invalidate both playlist data and songs for this playlist
            queryClient.invalidateQueries({ queryKey: ['playlist', data.playlistId] });
            console.log('✅ Invalidated: ["playlist", ' + data.playlistId + ']');
            
            queryClient.invalidateQueries({ queryKey: ['playlist-songs', data.playlistId] });
            console.log('✅ Invalidated: ["playlist-songs", ' + data.playlistId + ']');
            
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
            console.log('✅ Invalidated: ["playlists"]');
            
            toast.success(TOAST_MESSAGES.SONG_ADDED_TO_PLAYLIST);
        },
        onError: (error) => {
            toast.error(TOAST_MESSAGES.ERROR);
            console.error('Add to playlist error:', error);
        },
    });
}

/**
 * Hook để xóa bài hát khỏi playlist
 */
export function useRemoveFromPlaylist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ playlistId, songId }: { playlistId: string; songId: string }) => {
            await removeSongFromPlaylist(playlistId, songId);
            return { playlistId, songId };
        },
        onSuccess: (data) => {
            console.log('🔄 Invalidating queries for playlist:', data.playlistId);
            
            queryClient.invalidateQueries({ queryKey: ['playlist', data.playlistId] });
            console.log('✅ Invalidated: ["playlist", ' + data.playlistId + ']');
            
            queryClient.invalidateQueries({ queryKey: ['playlist-songs', data.playlistId] });
            console.log('✅ Invalidated: ["playlist-songs", ' + data.playlistId + ']');
            
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
            console.log('✅ Invalidated: ["playlists"]');
            
            toast.success(TOAST_MESSAGES.SONG_REMOVED_FROM_PLAYLIST);
        },
        onError: (error) => {
            toast.error(TOAST_MESSAGES.ERROR);
            console.error('Remove from playlist error:', error);
        },
    });
}

/**
 * Hook để xóa playlist
 */
export function useDeletePlaylist() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (playlistId: string) => {
            await deletePlaylist(playlistId);
            return playlistId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists', user?.uid] });
            toast.success(TOAST_MESSAGES.PLAYLIST_DELETED);
        },
        onError: (error) => {
            toast.error(TOAST_MESSAGES.ERROR);
            console.error('Delete playlist error:', error);
        },
    });
}
