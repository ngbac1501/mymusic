import React, { useState, useRef } from 'react';
import { Camera, Save, Loader, User, Mail, FileText } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserAvatar } from '@/components/user/UserAvatar';
import { updateProfile } from 'firebase/auth';
import { setUser } from '@/services/firestore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, firebaseUser, setUser: setStoreUser } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

    try {
      await updateProfile(firebaseUser, {
        displayName,
        photoURL,
      });

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

      setStoreUser(updatedUser);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Vui lòng đăng nhập để xem trang này</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
      <h1 className="text-4xl font-display font-bold gradient-text-vibrant mb-8">
        Trang cá nhân
      </h1>

      <Card variant="glass" padding="lg">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <UserAvatar
              photoURL={photoURL}
              displayName={displayName}
              size="large"
              className="ring-4 ring-primary-500/20 shadow-glow"
            />
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 p-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full shadow-glow hover:scale-110 transition-transform"
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
          <p className="mt-4 text-sm text-gray-400">
            Click vào icon camera để thay đổi ảnh đại diện
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Tên hiển thị
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="Nhập tên hiển thị"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-700 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Giới thiệu
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none transition-all"
              placeholder="Viết vài dòng về bạn..."
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            leftIcon={<Save className="w-5 h-5" />}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
