import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChartHome } from '@/services/zingmp3';
import { SongCard } from '@/components/music/SongCard';
import { Skeleton } from '@/components/common/Skeleton';
import { usePlayerStore } from '@/store/usePlayerStore';
import { BarChart3 } from 'lucide-react';

export const ChartPage: React.FC = () => {
  const { setQueue, setCurrentIndex, setCurrentSong } = usePlayerStore();

  const { data: chart, isLoading } = useQuery({
    queryKey: ['chart'],
    queryFn: getChartHome,
  });

  const handlePlayAll = () => {
    if (chart?.RTChart?.items) {
      const songs = chart.RTChart.items.map((item) => ({
        encodeId: item.encodeId,
        title: item.title,
        alias: item.alias,
        artists: item.artists,
        artistNames: item.artists.map((a) => a.name).join(', '),
        thumbnail: item.thumbnail,
        thumbnailM: item.thumbnailM,
        duration: item.duration,
      }));
      setQueue(songs);
      setCurrentIndex(0);
      setCurrentSong(songs[0]);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Bảng xếp hạng
          </h1>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {chart?.RTChart?.items?.map((item, index) => {
              const song = {
                encodeId: item.encodeId,
                title: item.title,
                alias: item.alias,
                artists: item.artists,
                artistNames: item.artists.map((a) => a.name).join(', '),
                thumbnail: item.thumbnail,
                thumbnailM: item.thumbnailM,
                duration: item.duration,
              };
              return (
                <SongCard
                  key={item.encodeId}
                  song={song}
                  index={index}
                  showIndex
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
