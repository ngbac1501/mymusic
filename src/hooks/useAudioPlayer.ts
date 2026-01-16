// Custom hook để quản lý audio player với Howler.js

import { useEffect, useRef, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getStreamingUrl } from '@/services/zingmp3';
import { addToHistory } from '@/services/firestore';
import toast from 'react-hot-toast';

export function useAudioPlayer() {
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const historyTrackedRef = useRef<string | null>(null); // Track if history was saved for current song

  const { user } = useAuthStore();
  const {
    currentSong,
    queue,
    currentIndex,
    isPlaying,
    repeatMode,
    volume,
    currentTime,
    duration,
    isLoading,
    setCurrentTime,
    setDuration,
    setIsLoading,
    play,
    pause,
    next,
    previous,
  } = usePlayerStore();

  // Load và play bài hát
  const loadSong = useCallback(
    async (songId: string) => {
      try {
        setIsLoading(true);
        pause();

        // Stop ALL playing sounds globally to prevent overlap
        Howler.stop();

        // Dừng bài hát hiện tại nếu có
        if (soundRef.current) {
          soundRef.current.stop();
          soundRef.current.unload();
          soundRef.current = null;
        }

        // Lấy streaming URL
        const url = await getStreamingUrl(songId);
        if (!url) {
          throw new Error('Không thể tải bài hát');
        }

        console.log('Loading song:', songId, 'URL:', url.substring(0, 50) + '...');

        // Lấy volume hiện tại từ store
        const currentVolume = usePlayerStore.getState().volume;

        // Tạo Howl instance
        const sound = new Howl({
          src: [url],
          html5: true,
          format: ['mp3', 'm4a', 'aac'], // Hỗ trợ các format phổ biến
          volume: currentVolume,
          preload: true,
          onload: () => {
            console.log('Audio loaded successfully');
            setDuration(sound.duration());
            setIsLoading(false);
            // Chỉ play sau khi load xong
            sound.play();
          },
          onplay: () => {
            play();
            setIsLoading(false);
          },
          onpause: () => {
            pause();
          },
          onend: () => {
            if (repeatMode === 'one') {
              // Lặp lại bài hát hiện tại
              sound.play();
            } else {
              // Chuyển sang bài tiếp theo
              next();
            }
          },
          onloaderror: (_id: unknown, error: unknown) => {
            console.error('Audio load error:', error);
            setIsLoading(false);
            toast.error('Không thể tải bài hát này');
          },
          onplayerror: (_id: unknown, error: unknown) => {
            console.error('Audio play error:', error);
            setIsLoading(false);
            // Thử unlock audio context và play lại
            sound.once('unlock', () => {
              sound.play();
            });
          },
        });

        soundRef.current = sound;
        // Không gọi play() ở đây nữa, để onload callback xử lý
      } catch (error) {
        console.error('Error loading song:', error);
        setIsLoading(false);
        toast.error('Không thể tải bài hát');
      }
    },
    [repeatMode, play, pause, next, setDuration, setIsLoading]
  );

  // Play/Pause
  const togglePlayPause = useCallback(() => {
    if (!soundRef.current) {
      if (currentSong) {
        loadSong(currentSong.encodeId);
      }
      return;
    }

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  }, [isPlaying, currentSong, loadSong]);

  // Seek
  const seek = useCallback((time: number) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      setCurrentTime(time);
    }
  }, [setCurrentTime]);

  // Set volume
  const setVolume = useCallback(
    (vol: number) => {
      usePlayerStore.getState().setVolume(vol);
      if (soundRef.current) {
        soundRef.current.volume(vol);
      }
    },
    []
  );

  // Update current time
  useEffect(() => {
    if (soundRef.current && isPlaying) {
      intervalRef.current = setInterval(() => {
        if (soundRef.current) {
          const time = soundRef.current.seek() as number;
          setCurrentTime(time);
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, setCurrentTime]);

  // Track listening history after 30 seconds
  useEffect(() => {
    if (
      user &&
      currentSong &&
      isPlaying &&
      currentTime >= 30 &&
      historyTrackedRef.current !== currentSong.encodeId
    ) {
      // Save to history
      addToHistory(user.uid, currentSong.encodeId, currentSong.duration)
        .then(() => {
          historyTrackedRef.current = currentSong.encodeId;
        })
        .catch((error) => {
          console.error('Error saving listening history:', error);
        });
    }
  }, [user, currentSong, isPlaying, currentTime]);

  // Load song khi currentSong thay đổi
  useEffect(() => {
    if (currentSong && queue.length > 0 && currentIndex >= 0) {
      loadSong(currentSong.encodeId);
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
        soundRef.current = null;
      }
    };
  }, [currentSong?.encodeId, currentIndex, queue.length, loadSong]);

  // Update volume khi volume thay đổi
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  // Sync isPlaying state với Howler (chỉ khi có sự khác biệt)
  useEffect(() => {
    if (soundRef.current) {
      const isHowlerPlaying = soundRef.current.playing();

      if (isPlaying && !isHowlerPlaying) {
        soundRef.current.play();
      } else if (!isPlaying && isHowlerPlaying) {
        soundRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Media Session API Support
  useEffect(() => {
    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artistNames,
        artwork: [
          { src: currentSong.thumbnailM || currentSong.thumbnail, sizes: '96x96', type: 'image/jpeg' },
          { src: currentSong.thumbnailM || currentSong.thumbnail, sizes: '128x128', type: 'image/jpeg' },
          { src: currentSong.thumbnailM || currentSong.thumbnail, sizes: '192x192', type: 'image/jpeg' },
          { src: currentSong.thumbnailM || currentSong.thumbnail, sizes: '256x256', type: 'image/jpeg' },
          { src: currentSong.thumbnailM || currentSong.thumbnail, sizes: '384x384', type: 'image/jpeg' },
          { src: currentSong.thumbnailM || currentSong.thumbnail, sizes: '512x512', type: 'image/jpeg' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        previous();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        next();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime && soundRef.current) {
          soundRef.current.seek(details.seekTime);
          setCurrentTime(details.seekTime);
        }
      });
    }
  }, [currentSong, play, pause, previous, next, setCurrentTime]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      Howler.stop();
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    togglePlayPause,
    seek,
    setVolume,
    currentTime,
    duration,
    isLoading,
  };
}
