// Player Store với Zustand
// Quản lý state của music player

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Song, PlayerState } from '@/types';
import { PLAYER_DEFAULTS, STORAGE_KEYS } from '@/constants';

interface PlayerStore extends PlayerState {
  // Actions
  setCurrentSong: (song: Song | null) => void;
  setQueue: (songs: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  setCurrentIndex: (index: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setShuffle: (shuffle: boolean) => void;
  setRepeat: (mode: 'none' | 'one' | 'all') => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsLoading: (loading: boolean) => void;
  clear: () => void;
}

const initialState: PlayerState = {
  currentSong: null,
  currentIndex: -1,
  queue: [],
  isPlaying: false,
  isShuffled: false,
  repeatMode: PLAYER_DEFAULTS.REPEAT_MODE,
  volume: PLAYER_DEFAULTS.VOLUME,
  currentTime: 0,
  duration: 0,
  isLoading: false,
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentSong: (song) => set({ currentSong: song }),

      setQueue: (songs) => set({ queue: songs, currentIndex: 0 }),

      addToQueue: (song) => {
        const { queue } = get();
        set({ queue: [...queue, song] });
      },

      removeFromQueue: (index) => {
        const { queue, currentIndex } = get();
        const newQueue = queue.filter((_, i) => i !== index);
        let newIndex = currentIndex;

        if (index < currentIndex) {
          newIndex = currentIndex - 1;
        } else if (index === currentIndex && newQueue.length > 0) {
          newIndex = Math.min(currentIndex, newQueue.length - 1);
        } else if (newQueue.length === 0) {
          newIndex = -1;
        }

        set({ queue: newQueue, currentIndex: newIndex });
      },

      setCurrentIndex: (index) => set({ currentIndex: index }),

      play: () => set({ isPlaying: true }),

      pause: () => set({ isPlaying: false }),

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      next: () => {
        const { queue, currentIndex, repeatMode, isShuffled } = get();

        if (queue.length === 0) return;

        let nextIndex: number;

        if (isShuffled) {
          // Random next song
          nextIndex = Math.floor(Math.random() * queue.length);
        } else {
          nextIndex = currentIndex + 1;
          if (nextIndex >= queue.length) {
            if (repeatMode === 'all') {
              nextIndex = 0;
            } else {
              return; // Không có bài tiếp theo
            }
          }
        }

        set({
          currentIndex: nextIndex,
          currentSong: queue[nextIndex],
          currentTime: 0,
        });
      },

      previous: () => {
        const { queue, currentIndex, repeatMode, isShuffled } = get();

        if (queue.length === 0) return;

        let prevIndex: number;

        if (isShuffled) {
          prevIndex = Math.floor(Math.random() * queue.length);
        } else {
          prevIndex = currentIndex - 1;
          if (prevIndex < 0) {
            if (repeatMode === 'all') {
              prevIndex = queue.length - 1;
            } else {
              return; // Không có bài trước
            }
          }
        }

        set({
          currentIndex: prevIndex,
          currentSong: queue[prevIndex],
          currentTime: 0,
        });
      },

      setShuffle: (shuffle) => set({ isShuffled: shuffle }),

      setRepeat: (mode) => set({ repeatMode: mode }),

      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

      setCurrentTime: (time) => set({ currentTime: time }),

      setDuration: (duration) => set({ duration }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      clear: () => set(initialState),
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        volume: state.volume,
        repeatMode: state.repeatMode,
        isShuffled: state.isShuffled,
      }),
    }
  )
);
