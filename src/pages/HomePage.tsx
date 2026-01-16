import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrendingSongs, getRecommendations, getNewReleases } from '@/services/zingmp3';
import { SongCard } from '@/components/music/SongCard';
import { Skeleton } from '@/components/common/Skeleton';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Music, TrendingUp, Sparkles } from 'lucide-react';

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

  return (
    <div className="px-2 md:px-8 py-6 space-y-12 max-w-screen-2xl mx-auto">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 via-accent-cyan to-accent-pink flex items-center justify-center shadow-2xl">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-primary-300 via-accent-cyan to-accent-pink bg-clip-text text-transparent drop-shadow-xl">
            Chào mừng đến với My Music
          </h1>
          <p className="text-lg md:text-2xl opacity-90 font-medium mb-4">Khám phá hàng triệu bài hát và playlist</p>
          <button
            onClick={() => {
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
            }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-accent-cyan text-white font-bold shadow-lg hover:scale-105 transition-all">
            Bắt đầu nghe ngay
          </button>
        </div>
      </div>

      {/* Trending Songs */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-7 h-7 text-primary-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100 bg-gradient-to-r from-primary-400 to-accent-cyan bg-clip-text text-transparent">
            Bài hát đang thịnh hành
          </h2>
        </div>
        <div className="space-y-3">
          {trendingLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
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
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-accent-cyan" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 bg-gradient-to-r from-accent-cyan to-accent-pink bg-clip-text text-transparent">
              Đề xuất cho bạn
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {recommendationsLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))
          ) : (
            recommendations?.slice(0, 10).map((song) => (
              <div
                key={song.encodeId}
                className="group cursor-pointer"
                onClick={() => {
                  const { setQueue, setCurrentIndex, setCurrentSong, play } = usePlayerStore.getState();
                  setQueue([song]);
                  setCurrentIndex(0);
                  setCurrentSong(song);
                  play();
                }}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
                  <img
                    src={song.thumbnailM || song.thumbnail}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <button className="p-3 bg-gradient-to-r from-primary-600 to-accent-cyan text-white rounded-full shadow-lg hover:scale-110 transition-all">
                      <Music className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-100 truncate mt-2 group-hover:text-primary-300 transition-colors">
                  {song.title}
                </h3>
                <p className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors">
                  {song.artistNames}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* New Releases */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Music className="w-7 h-7 text-accent-pink" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100 bg-gradient-to-r from-accent-pink to-primary-400 bg-clip-text text-transparent">
            Mới phát hành
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {newReleasesLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))
          ) : (
            newReleases?.slice(0, 10).map((song) => (
              <div
                key={song.encodeId}
                className="group cursor-pointer"
                onClick={() => {
                  const { setQueue, setCurrentIndex, setCurrentSong, play } = usePlayerStore.getState();
                  setQueue([song]);
                  setCurrentIndex(0);
                  setCurrentSong(song);
                  play();
                }}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 group-hover:ring-accent-pink/50 transition-all duration-300">
                  <img
                    src={song.thumbnailM || song.thumbnail}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <button className="p-3 bg-gradient-to-r from-accent-pink to-primary-400 text-white rounded-full shadow-lg hover:scale-110 transition-all">
                      <Music className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-100 truncate mt-2 group-hover:text-accent-pink transition-colors">
                  {song.title}
                </h3>
                <p className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors">
                  {song.artistNames}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
