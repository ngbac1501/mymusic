import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Library,
  Heart,
  BarChart3,
  Settings,
  LogOut,
  Music,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { logout } from '@/services/auth';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

const menuItems = [
  { icon: Home, label: 'Trang chủ', path: ROUTES.HOME },
  { icon: Search, label: 'Tìm kiếm', path: ROUTES.SEARCH },
  { icon: BarChart3, label: 'BXH', path: ROUTES.CHART },
  { icon: Music, label: 'Top 100', path: ROUTES.TOP100 },
];

const myMusicItems = [
  { icon: Library, label: 'Thư viện', path: ROUTES.MY_MUSIC },
  { icon: Heart, label: 'Yêu thích', path: ROUTES.MY_FAVORITES },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, setUser, setFirebaseUser } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setFirebaseUser(null);
      setMobileOpen(false);
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      toast.error('Đăng xuất thất bại');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Mobile Hamburger Button
  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className={cn(
        "hidden md:flex h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        {/* Logo & Toggle */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <Link to={ROUTES.HOME} className={cn(
            "flex items-center gap-2",
            !sidebarOpen && "justify-center w-full"
          )}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Music className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                My Music
              </span>
            )}
          </Link>
          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              title="Thu gọn"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {!sidebarOpen && (
          <div className="px-4 py-2">
            <button
              onClick={toggleSidebar}
              className="w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
              title="Mở rộng"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}

        {/* Menu */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive(item.path)
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* My Music Section */}
          {user && (
            <>
              {sidebarOpen && (
                <div className="mt-8 mb-2 px-4">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Thư viện của tôi
                  </h3>
                </div>
              )}
              <nav className="space-y-1">
                {myMusicItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive(item.path)
                          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                    </Link>
                  );
                })
                }
              </nav>
            </>
          )}
        </div>

        {/* User Section */}
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 md:hidden">
            <div className="flex flex-col gap-2 items-center">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary-500 shadow"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {user.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <Link
                to={ROUTES.SETTINGS}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Cài đặt"
              >
                <Settings className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex"
          >
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-64 h-full bg-gradient-to-br from-dark-900 to-dark-950 border-r border-primary-900/20 flex flex-col">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-gray-200 hover:bg-primary-600 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Logo & Toggle */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <Link to={ROUTES.HOME} className={cn(
                  "flex items-center gap-2",
                  !sidebarOpen && "justify-center w-full"
                )}>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  {sidebarOpen && (
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      My Music
                    </span>
                  )}
                </Link>
                {sidebarOpen && (
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    title="Thu gọn"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                )}
              </div>

              {/* Menu */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                          isActive(item.path)
                            ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="font-medium">{item.label}</span>}
                      </Link>
                    );
                  })}
                </nav>

                {/* My Music Section */}
                {user && (
                  <>
                    {sidebarOpen && (
                      <div className="mt-8 mb-2 px-4">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Thư viện của tôi
                        </h3>
                      </div>
                    )}
                    <nav className="space-y-1">
                      {myMusicItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                              isActive(item.path)
                                ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                            onClick={() => setMobileOpen(false)}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                          </Link>
                        );
                      })
                      }
                    </nav>
                  </>
                )}
              </div>

              {/* User Section */}
              {user && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  {sidebarOpen ? (
                    <>
                      <Link
                        to={ROUTES.PROFILE}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 mb-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                      >
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className="w-10 h-10 rounded-full object-cover border-2 border-primary-500 shadow"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {user.displayName?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {user.displayName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </Link>
                      <div className="flex gap-2">
                        <Link
                          to={ROUTES.SETTINGS}
                          onClick={() => setMobileOpen(false)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm font-medium">Cài đặt</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Đăng xuất</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 items-center">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          className="w-10 h-10 rounded-full object-cover border-2 border-primary-500 shadow"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {user.displayName?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <Link
                        to={ROUTES.SETTINGS}
                        onClick={() => setMobileOpen(false)}
                        className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Cài đặt"
                      >
                        <Settings className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Đăng xuất"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
