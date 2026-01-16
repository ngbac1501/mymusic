import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getArtist } from '@/services/zingmp3';
import { usePlayerStore } from '@/store/usePlayerStore';
import { SongCard } from '@/components/music/SongCard';
import { Skeleton } from '@/components/common/Skeleton';
import { Button } from '@/components/common/Button';
import { Play, ArrowLeft, Music } from 'lucide-react';
import { ROUTES } from '@/constants';
import toast from 'react-hot-toast';

export const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setQueue, setCurrentIndex, play } = usePlayerStore();

  // Fetch artist data (includes songs in response)
  const { data: artist, isLoading } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => getArtist(id!),
    enabled: !!id,
  });

  const handlePlayAll = () => {
    if (!artist?.songs || artist.songs.length === 0) {
      toast.error('Không có bài hát để phát');
      return;
    }

    setQueue(artist.songs);
    setCurrentIndex(0);
    play();
    toast.success('Đang phát tất cả bài hát');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto text-center py-16">
          <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Không tìm thấy ca sĩ
          </h3>
          <Button onClick={() => navigate(ROUTES.SEARCH)}>
            Quay lại tìm kiếm
          </Button>
        </div>
      </div>
    );
  }

  const songs = artist.songs || [];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Artist Header */}
        <div className="bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg p-8 mb-6">
          <div className="flex items-end gap-6">
            {/* Avatar */}
            <div className="w-48 h-48 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
              {artist.thumbnailM || artist.thumbnail ? (
                <img
                  src={artist.thumbnailM || artist.thumbnail}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-24 h-24 text-white/50" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-white">
              <p className="text-sm font-medium mb-2 opacity-90">CA SĨ</p>
              <h1 className="text-4xl font-bold mb-4">{artist.name}</h1>
              {songs.length > 0 && (
                <p className="text-white/80 mb-4">
                  {songs.length} bài hát
                </p>
              )}
            </div>
          </div>

          {/* Play All Button */}
          {songs.length > 0 && (
            <div className="mt-6">
              <Button
                onClick={handlePlayAll}
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                Phát tất cả
              </Button>
            </div>
          )}
        </div>

        {/* Songs List */}
        {songs.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Bài hát nổi bật
            </h2>
            <div className="space-y-2">
              {songs.map((song: any, index: number) => (
                <SongCard key={song.encodeId} song={song} index={index} showIndex />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Chưa có bài hát
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Ca sĩ này chưa có bài hát nào
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
