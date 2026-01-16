import React, { useState, useRef } from 'react';
import { Camera, Save, Loader } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserAvatar } from '@/components/user/UserAvatar';
import { updateProfile } from 'firebase/auth';
import { setUser } from '@/services/firestore';

export const ProfilePage: React.FC = () => {
  const { user, firebaseUser, setUser: setStoreUser } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Cập nhật Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName,
        photoURL,
      });

      // Cập nhật Firestore (với fallback)
      const updatedUser = {
        ...user,
        displayName,
        photoURL,
        bio,
        updatedAt: new Date(),
      };

      try {
        await setUser(user.uid, updatedUser);
      } catch (firestoreError) {
        console.warn('Firestore update failed, continuing with local state:', firestoreError);
      }

      // Cập nhật store
      setStoreUser(updatedUser);

      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 dark:text-gray-400">Vui lòng đăng nhập để xem trang này</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Trang cá nhân
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <UserAvatar
              photoURL={photoURL}
              displayName={displayName}
              size="large"
              className="ring-4 ring-white dark:ring-gray-800 shadow-xl"
            />
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Click vào icon camera để thay đổi ảnh đại diện
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên hiển thị
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Nhập tên hiển thị"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giới thiệu
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Viết vài dòng về bạn..."
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg ${message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
