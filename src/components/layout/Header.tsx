import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { UserAvatar } from '@/components/user/UserAvatar';
import { logout } from '@/services/auth';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setFirebaseUser } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`h-16 md:h-18 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 transition-all duration-300 ${isScrolled
          ? 'glass-strong shadow-lg'
          : 'bg-gradient-to-b from-dark-900/80 to-dark-900/60 backdrop-blur-md'
        }`}
    >
      {/* Logo/Title - Hidden text on mobile */}
      <div className="flex-1 hidden md:block">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-vibrant flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-xl">♫</span>
          </div>
          <h2 className="text-2xl font-display font-bold gradient-text-vibrant">
            My Music
          </h2>
        </div>
      </div>

      {/* Mobile Logo - Icon only */}
      <div className="md:hidden">
        <div className="w-9 h-9 rounded-xl bg-gradient-vibrant flex items-center justify-center shadow-glow">
          <span className="text-white font-bold text-lg">♫</span>
        </div>
      </div>

      {/* Spacer on mobile */}
      <div className="flex-1 md:hidden"></div>

      {/* Search Bar - Desktop only */}
      <div className="hidden lg:flex flex-1 max-w-md mx-8">
        <button
          onClick={() => navigate(ROUTES.SEARCH)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl glass hover:glass-strong transition-all duration-200 group"
        >
          <Search className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
          <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
            Tìm kiếm bài hát, nghệ sĩ...
          </span>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Icon - Mobile/Tablet */}
        <button
          onClick={() => navigate(ROUTES.SEARCH)}
          className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors group"
        >
          <Search className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 relative group">
          <Bell className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-rose rounded-full animate-pulse shadow-glow-pink" />
        </button>

        {/* User section */}
        {user ? (
          <div className="hidden md:flex items-center gap-2">
            <div className="relative" ref={avatarRef}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer group"
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
                  className="absolute right-0 mt-2 w-64 rounded-2xl shadow-glass z-50 glass-strong animate-scale-in overflow-hidden"
                >
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        photoURL={user.photoURL}
                        displayName={user.displayName}
                        size="small"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-100 truncate">{user.displayName}</p>
                        <p className="text-sm text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
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
                  </div>
                  <div className="border-t border-white/10 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-lg"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Button
            onClick={() => navigate(ROUTES.LOGIN)}
            variant="primary"
            size="sm"
            className="text-sm md:text-base"
          >
            Đăng nhập
          </Button>
        )}
      </div>
    </header>
  );
};
