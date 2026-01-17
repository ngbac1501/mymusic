import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserPlaylists, getFavorites } from '@/services/firestore';
import { useAuthStore } from '@/store/useAuthStore';
import { useModalStore } from '@/store/useModalStore';
import { SongCard } from '@/components/music/SongCard';
import { UserPlaylistCard } from '@/components/music/UserPlaylistCard';
import { Skeleton } from '@/components/common/Skeleton';
import { Library, Heart, Plus, Music } from 'lucide-react';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';
import { getSong } from '@/services/zingmp3';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
        <h2 className="text-3xl font-display font-bold gradient-text-vibrant">
          Playlist của tôi
        </h2>
        <Button
          onClick={openCreatePlaylist}
          variant="primary"
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Tạo playlist
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      ) : playlists && playlists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <UserPlaylistCard key={playlist.playlistId} playlist={playlist} />
          ))}
        </div>
      ) : (
        <Card variant="glass" padding="lg" className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-vibrant/20 flex items-center justify-center">
            <Music className="w-10 h-10 text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-100 mb-2">
            Chưa có playlist nào
          </h3>
          <p className="text-gray-400 mb-6">
            Tạo playlist đầu tiên để bắt đầu sưu tầm nhạc yêu thích
          </p>
          <Button
            onClick={openCreatePlaylist}
            variant="primary"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Tạo playlist mới
          </Button>
        </Card>
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
      <h2 className="text-3xl font-display font-bold gradient-text-pink mb-6">
        Bài hát yêu thích
      </h2>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : songs && songs.length > 0 ? (
        <Card variant="glass" padding="md" className="space-y-2">
          {songs.map((song, index) => (
            <SongCard key={song.encodeId} song={song} index={index} showIndex />
          ))}
        </Card>
      ) : (
        <Card variant="glass" padding="lg" className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-sunset/20 flex items-center justify-center">
            <Heart className="w-10 h-10 text-accent-pink" />
          </div>
          <h3 className="text-xl font-bold text-gray-100 mb-2">
            Chưa có bài hát yêu thích
          </h3>
          <p className="text-gray-400">
            Nhấn vào nút trái tim ở bất kỳ bài hát nào để thêm vào danh sách yêu thích
          </p>
        </Card>
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
    <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text-vibrant mb-8">
        Thư viện của tôi
      </h1>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex gap-2 p-1 bg-dark-800 rounded-xl inline-flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        <ActiveComponent />
      </div>
    </div>
  );
};
