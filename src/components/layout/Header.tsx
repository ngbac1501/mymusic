import React, { useState, useRef } from 'react';
import { Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { UserAvatar } from '@/components/user/UserAvatar';
import { logout } from '@/services/auth';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setFirebaseUser } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setFirebaseUser(null);
      setIsDropdownOpen(false);
      toast.success('Đăng xuất thành công!');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Đăng xuất thất bại');
    }
  };

  return (
    <header className="h-16 bg-gradient-to-b from-dark-800 to-dark-900 border-b border-primary-900/20 flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-xl">
      {/* Logo/Title */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-vibrant flex items-center justify-center">
            <span className="text-white font-bold text-lg">♫</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-cyan bg-clip-text text-transparent">
            My Music
          </h2>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors relative group">
          <Bell className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>
        {/* User info only on desktop/tablet */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative" ref={avatarRef}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <UserAvatar
                  photoURL={user.photoURL}
                  displayName={user.displayName}
                  size="small"
                />
                <span className="font-medium text-gray-100 group-hover:text-primary-300 transition-colors">
                  {user.displayName}
                </span>
              </div>
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl z-50 border border-primary-700/30"
                  style={{
                    background: 'linear-gradient(135deg, #18181b 80%, #23232a 100%)',
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.32)',
                    backdropFilter: 'blur(8px)',
                    color: '#e5e7eb',
                    padding: '0.75rem 0',
                  }}
                >
                  <button
                    onClick={() => { setIsDropdownOpen(false); navigate(ROUTES.PROFILE); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-100 hover:bg-primary-600/10 transition-colors"
                  >
                    <UserAvatar photoURL={user.photoURL} displayName={user.displayName} size="small" />
                    Trang cá nhân
                  </button>
                  <button
                    onClick={() => { setIsDropdownOpen(false); navigate(ROUTES.SETTINGS); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-100 hover:bg-primary-600/10 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Cài đặt
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <span className="w-5 h-5 flex items-center justify-center"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" /></svg></span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:shadow-primary-500/50 transition-all"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
