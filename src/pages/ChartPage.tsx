import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChartHome } from '@/services/zingmp3';
import { SongCard } from '@/components/music/SongCard';
import { Skeleton } from '@/components/common/Skeleton';
import { usePlayerStore } from '@/store/usePlayerStore';
import { BarChart3, Play, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const ChartPage: React.FC = () => {
  const { setQueue, setCurrentIndex, setCurrentSong, play } = usePlayerStore();

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
      play();
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-accent-pink">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-display font-bold gradient-text-vibrant">
              Bảng xếp hạng
            </h1>
            <p className="text-gray-400 mt-1">
              Top 100 bài hát được nghe nhiều nhất
            </p>
          </div>
          {chart?.RTChart?.items && (
            <Button
              onClick={handlePlayAll}
              variant="primary"
              size="lg"
              leftIcon={<Play className="w-5 h-5" fill="currentColor" />}
              className="hidden md:flex"
            >
              Phát tất cả
            </Button>
          )}
        </div>

        {/* Mobile Play All */}
        {chart?.RTChart?.items && (
          <Button
            onClick={handlePlayAll}
            variant="primary"
            size="lg"
            leftIcon={<Play className="w-5 h-5" fill="currentColor" />}
            className="w-full md:hidden"
          >
            Phát tất cả
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <Card variant="glass" padding="md" className="space-y-2">
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

            // Top 3 get special badges
            const isTop3 = index < 3;
            const badgeColors = ['primary', 'warning', 'error'] as const;

            return (
              <div key={item.encodeId} className="relative">
                {isTop3 && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10">
                    <Badge variant={badgeColors[index]} size="sm" className="font-bold">
                      #{index + 1}
                    </Badge>
                  </div>
                )}
                <SongCard
                  song={song}
                  index={index}
                  showIndex={!isTop3}
                />
              </div>
            );
          })}</Card>
      )}
    </div>
  );
};
