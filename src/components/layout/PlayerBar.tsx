import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { formatTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import { useNavigate } from 'react-router-dom';
import { getLyric } from '@/services/zingmp3';

export const PlayerBar: React.FC = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [lyrics, setLyrics] = useState<any>(null);
  const {
    currentSong,
    isPlaying,
    isShuffled,
    repeatMode,
    volume,
    currentTime,
    duration,
    togglePlay,
    next,
    previous,
    setShuffle,
    setRepeat,
    setVolume,
    setCurrentSong,
  } = usePlayerStore();
  // Fetch lyrics when expanded and currentSong changes
  useEffect(() => {
    const fetchLyrics = async () => {
      if (isExpanded && currentSong && !lyrics && currentSong.encodeId) {
        try {
          const lyricData = await getLyric(currentSong.encodeId);
          setLyrics(lyricData);
          // Optionally update currentSong.lyrics in store
          setCurrentSong({ ...currentSong, lyrics: lyricData });
        } catch (err) {
          setLyrics(null);
        }
      }
      if (!isExpanded) {
        setLyrics(null);
      }
    };
    fetchLyrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, currentSong]);

  const { togglePlayPause, seek } = useAudioPlayer();

  const handlePlayPause = () => {
    togglePlayPause();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
  };

  const toggleShuffle = () => {
    setShuffle(!isShuffled);
  };

  const toggleRepeat = () => {
    if (repeatMode === 'none') {
      setRepeat('all');
    } else if (repeatMode === 'all') {
      setRepeat('one');
    } else {
      setRepeat('none');
    }
  };

  const handleSongClick = () => {
    if (currentSong) {
      navigate(`/song/${currentSong.encodeId}`);
    }
  };

  if (!currentSong) {
    return null;
  }

  const progressPercent = (currentTime / duration) * 100 || 0;

  return (
    <>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 18s linear infinite; }
      `}</style>
      {/* Collapsed Player Bar - Bottom */}
      <div className={cn(
        "h-24 md:h-20 bg-gradient-to-t from-dark-900 to-dark-800 border-t border-primary-900/20 backdrop-blur-xl px-2 md:px-6 flex flex-col md:flex-row items-center gap-2 md:gap-4 fixed bottom-0 left-0 right-0 z-40 transition-all duration-300",
        isExpanded && "hidden"
      )}>
        <div className="flex w-full items-center gap-2">
          {/* Song Info */}
          <div
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
            onClick={() => setIsExpanded(true)}
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all">
              <img
                src={currentSong.thumbnailM || currentSong.thumbnail}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-100 truncate group-hover:text-primary-300 transition-colors text-sm">
                {currentSong.title}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {currentSong.artistNames}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <span className="text-xs text-gray-400 w-8">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500"
            />
            <span className="text-xs text-gray-400 w-8 text-right">{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={() => setIsExpanded(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-100"
            >
              <span className="text-xs font-bold">⬆</span>
            </button>
          </div>
        </div>
        {/* Volume control always visible on mobile */}
        <div className="flex md:hidden w-full items-center justify-end gap-2 mt-2">
          <VolumeX className="w-5 h-5 text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500"
          />
          <Volume2 className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Expanded Player - Full Screen */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Overlay dark background for clarity */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 opacity-95" />
          {/* Extra blur and dark layer */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
          <div className="relative flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <h3 className="text-gray-400 text-sm font-semibold">ĐANG PHÁT</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Album Art - Center */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-cyan opacity-30 blur-2xl rounded-full"></div>
              {/* Album - spinning effect */}
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl flex items-center justify-center">
                <img
                  src={currentSong.thumbnailM || currentSong.thumbnail}
                  alt={currentSong.title}
                  className={cn(
                    "w-full h-full object-cover rounded-full",
                    isPlaying ? "animate-spin-slow" : ""
                  )}
                  style={{ transition: 'filter 0.3s' }}
                />
                {/* Center circle for disc */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full border-4 border-white/40 shadow-inner" />
              </div>
            </div>
          </div>

          {/* Song Info & Lyrics */}
          <div className="px-4 md:px-8 py-8 text-center flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {currentSong.title}
            </h1>
            <p className="text-lg text-gray-400 mb-6">
              {currentSong.artistNames}
            </p>

            {/* Lyrics Display - sentences style */}
            {lyrics && lyrics.sentences && (
              <div className="mb-8 flex flex-col items-center justify-center min-h-[56px] md:min-h-[72px]">
                {(() => {
                  const currentTimeMs = currentTime * 1000;
                  const activeIdx = lyrics.sentences.findIndex((sentence: any) => {
                    if (!sentence.words || sentence.words.length === 0) return false;
                    const startTime = sentence.words[0].startTime;
                    const endTime = sentence.words[sentence.words.length - 1].endTime;
                    return currentTimeMs >= startTime && currentTimeMs <= endTime;
                  });
                  if (activeIdx === -1) return null;
                  const sentence = lyrics.sentences[activeIdx];
                  return (
                    <div
                      key={activeIdx}
                      className="transition-all duration-700 ease-out py-2 px-4 rounded-xl cursor-default border border-transparent mx-auto w-full max-w-2xl text-center bg-white/10 backdrop-blur-md border-white/10 shadow-xl scale-105 my-2"
                    >
                      <span className="text-base md:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.4)] transition-all duration-500 leading-normal">
                        {sentence.words.map((word: any) => word.data).join(' ')}
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={toggleShuffle}
                className={cn(
                  "p-3 rounded-full transition-all",
                  isShuffled
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-500/50"
                    : "hover:bg-white/10 text-gray-400"
                )}
              >
                <Shuffle className="w-6 h-6" />
              </button>

              <button
                onClick={previous}
                className="p-3 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-4 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-xl hover:shadow-primary-500/50 transition-all transform hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>

              <button
                onClick={next}
                className="p-3 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={toggleRepeat}
                className={cn(
                  "p-3 rounded-full transition-all relative",
                  repeatMode !== 'none'
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-500/50"
                    : "hover:bg-white/10 text-gray-400"
                )}
              >
                <Repeat className="w-6 h-6" />
                {repeatMode === 'one' && (
                  <span className="absolute bottom-1 right-1 w-2 h-2 bg-white rounded-full"></span>
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-center gap-4">
              <VolumeX className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-32 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500"
              />
              <Volume2 className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          </div>
        </div>
      )}
    </>
  );
};
