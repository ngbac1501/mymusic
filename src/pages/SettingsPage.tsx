import React from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Cài đặt
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          {/* Theme Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Giao diện
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <span className="text-gray-700 dark:text-gray-300">
                  Chế độ {theme === 'dark' ? 'tối' : 'sáng'}
                </span>
              </div>
              <Button variant="outline" onClick={toggleTheme}>
                Chuyển sang {theme === 'dark' ? 'sáng' : 'tối'}
              </Button>
            </div>
          </div>

          {/* Other Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Khác
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Các cài đặt khác đang được phát triển...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
