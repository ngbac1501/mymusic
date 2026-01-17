import { useEffect, useCallback, useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    description: string;
    action: () => void;
}

export const useKeyboardShortcuts = () => {
    const {
        isPlaying,
        togglePlay,
        next,
        previous,
        volume,
        setVolume,
    } = usePlayerStore();

    const navigate = useNavigate();
    const [previousVolume, setPreviousVolume] = useState(volume);
    const isMuted = volume === 0;

    const toggleMute = () => {
        if (isMuted) {
            setVolume(previousVolume || 0.5);
        } else {
            setPreviousVolume(volume);
            setVolume(0);
        }
    };

    const shortcuts: KeyboardShortcut[] = [
        {
            key: ' ',
            description: 'Play/Pause',
            action: () => {
                togglePlay();
                toast.success(isPlaying ? 'Tạm dừng' : 'Phát nhạc', { duration: 1000 });
            },
        },
        {
            key: 'ArrowRight',
            description: 'Next song',
            action: () => {
                next();
                toast.success('Bài tiếp theo', { duration: 1000 });
            },
        },
        {
            key: 'ArrowLeft',
            description: 'Previous song',
            action: () => {
                previous();
                toast.success('Bài trước', { duration: 1000 });
            },
        },
        {
            key: 'ArrowUp',
            description: 'Volume up',
            action: () => {
                const newVolume = Math.min(volume + 0.1, 1);
                setVolume(newVolume);
                toast.success(`Âm lượng: ${Math.round(newVolume * 100)}%`, { duration: 1000 });
            },
        },
        {
            key: 'ArrowDown',
            description: 'Volume down',
            action: () => {
                const newVolume = Math.max(volume - 0.1, 0);
                setVolume(newVolume);
                toast.success(`Âm lượng: ${Math.round(newVolume * 100)}%`, { duration: 1000 });
            },
        },
        {
            key: 'm',
            description: 'Mute/Unmute',
            action: () => {
                toggleMute();
                toast.success(isMuted ? 'Bật tiếng' : 'Tắt tiếng', { duration: 1000 });
            },
        },
        {
            key: 'k',
            ctrl: true,
            description: 'Search',
            action: () => {
                navigate('/search');
                setTimeout(() => {
                    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                    searchInput?.focus();
                }, 100);
            },
        },
        {
            key: 'h',
            ctrl: true,
            description: 'Home',
            action: () => navigate('/'),
        },
    ];

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        // Don't trigger shortcuts when typing in inputs
        const target = event.target as HTMLElement;
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        ) {
            // Allow Ctrl+K even in inputs
            if (!(event.ctrlKey && event.key === 'k')) {
                return;
            }
        }

        const shortcut = shortcuts.find(
            (s) =>
                s.key === event.key &&
                !!s.ctrl === event.ctrlKey &&
                !!s.shift === event.shiftKey &&
                !!s.alt === event.altKey
        );

        if (shortcut) {
            event.preventDefault();
            shortcut.action();
        }
    }, [shortcuts]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    return { shortcuts };
};
