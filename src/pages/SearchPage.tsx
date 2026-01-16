import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { search } from '@/services/zingmp3';
import { saveSearchQuery } from '@/services/firestore';
import { SongCard } from '@/components/music/SongCard';
import { PlaylistCard } from '@/components/music/PlaylistCard';
import { Skeleton } from '@/components/common/Skeleton';
import { SearchHistoryList } from '@/components/search/SearchHistoryList';
import { Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [query, setQuery] = useState((location.state as any)?.query || '');

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const results = await search(query);
      // Save to search history if user is logged in
      if (user && query.trim()) {
        saveSearchQuery(user.uid, query.trim()).catch(console.error);
      }
      return results;
    },
    enabled: query.length > 0,
  });

  const handleSelectHistory = (historyQuery: string) => {
    setQuery(historyQuery);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Tìm kiếm
        </h1>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm bài hát, ca sĩ, album..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Search History or Empty State */}
        {!query && (
          <>
            {user && <SearchHistoryList onSelectQuery={handleSelectHistory} />}
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Nhập từ khóa để tìm kiếm
              </p>
            </div>
          </>
        )}

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}

        {searchResults && query && (
          <div className="space-y-8">
            {/* Songs */}
            {searchResults.songs && searchResults.songs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Bài hát
                </h2>
                <div className="space-y-2">
                  {searchResults.songs.map((song, index) => (
                    <SongCard key={song.encodeId} song={song} index={index} showIndex />
                  ))}
                </div>
              </section>
            )}

            {/* Playlists */}
            {searchResults.playlists && searchResults.playlists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Playlist
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {searchResults.playlists.map((playlist) => (
                    <PlaylistCard key={playlist.encodeId} playlist={playlist} />
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {searchResults.artists && searchResults.artists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Ca sĩ
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {searchResults.artists.map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => navigate(`/artist/${artist.alias}`)}
                      className="group cursor-pointer text-center"
                    >
                      <div className="relative w-full aspect-square rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-3 group-hover:scale-105 transition-transform">
                        <img
                          src={artist.thumbnailM || artist.thumbnail}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {artist.name}
                      </h3>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {searchResults.songs?.length === 0 &&
              searchResults.playlists?.length === 0 &&
              searchResults.artists?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    Không tìm thấy kết quả nào
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
