import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { handleGoogleRedirect } from '@/services/auth';
import { ROUTES } from '@/constants';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PlayerBar } from '@/components/layout/PlayerBar';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoader } from '@/components/common/PageLoader';
import { CreatePlaylistModal } from '@/components/modals/CreatePlaylistModal';
import { AddToPlaylistModal } from '@/components/modals/AddToPlaylistModal';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const SearchPage = lazy(() => import('@/pages/SearchPage').then(m => ({ default: m.SearchPage })));
const ChartPage = lazy(() => import('@/pages/ChartPage').then(m => ({ default: m.ChartPage })));
const Top100Page = lazy(() => import('@/pages/Top100Page').then(m => ({ default: m.Top100Page })));
const SongDetailPage = lazy(() => import('@/pages/SongDetailPage').then(m => ({ default: m.SongDetailPage })));
const ArtistPage = lazy(() => import('@/pages/ArtistPage').then(m => ({ default: m.ArtistPage })));
const AlbumPage = lazy(() => import('@/pages/AlbumPage').then(m => ({ default: m.AlbumPage })));
const PlaylistPage = lazy(() => import('@/pages/PlaylistPage').then(m => ({ default: m.PlaylistPage })));
const PlaylistDetailPage = lazy(() => import('@/pages/PlaylistDetailPage').then(m => ({ default: m.PlaylistDetailPage })));
const MyMusicPage = lazy(() => import('@/pages/MyMusicPage').then(m => ({ default: m.MyMusicPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

// Protected Route Component - Chỉ authenticated users
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component - Chỉ unauthenticated users
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

function App() {
  const { initialize, setFirebaseUser } = useAuthStore();
  const { theme } = useThemeStore();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Initialize auth state listener and cleanup
    const unsubscribe = initialize();

    // Kiểm tra Google redirect result
    handleGoogleRedirect()
      .then((user) => {
        if (user) {
          setFirebaseUser(user);
        }
      })
      .catch((error) => {
        console.error('Error handling Google redirect:', error);
      });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initialize, setFirebaseUser]);

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/chart" element={<ChartPage />} />
                <Route path="/top100" element={<Top100Page />} />
                <Route path="/song/:id" element={<SongDetailPage />} />
                <Route path="/artist/:id" element={<ArtistPage />} />
                <Route path="/album/:id" element={<AlbumPage />} />
                <Route path="/playlist/:id" element={<PlaylistPage />} />
                <Route
                  path="/my-music"
                  element={
                    <ProtectedRoute>
                      <MyMusicPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-music/playlists"
                  element={
                    <ProtectedRoute>
                      <MyMusicPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-music/favorites"
                  element={
                    <ProtectedRoute>
                      <MyMusicPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user-playlist/:playlistId"
                  element={
                    <ProtectedRoute>
                      <PlaylistDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Footer />
          </main>

          {/* Player Bar */}
          <PlayerBar />
        </div>

        {/* Global Modals */}
        <CreatePlaylistModal />
        <AddToPlaylistModal />
      </div>
    </ErrorBoundary>
  );
}

export default App;
