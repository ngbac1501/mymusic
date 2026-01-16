import React, { useState, useRef, useEffect } from 'react';
import { Play, MoreVertical, Heart, ListPlus, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useModalStore } from '@/store/useModalStore';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useAuthStore } from '@/store/useAuthStore';
import { formatTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import type { Song } from '@/types';

interface SongCardProps {
  song: Song;
  index?: number;
  onPlay?: (song: Song) => void;
  showIndex?: boolean;
  isPlaying?: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  index,
  onPlay,
  showIndex = false,
  isPlaying = false,
}) => {
  const navigate = useNavigate();
  const { setQueue, setCurrentIndex, setCurrentSong, queue, addToQueue } = usePlayerStore();
  const { user } = useAuthStore();
  const { openAddToPlaylist } = useModalStore();
  const { data: isFav, isLoading: isFavLoading } = useIsFavorite(song.encodeId);
  const { mutate: toggleFavorite } = useToggleFavorite();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handlePlay = () => {
    if (onPlay) {
      onPlay(song);
    } else {
      // Nếu không có onPlay callback, thêm vào queue và play
      if (queue.length === 0) {
        setQueue([song]);
        setCurrentIndex(0);
        setCurrentSong(song);
      } else {
        // Tìm index của bài hát trong queue
        const songIndex = queue.findIndex((s) => s.encodeId === song.encodeId);
        if (songIndex >= 0) {
          setCurrentIndex(songIndex);
          setCurrentSong(song);
        } else {
          // Thêm vào queue và play
          setQueue([...queue, song]);
          setCurrentIndex(queue.length);
          setCurrentSong(song);
        }
      }
    }
  };

  const handleToggleFavorite = () => {
    if (!user) return;
    toggleFavorite({ songId: song.encodeId, isFav: isFav || false });
  };

  const handleAddToPlaylist = () => {
    openAddToPlaylist(song);
    setShowMenu(false);
  };

  const handleAddToQueue = () => {
    addToQueue(song);
    toast.success('Đã thêm vào hàng đợi');
    setShowMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[role="menu"]')) return;
        navigate(`/song/${song.encodeId}`);
      }}
      className={cn(
        'group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300',
        'bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary-500/50',
        'hover:bg-gradient-to-r hover:from-primary-500/10 hover:to-accent-cyan/10',
        'hover:shadow-lg hover:shadow-primary-500/20',
        isPlaying && 'bg-gradient-to-r from-primary-600/20 to-accent-cyan/20 border-primary-500/50'
      )}
    >
      {/* Index hoặc Play button */}
      <div className="w-8 flex items-center justify-center">
        {showIndex ? (
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:hidden">
            {index !== undefined ? index + 1 : ''}
          </span>
        ) : null}
        <button
          onClick={handlePlay}
          className={cn(
            'p-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-300',
            'hover:shadow-lg hover:shadow-primary-500/50 transform hover:scale-110',
            showIndex && 'hidden group-hover:block',
            isPlaying && 'opacity-100'
          )}
        >
          <Play className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Thumbnail */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/20 group-hover:ring-primary-500/50 transition-all">
        <img
          src={song.thumbnailM || song.thumbnail}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-t from-primary-600/40 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            'font-semibold truncate transition-colors duration-300',
            isPlaying ? 'text-primary-400' : 'text-gray-100 group-hover:text-primary-300'
          )}
        >
          {song.title}
        </h3>
        <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors">
          {song.artistNames}
        </p>
      </div>

      {/* Duration */}
      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
        {formatTime(song.duration)}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Favorite Button */}
        {user && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            disabled={isFavLoading}
            className={cn(
              'p-2 rounded-full transition-all duration-300',
              isFav
                ? 'text-accent-pink hover:bg-accent-pink/20 ring-1 ring-accent-pink/50'
                : 'text-gray-400 hover:text-accent-pink hover:bg-accent-pink/10'
            )}
          >
            <Heart className={cn('w-4 h-4 transition-all', isFav && 'fill-current')} />
          </motion.button>
        )}

        {/* More Options Button */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded-full transition-all duration-300"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-dark-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 z-10"
                >
                  <button
                    onClick={handleAddToPlaylist}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-primary-500/10 transition-all duration-300"
                  >
                    <ListPlus className="w-4 h-4" />
                    Thêm vào playlist
                  </button>
                  <button
                    onClick={handleAddToQueue}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-primary-500/10 transition-all duration-300"
                  >
                    <Play className="w-4 h-4" />
                    Thêm vào hàng đợi
                  </button>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-primary-500/10 transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4" />
                    Chia sẻ
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};
