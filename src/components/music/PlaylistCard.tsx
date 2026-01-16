import React from 'react';
import { Play, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { formatNumber } from '@/utils/format';
import type { Playlist } from '@/types';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick?: () => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(ROUTES.PLAYLIST(playlist.encodeId));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
        {/* Gradient Overlay Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 via-dark-900 to-dark-950 z-0" />
        
        {/* Image */}
        <img
          src={playlist.thumbnailM || playlist.thumbnail}
          alt={playlist.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 relative z-10"
          loading="lazy"
        />
        
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 transition-all"
          >
            <Play className="w-6 h-6 fill-current" />
          </motion.button>
        </div>
      </div>
      
      {/* Info */}
      <div className="px-2">
        <h3 className="font-bold text-gray-100 truncate mb-1 group-hover:text-primary-300 transition-colors line-clamp-2">
          {playlist.title}
        </h3>
        {(playlist.like || playlist.listen) && (
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
            {playlist.like && `${formatNumber(playlist.like)} thích`}
            {playlist.like && playlist.listen && ' • '}
            {playlist.listen && `${formatNumber(playlist.listen)} nghe`}
          </p>
        )}
      </div>
    </motion.div>
  );
};
