import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import {
    getFavorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
} from '@/services/firestore';
import { TOAST_MESSAGES } from '@/constants';
import toast from 'react-hot-toast';

/**
 * Hook để lấy danh sách bài hát yêu thích
 */
export function useFavorites() {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['favorites', user?.uid],
        queryFn: () => getFavorites(user!.uid),
        enabled: !!user,
    });
}

/**
 * Hook để kiểm tra một bài hát có trong favorites không
 */
export function useIsFavorite(songId: string) {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['is-favorite', user?.uid, songId],
        queryFn: () => isFavorite(user!.uid, songId),
        enabled: !!user && !!songId,
    });
}

/**
 * Hook để toggle favorite (thêm/xóa)
 */
export function useToggleFavorite() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ songId, isFav }: { songId: string; isFav: boolean }) => {
            if (!user) throw new Error('User not authenticated');

            if (isFav) {
                await removeFromFavorites(user.uid, songId);
            } else {
                await addToFavorites(user.uid, songId);
            }

            return { songId, isFav: !isFav };
        },
        onMutate: async ({ songId, isFav }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['is-favorite', user?.uid, songId] });
            await queryClient.cancelQueries({ queryKey: ['favorites', user?.uid] });

            // Snapshot previous value
            const previousIsFavorite = queryClient.getQueryData(['is-favorite', user?.uid, songId]);

            // Optimistically update
            queryClient.setQueryData(['is-favorite', user?.uid, songId], !isFav);

            return { previousIsFavorite };
        },
        onError: (error, { songId }, context) => {
            // Rollback on error
            queryClient.setQueryData(
                ['is-favorite', user?.uid, songId],
                context?.previousIsFavorite
            );
            toast.error(TOAST_MESSAGES.ERROR);
            console.error('Toggle favorite error:', error);
        },
        onSuccess: (data) => {
            // Invalidate queries to refetch
            queryClient.invalidateQueries({ queryKey: ['favorites', user?.uid] });
            queryClient.invalidateQueries({ queryKey: ['is-favorite', user?.uid, data.songId] });

            // Show success message
            if (data.isFav) {
                toast.success(TOAST_MESSAGES.SONG_ADDED_TO_FAVORITES);
            } else {
                toast.success(TOAST_MESSAGES.SONG_REMOVED_FROM_FAVORITES);
            }
        },
    });
}
