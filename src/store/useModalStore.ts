import { create } from 'zustand';
import type { Song } from '@/types';

interface ModalState {
    // Create Playlist Modal
    isCreatePlaylistOpen: boolean;
    openCreatePlaylist: () => void;
    closeCreatePlaylist: () => void;

    // Add to Playlist Modal
    isAddToPlaylistOpen: boolean;
    selectedSong: Song | null;
    openAddToPlaylist: (song: Song) => void;
    closeAddToPlaylist: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    // Create Playlist Modal
    isCreatePlaylistOpen: false,
    openCreatePlaylist: () => set({ isCreatePlaylistOpen: true }),
    closeCreatePlaylist: () => set({ isCreatePlaylistOpen: false }),

    // Add to Playlist Modal
    isAddToPlaylistOpen: false,
    selectedSong: null,
    openAddToPlaylist: (song) => set({ isAddToPlaylistOpen: true, selectedSong: song }),
    closeAddToPlaylist: () => set({ isAddToPlaylistOpen: false, selectedSong: null }),
}));
