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
  User,
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

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex h-full glass-strong border-r border-white/10 flex-col transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        {/* Logo & Toggle */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link to={ROUTES.HOME} className={cn(
            "flex items-center gap-3",
            !sidebarOpen && "justify-center w-full"
          )}>
            <div className="w-10 h-10 bg-gradient-vibrant rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
              <Music className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-xl font-display font-bold gradient-text-vibrant">
                My Music
              </span>
            )}
          </Link>
          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Thu gọn"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {!sidebarOpen && (
          <div className="px-2 py-2">
            <button
              onClick={toggleSidebar}
              className="w-full p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
              title="Mở rộng"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}

        {/* Menu */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative',
                    active
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                    active && "scale-110"
                  )} />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-dark-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* My Music Section */}
          {user && (
            <>
              {sidebarOpen && (
                <div className="mt-6 mb-2 px-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Thư viện của tôi
                  </h3>
                </div>
              )}
              <nav className={cn("space-y-1", !sidebarOpen && "mt-6 pt-6 border-t border-white/10")}>
                {myMusicItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative',
                        active
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      )}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <Icon className={cn(
                        "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                        active && "scale-110"
                      )} />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                      {!sidebarOpen && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-dark-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </>
          )}
        </div>

        {/* User Section - Desktop */}
        {user && sidebarOpen && (
          <div className="p-3 border-t border-white/10">
            <Link
              to={ROUTES.PROFILE}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors group mb-2"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary-500 shadow-glow"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-vibrant flex items-center justify-center text-white font-semibold shadow-glow">
                  {user.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-100 truncate group-hover:text-primary-300 transition-colors">
                  {user.displayName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </Link>
            <div className="flex gap-2">
              <Link
                to={ROUTES.SETTINGS}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Cài đặt</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Thoát</span>
              </button>
            </div>
          </div>
        )}

        {/* User Section - Collapsed */}
        {user && !sidebarOpen && (
          <div className="p-2 border-t border-white/10 space-y-2">
            <Link
              to={ROUTES.PROFILE}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors group relative"
              title="Trang cá nhân"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-vibrant flex items-center justify-center text-white text-sm font-semibold">
                  {user.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </Link>
            <button
              onClick={() => window.location.href = ROUTES.SETTINGS}
              className="w-full p-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              title="Cài đặt"
            >
              <Settings className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={handleLogout}
              className="w-full p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5 mx-auto" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {menuItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]',
                  active
                    ? 'text-primary-400'
                    : 'text-gray-400'
                )}
              >
                <Icon className={cn(
                  "w-6 h-6 transition-all duration-200",
                  active && "scale-110 drop-shadow-glow"
                )} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
          {user ? (
            <button
              onClick={() => setMobileOpen(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 text-gray-400 min-w-[60px]"
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Tôi</span>
            </button>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 text-gray-400 min-w-[60px]"
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 flex items-end"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full glass-strong rounded-t-3xl border-t border-white/10 max-h-[80vh] overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold gradient-text-vibrant">Menu</h2>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                {/* User Info */}
                {user && (
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-2xl glass hover:glass-strong transition-all mb-6"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary-500 shadow-glow"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-vibrant flex items-center justify-center text-white text-xl font-semibold shadow-glow">
                        {user.displayName?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-100 truncate text-lg">
                        {user.displayName}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </Link>
                )}

                {/* Menu Items */}
                <div className="space-y-2 mb-6">
                  {[...menuItems, ...(user ? myMusicItems : [])].map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                          active
                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
                            : 'text-gray-300 hover:bg-white/10'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Actions */}
                {user && (
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Link
                      to={ROUTES.SETTINGS}
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass hover:glass-strong transition-all"
                    >
                      <Settings className="w-5 h-5 text-gray-300" />
                      <span className="font-medium text-gray-300">Cài đặt</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all"
                    >
                      <LogOut className="w-5 h-5 text-red-400" />
                      <span className="font-medium text-red-400">Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
