import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { handleGoogleRedirect } from '@/services/auth';
import { ROUTES } from '@/constants';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PlayerBar } from '@/components/layout/PlayerBar';
import { Footer } from '@/components/layout/Footer';

// Pages
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { SearchPage } from '@/pages/SearchPage';
import { ChartPage } from '@/pages/ChartPage';
import { Top100Page } from '@/pages/Top100Page';
import { SongDetailPage } from '@/pages/SongDetailPage';
import { ArtistPage } from '@/pages/ArtistPage';
import { AlbumPage } from '@/pages/AlbumPage';
import { PlaylistPage } from '@/pages/PlaylistPage';
import { PlaylistDetailPage } from '@/pages/PlaylistDetailPage';
import { MyMusicPage } from '@/pages/MyMusicPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { CreatePlaylistModal } from '@/components/modals/CreatePlaylistModal';
import { AddToPlaylistModal } from '@/components/modals/AddToPlaylistModal';

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
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
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
          <Footer />
        </main>

        {/* Player Bar */}
        <PlayerBar />
      </div>

      {/* Global Modals */}
      <CreatePlaylistModal />
      <AddToPlaylistModal />
    </div >
  );
}

export default App;
