import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSong, getLyric } from '@/services/zingmp3';
import { Skeleton } from '@/components/common/Skeleton';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useModalStore } from '@/store/useModalStore';
import { Play, Pause, Heart, ListPlus, ArrowLeft, Music } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

export const SongDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentSong, isPlaying, currentTime, setCurrentSong, setQueue, play, pause } = usePlayerStore();
  const { openAddToPlaylist } = useModalStore();
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch song data
  const { data: song, isLoading: songLoading } = useQuery({
    queryKey: ['song', id],
    queryFn: () => getSong(id!),
    enabled: !!id,
  });

  // Fetch lyrics
  const { data: lyrics, isLoading: lyricsLoading } = useQuery({
    queryKey: ['lyrics', id],
    queryFn: () => getLyric(id!),
    enabled: !!id,
  });

  const { data: isFavorite } = useIsFavorite(id || '');
  const { mutate: toggleFavorite } = useToggleFavorite();
  const isCurrentSong = currentSong?.encodeId === id;

  // Tính toán câu lyrics nào đang active dựa trên currentTime
  const getActiveSentenceIndex = () => {
    if (!lyrics?.sentences || !isCurrentSong || !isPlaying) return -1;

    const currentTimeMs = currentTime * 1000; // Convert to milliseconds

    for (let i = 0; i < lyrics.sentences.length; i++) {
      const sentence = lyrics.sentences[i];
      if (!sentence.words || sentence.words.length === 0) continue;

      const startTime = sentence.words[0].startTime;
      const endTime = sentence.words[sentence.words.length - 1].endTime;

      if (currentTimeMs >= startTime && currentTimeMs <= endTime) {
        return i;
      }
    }

    return -1;
  };

  const activeSentenceIndex = getActiveSentenceIndex();

  // Auto-scroll đến câu đang active
  useEffect(() => {
    if (activeSentenceIndex >= 0 && lyricsContainerRef.current) {
      const activeElement = lyricsContainerRef.current.querySelector(`[data-sentence-index="${activeSentenceIndex}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [activeSentenceIndex]);

  // Tự động chuyển trang khi bài hát thay đổi
  useEffect(() => {
    if (currentSong && currentSong.encodeId !== id) {
      navigate(`/song/${currentSong.encodeId}`, { replace: true });
    }
  }, [currentSong, id, navigate]);

  const handlePlayPause = () => {
    if (!song) return;

    if (isCurrentSong) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      // Khi phát bài hát mới, cần set queue và currentSong
      setQueue([song]);
      setCurrentSong(song);
      play();
    }
  };

  const handleAddToPlaylist = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào playlist');
      return;
    }
    if (!song) return;
    openAddToPlaylist(song);
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }
    if (!id) return;
    toggleFavorite({ songId: id, isFav: isFavorite || false });
  };

  if (songLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 mb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto pt-8">
          <Skeleton className="h-10 w-32 mb-8 bg-gray-800" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <Skeleton className="aspect-square w-full rounded-full bg-gray-800" />
              <div className="space-y-4 pt-4">
                <Skeleton className="h-8 w-3/4 mx-auto bg-gray-800" />
                <Skeleton className="h-6 w-1/2 mx-auto bg-gray-800" />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-4 pt-12">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full bg-gray-800 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Music className="w-24 h-24 text-gray-700 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy bài hát</h3>
          <p className="text-gray-400 mb-8">Bài hát bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button onClick={() => navigate(ROUTES.HOME)} className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-full">
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white pb-20 pt-8">
      {/* Dynamic Background Blur */}
      {/* Layer 1: Image Blur */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 ease-in-out opacity-60 blur-[100px] scale-110"
        style={{ backgroundImage: `url(${song.thumbnailM || song.thumbnail})` }}
      />

      {/* Layer 2: Black Overlay for readability */}
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-3xl" />

      {/* Layer 3: Gradient fade from bottom */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-8 xl:px-12 flex flex-col h-full">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 backdrop-blur-md transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium text-gray-300 group-hover:text-white">Quay lại</span>
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start pb-12">

          {/* LEFT COLUMN: Disk Art, Info & Controls */}
          {/* Sticky position on desktop to keep it viewable while scrolling lyrics */}
          <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24 max-w-lg mx-auto lg:mx-0 w-full transition-all duration-500">

            {/* Vinyl Disk Animation Container - RESIZED */}
            <div className="relative group w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 aspect-square mb-8 perspective-[1000px] mx-auto">
              {/* Rotating Disk */}
              <div className={cn(
                "relative w-full h-full rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.6)] border-[4px] border-white/5 bg-gray-900 transition-all duration-700",
                isPlaying ? "animate-[spin_10s_linear_infinite]" : "transform-none shadow-xl"
              )}>
                {/* Album Art */}
                <img
                  src={song.thumbnailM || song.thumbnail}
                  alt={song.title}
                  className="w-full h-full object-cover rounded-full opacity-90"
                />

                {/* Vinyl Texture Overlay (Optional subtle radial gradient) */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/0 via-white/5 to-black/0 pointer-events-none" />

                {/* Center Hole */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-gray-900 rounded-full border-2 border-white/20 z-20" />
                {/* Center Label Area */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-black/60 backdrop-blur-md rounded-full border border-white/10 z-10 flex items-center justify-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/5 opacity-50" />
                </div>
              </div>

              {/* Glow effect behind disk */}
              <div className={cn(
                "absolute -inset-4 bg-primary-500/20 rounded-full blur-2xl -z-10 transition-opacity duration-1000",
                isPlaying ? "opacity-30 animate-pulse" : "opacity-0"
              )} />
            </div>

            {/* Song Details - RESIZED */}
            <div className="text-center w-full space-y-2 px-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70 leading-tight tracking-tight drop-shadow-sm line-clamp-2">
                {song.title}
              </h1>

              <div className="flex items-center justify-center gap-2 text-lg text-white/60 font-medium pt-1">
                <span className="line-clamp-1">{song.artistNames}</span>
              </div>

              {/* Duration Badge */}
              {song.duration > 0 && (
                <div className="pt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-white/40 tracking-wider">
                    {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={handleToggleFavorite}
                className={cn(
                  "p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 group",
                  isFavorite && "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                )}
                title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              >
                <Heart className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  isFavorite ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-gray-300 group-hover:text-red-400"
                )} />
              </button>

              <button
                onClick={handlePlayPause}
                className="relative p-0 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 group"
              >
                {/* Button Glow */}
                <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />

                <div className="relative w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)] border-4 border-transparent bg-clip-padding">
                  {isCurrentSong && isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current translate-x-1" />
                  )}
                </div>
              </button>

              <button
                onClick={handleAddToPlaylist}
                className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 group"
                title="Thêm vào playlist"
              >
                <ListPlus className="w-6 h-6 text-gray-300 group-hover:text-primary-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Lyrics with enhanced visibility */}
          <div className="lg:col-span-7 flex flex-col h-[500px] lg:h-[calc(100vh-160px)] w-full">
            <div className="flex items-center gap-4 mb-6 md:mb-8 border-b border-white/5 pb-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                Lời bài hát
              </h2>
            </div>

            <div
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto scroll-smooth pr-2 md:pr-6 mask-image-gradient no-scrollbar w-full"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 80%, transparent)'
              }}
            >
              {lyricsLoading ? (
                <div className="flex flex-col gap-6 pt-20">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 md:h-10 w-[80%] mx-auto bg-white/5 rounded-xl" />
                  ))}
                </div>
              ) : lyrics && lyrics.sentences ? (
                <div className="flex flex-col gap-8 py-20 text-center w-full">
                  {lyrics.sentences.map((sentence: any, index: number) => {
                    const isActive = index === activeSentenceIndex;
                    const isPast = index < activeSentenceIndex;

                    return (
                      <div
                        key={index}
                        data-sentence-index={index}
                        className={cn(
                          "transition-all duration-700 ease-out py-3 md:py-4 px-4 rounded-xl md:rounded-2xl cursor-default border border-transparent mx-auto  w-full max-w-3xl",
                          isActive
                            ? "bg-white/5 backdrop-blur-md border-white/5 shadow-xl scale-105 my-2"
                            : isPast
                              ? "opacity-30 blur-[0.5px] scale-95"
                              : "opacity-40 scale-100 hover:opacity-60"
                        )}
                      >
                        <p className={cn(
                          "text-xl md:text-2xl lg:text-3xl font-bold transition-all duration-500 leading-normal",
                          isActive
                            ? "text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.4)]"
                            : "text-white"
                        )}>
                          {sentence.words.map((word: any) => word.data).join(' ')}
                        </p>
                      </div>
                    );
                  })}

                  {/* Footer for Lyrics */}
                  <div className="h-40 flex items-center justify-center opacity-30 mt-10">
                    <Music className="w-8 h-8 animate-bounce" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-4">
                  <div className="p-6 rounded-full bg-white/5">
                    <Music className="w-12 h-12" />
                  </div>
                  <p className="text-xl font-medium">Lời bài hát đang được cập nhật</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles for this page */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
