import React, { useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { logout } from '@/services/auth';

interface UserDropdownProps {
    user: {
        displayName?: string;
        email?: string;
    };
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement>;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
    user,
    isOpen,
    onClose,
    anchorRef,
}) => {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside để đóng
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchorRef]);

    // ESC key để đóng
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const handleLogout = async () => {
        try {
            await logout();
            onClose();
            navigate(ROUTES.HOME);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in"
        >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {user.displayName || 'User'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
                <button
                    onClick={() => {
                        navigate(ROUTES.PROFILE);
                        onClose();
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                    <User className="w-4 h-4" />
                    <span>Trang cá nhân</span>
                </button>

                <button
                    onClick={() => {
                        // TODO: Navigate to settings
                        onClose();
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                    <Settings className="w-4 h-4" />
                    <span>Cài đặt</span>
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};
