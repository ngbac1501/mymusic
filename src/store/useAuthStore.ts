// Auth Store với Zustand
// Quản lý authentication state

import { create } from 'zustand';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { getUser } from '@/services/firestore';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => (() => void) | undefined;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  firebaseUser: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),

  setLoading: (loading) => set({ isLoading: loading }),

  initialize: () => {
    // Lắng nghe thay đổi auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        set({ firebaseUser, isLoading: false });

        // Lấy thông tin user từ Firestore
        const userData = await getUser(firebaseUser.uid);
        if (userData) {
          set({ user: userData });
        } else {
          // Nếu chưa có trong Firestore, tạo từ Firebase User
          set({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
              preferences: {
                theme: 'dark',
                language: 'vi',
              },
            },
          });
        }
      } else {
        set({ firebaseUser: null, user: null, isLoading: false });
      }
    });
    
    return unsubscribe;
  },
}));
