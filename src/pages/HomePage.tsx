import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrendingSongs, getRecommendations, getNewReleases } from '@/services/zingmp3';
import { SongCard } from '@/components/music/SongCard';
import { Skeleton } from '@/components/common/Skeleton';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Music, TrendingUp, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const HomePage: React.FC = () => {


  // Fetch trending songs
  const { data: trendingSongs, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: getTrendingSongs,
  });

  // Fetch recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations(),
  });

  // Fetch new releases
  const { data: newReleases, isLoading: newReleasesLoading } = useQuery({
    queryKey: ['newReleases'],
    queryFn: getNewReleases,
  });

  const handlePlayRandom = () => {
    const allSongs = [
      ...(trendingSongs || []).map((s: any) => ({ ...s, artistNames: s.artistNames || s.artists?.map((a: any) => a.name).join(', ') || '' })),
      ...(recommendations || []),
      ...(newReleases || [])
    ];
    if (allSongs.length > 0) {
      const randomSong = allSongs[Math.floor(Math.random() * allSongs.length)];
      const { setQueue, setCurrentIndex, setCurrentSong, play } = usePlayerStore.getState();
      setQueue([randomSong]);
      setCurrentIndex(0);
      setCurrentSong(randomSong);
      play();
    }
  };

  const handlePlaySong = (song: any) => {
    const { setQueue, setCurrentIndex, setCurrentSong, play } = usePlayerStore.getState();
    setQueue([song]);
    setCurrentIndex(0);
    setCurrentSong(song);
    play();
  };

  return (
    <div className="px-4 md:px-8 py-6 space-y-12 max-w-screen-2xl mx-auto">
      {/* Hero Section - Enhanced */}
      <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-vibrant opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="mb-6 animate-float">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl">
              <Music className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-4 text-white text-shadow-lg">
            Chào mừng đến với My Music
          </h1>
          <p className="text-lg md:text-2xl text-white/90 font-medium mb-8 max-w-2xl">
            Khám phá hàng triệu bài hát và playlist yêu thích của bạn
          </p>
          <Button
            onClick={handlePlayRandom}
            variant="primary"
            size="lg"
            leftIcon={<Play className="w-5 h-5" fill="currentColor" />}
            className="shadow-2xl hover:scale-105"
          >
            Bắt đầu nghe ngay
          </Button>
        </div>
      </div>

      {/* Trending Songs */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-pink">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text-vibrant">
            Bài hát đang thịnh hành
          </h2>
        </div>
        <Card variant="glass" padding="md" className="space-y-2">
          {trendingLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))
          ) : (
            trendingSongs?.slice(0, 10).map((song, index) => (
              <SongCard
                key={song.encodeId}
                song={{
                  ...song,
                  artistNames: (song as any).artistNames ?? (song.artists?.map((a: any) => a.name).join(', ') ?? ''),
                }}
                index={index}
                showIndex
              />
            ))
          )}
        </Card>
      </section>

      {/* Recommendations */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text-cyan">
            Đề xuất cho bạn
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {recommendationsLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))
          ) : (
            recommendations?.slice(0, 12).map((song) => (
              <div
                key={song.encodeId}
                className="group cursor-pointer"
                onClick={() => handlePlaySong(song)}
              >
                <Card variant="elevated" padding="none" hover className="overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={song.thumbnailM || song.thumbnail}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-4 bg-gradient-to-r from-primary-600 to-accent-cyan text-white rounded-full shadow-glow transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-100 truncate group-hover:text-primary-300 transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors">
                      {song.artistNames}
                    </p>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </section>

      {/* New Releases */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-accent-pink to-accent-rose">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text-pink">
            Mới phát hành
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {newReleasesLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))
          ) : (
            newReleases?.slice(0, 12).map((song) => (
              <div
                key={song.encodeId}
                className="group cursor-pointer"
                onClick={() => handlePlaySong(song)}
              >
                <Card variant="elevated" padding="none" hover className="overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={song.thumbnailM || song.thumbnail}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-4 bg-gradient-to-r from-accent-pink to-accent-rose text-white rounded-full shadow-glow-pink transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-100 truncate group-hover:text-accent-pink transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors">
                      {song.artistNames}
                    </p>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
