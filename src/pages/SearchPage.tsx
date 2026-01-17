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
import { Search as SearchIcon, Music2, Users, Disc } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';

export const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [query, setQuery] = useState((location.state as any)?.query || '');
  const [activeTab, setActiveTab] = useState('all');

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const results = await search(query);
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

  const totalResults = (searchResults?.songs?.length || 0) +
    (searchResults?.playlists?.length || 0) +
    (searchResults?.artists?.length || 0);

  return (
    <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-display font-bold gradient-text-vibrant mb-8">
        Tìm kiếm
      </h1>

      {/* Search Input */}
      <Card variant="glass" padding="none" className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm bài hát, ca sĩ, album, playlist..."
            className="w-full pl-14 pr-4 py-4 bg-transparent border-none focus:outline-none text-gray-100 placeholder-gray-500 text-lg"
            autoFocus
          />
        </div>
      </Card>

      {/* Search History or Empty State */}
      {!query && (
        <>
          {user && <SearchHistoryList onSelectQuery={handleSelectHistory} />}
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-vibrant/20 flex items-center justify-center">
              <SearchIcon className="w-12 h-12 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              Bắt đầu tìm kiếm
            </h2>
            <p className="text-gray-400">
              Nhập từ khóa để khám phá bài hát, ca sĩ, album yêu thích
            </p>
          </div>
        </>
      )}

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {searchResults && query && (
        <div>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              Tìm thấy <span className="text-primary-400 font-semibold">{totalResults}</span> kết quả
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList variant="pills" className="mb-8">
              <TabsTrigger value="all" variant="pills">Tất cả</TabsTrigger>
              <TabsTrigger value="songs" variant="pills">
                <Music2 className="w-4 h-4 mr-2" />
                Bài hát
              </TabsTrigger>
              <TabsTrigger value="playlists" variant="pills">
                <Disc className="w-4 h-4 mr-2" />
                Playlist
              </TabsTrigger>
              <TabsTrigger value="artists" variant="pills">
                <Users className="w-4 h-4 mr-2" />
                Ca sĩ
              </TabsTrigger>
            </TabsList>

            {/* All Tab */}
            <TabsContent value="all">
              <div className="space-y-10">
                {/* Songs */}
                {searchResults.songs && searchResults.songs.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                      <Music2 className="w-6 h-6 text-primary-400" />
                      Bài hát
                    </h2>
                    <Card variant="glass" padding="md" className="space-y-2">
                      {searchResults.songs.slice(0, 5).map((song, index) => (
                        <SongCard key={song.encodeId} song={song} index={index} showIndex />
                      ))}
                    </Card>
                  </section>
                )}

                {/* Playlists */}
                {searchResults.playlists && searchResults.playlists.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                      <Disc className="w-6 h-6 text-accent-cyan" />
                      Playlist
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {searchResults.playlists.slice(0, 5).map((playlist) => (
                        <PlaylistCard key={playlist.encodeId} playlist={playlist} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Artists */}
                {searchResults.artists && searchResults.artists.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                      <Users className="w-6 h-6 text-accent-pink" />
                      Ca sĩ
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {searchResults.artists.slice(0, 5).map((artist) => (
                        <div
                          key={artist.id}
                          onClick={() => navigate(`/artist/${artist.alias}`)}
                          className="group cursor-pointer text-center"
                        >
                          <Card variant="elevated" padding="none" hover className="overflow-hidden">
                            <div className="relative w-full aspect-square rounded-full overflow-hidden m-4">
                              <img
                                src={artist.thumbnailM || artist.thumbnail}
                                alt={artist.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                            <div className="px-4 pb-4">
                              <h3 className="font-semibold text-gray-100 truncate group-hover:text-primary-300 transition-colors">
                                {artist.name}
                              </h3>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </TabsContent>

            {/* Songs Tab */}
            <TabsContent value="songs">
              {searchResults.songs && searchResults.songs.length > 0 ? (
                <Card variant="glass" padding="md" className="space-y-2">
                  {searchResults.songs.map((song, index) => (
                    <SongCard key={song.encodeId} song={song} index={index} showIndex />
                  ))}
                </Card>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">Không tìm thấy bài hát nào</p>
                </div>
              )}
            </TabsContent>

            {/* Playlists Tab */}
            <TabsContent value="playlists">
              {searchResults.playlists && searchResults.playlists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.playlists.map((playlist) => (
                    <PlaylistCard key={playlist.encodeId} playlist={playlist} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">Không tìm thấy playlist nào</p>
                </div>
              )}
            </TabsContent>

            {/* Artists Tab */}
            <TabsContent value="artists">
              {searchResults.artists && searchResults.artists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.artists.map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => navigate(`/artist/${artist.alias}`)}
                      className="group cursor-pointer text-center"
                    >
                      <Card variant="elevated" padding="none" hover className="overflow-hidden">
                        <div className="relative w-full aspect-square rounded-full overflow-hidden m-4">
                          <img
                            src={artist.thumbnailM || artist.thumbnail}
                            alt={artist.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="px-4 pb-4">
                          <h3 className="font-semibold text-gray-100 truncate group-hover:text-primary-300 transition-colors">
                            {artist.name}
                          </h3>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">Không tìm thấy ca sĩ nào</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {totalResults === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gray-800/50 flex items-center justify-center">
                <SearchIcon className="w-12 h-12 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">
                Không tìm thấy kết quả
              </h2>
              <p className="text-gray-400">
                Thử tìm kiếm với từ khóa khác
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
