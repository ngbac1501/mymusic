import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTop100 } from '@/services/zingmp3';
import { PlaylistCard } from '@/components/music/PlaylistCard';
import { Skeleton } from '@/components/common/Skeleton';
import { Music } from 'lucide-react';

export const Top100Page: React.FC = () => {
  const { data: top100, isLoading } = useQuery({
    queryKey: ['top100'],
    queryFn: getTop100,
  });

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Music className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Top 100
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {top100?.map((playlist, index) => (
              <PlaylistCard key={`${playlist.encodeId}-${index}`} playlist={playlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
