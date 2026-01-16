import React from 'react';

interface UserAvatarProps {
    photoURL?: string;
    displayName?: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
    onClick?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
    photoURL,
    displayName,
    size = 'medium',
    className = '',
    onClick,
}) => {
    const sizeClasses = {
        small: 'w-8 h-8 text-sm',
        medium: 'w-10 h-10 text-base',
        large: 'w-16 h-16 text-2xl',
    };

    const initials = displayName
        ? displayName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'U';

    return (
        <div
            className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center cursor-pointer ${className}`}
            onClick={onClick}
        >
            {photoURL ? (
                <img
                    src={photoURL}
                    alt={displayName || 'User avatar'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback nếu ảnh lỗi
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                            (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                        }
                    }}
                />
            ) : null}
            <div
                className={`w-full h-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-semibold ${photoURL ? 'hidden' : 'flex'
                    }`}
            >
                {initials}
            </div>
        </div>
    );
};
