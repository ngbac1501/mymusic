import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserPlaylists, getFavorites } from '@/services/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { useModalStore } from '@/store/useModalStore';
import { SongCard } from '@/components/music/SongCard';
import { UserPlaylistCard } from '@/components/music/UserPlaylistCard';
import { Skeleton } from '@/components/common/Skeleton';
import { Button } from '@/components/common/Button';
import { Library, Heart, Plus, Music } from 'lucide-react';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';
import { getSong } from '@/services/zingmp3';

// Sub-pages
export const MyPlaylistsPage = () => {
  const { user } = useAuthStore();
  const { openCreatePlaylist } = useModalStore();
  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists', user?.uid],
    queryFn: () => getUserPlaylists(user!.uid),
    enabled: !!user,
  });

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Playlist của tôi
        </h2>
        <Button onClick={openCreatePlaylist} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Tạo playlist mới
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : playlists && playlists.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <UserPlaylistCard key={playlist.playlistId} playlist={playlist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Chưa có playlist nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Tạo playlist đầu tiên để bắt đầu sưu tầm nhạc yêu thích
          </p>
          <Button onClick={openCreatePlaylist} className="flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />
            Tạo playlist mới
          </Button>
        </div>
      )}
    </div>
  );
};

export const MyFavoritesPage = () => {
  const { user } = useAuthStore();
  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites', user?.uid],
    queryFn: () => getFavorites(user!.uid),
    enabled: !!user,
  });

  const { data: songs, isLoading: songsLoading } = useQuery({
    queryKey: ['favorite-songs', favorites?.map((f) => f.songId)],
    queryFn: async () => {
      if (!favorites || favorites.length === 0) return [];
      const songPromises = favorites.map((fav) => getSong(fav.songId));
      const results = await Promise.allSettled(songPromises);
      // Filter out failed requests and return only successful ones
      const songs = results
        .filter((result) => result.status === 'fulfilled')
        .map((result: any) => result.value);
      console.log(`Loaded ${songs.length}/${favorites.length} favorite songs`);
      return songs;
    },
    enabled: !!favorites && favorites.length > 0,
    retry: 1,
  });

  const isLoading = favoritesLoading || songsLoading;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Yêu thích
      </h2>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : songs && songs.length > 0 ? (
        <div className="space-y-2">
          {songs.map((song, index) => (
            <SongCard key={song.encodeId} song={song} index={index} showIndex />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Chưa có bài hát yêu thích
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Nhấn vào nút trái tim ở bất kỳ bài hát nào để thêm vào danh sách yêu thích
          </p>
        </div>
      )}
    </div>
  );
};

export const MyMusicPage: React.FC = () => {
  const location = useLocation();
  const tabs = [
    { path: ROUTES.MY_MUSIC, label: 'Thư viện', icon: Library, component: MyPlaylistsPage },
    { path: ROUTES.MY_FAVORITES, label: 'Yêu thích', icon: Heart, component: MyFavoritesPage },
  ];

  const activeTab = tabs.find((tab) => location.pathname === tab.path) || tabs[0];
  const ActiveComponent = activeTab.component;

  return (
    <div className="px-2 md:px-8 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
        Thư viện của tôi
      </h1>
      {/* Tabs - scrollable on mobile */}
      <div className="border-b border-gray-700 mb-6 overflow-x-auto">
        <nav className="flex space-x-4 md:space-x-8 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  'flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-base transition-colors min-w-[120px] justify-center',
                  isActive
                    ? 'border-primary-600 text-primary-300 bg-gradient-to-r from-primary-600/10 to-accent-cyan/10'
                    : 'border-transparent text-gray-400 hover:text-primary-400 hover:border-primary-400'
                )}
                style={{ touchAction: 'manipulation' }}
              >
                <Icon className="w-6 h-6" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Content */}
      <div className="mt-4">
        <ActiveComponent />
      </div>
    </div>
  );
};
