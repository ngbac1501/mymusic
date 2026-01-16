import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPlaylist } from '@/services/zingmp3';
import { SongCard } from '@/components/music/SongCard';
import { Skeleton } from '@/components/common/Skeleton';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Play } from 'lucide-react';
import { Button } from '@/components/common/Button';
import type { Playlist } from '@/types';

export const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setQueue, setCurrentIndex, setCurrentSong } = usePlayerStore();

  const { data: playlist, isLoading } = useQuery<Playlist>({
    queryKey: ['playlist', id],
    queryFn: () => getPlaylist(id!),
    enabled: !!id,
  });

  const handlePlayAll = () => {
    if (playlist?.song?.items && playlist.song.items.length > 0) {
      setQueue(playlist.song.items);
      setCurrentIndex(0);
      setCurrentSong(playlist.song.items[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy playlist</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-64 h-64 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            <img
              src={playlist.thumbnailM || playlist.thumbnail}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {playlist.title}
            </h1>
            {playlist.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {playlist.description}
              </p>
            )}
            <div className="flex items-center gap-3">
              <Button onClick={handlePlayAll} className="flex items-center gap-2">
                <Play className="w-5 h-5 fill-current" />
                Phát tất cả
              </Button>
              {playlist.song && (
                <span className="text-gray-500 dark:text-gray-400">
                  {playlist.song.total} bài hát
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Songs */}
        {playlist.song && playlist.song.items && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Danh sách bài hát
            </h2>
            <div className="space-y-2">
              {playlist.song.items.map((song, index) => (
                <SongCard key={song.encodeId} song={song} index={index} showIndex />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
