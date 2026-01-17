# My Music - Ứng dụng nghe nhạc trực tuyến

Ứng dụng web nghe nhạc hiện đại với đầy đủ tính năng, được xây dựng bằng React, TypeScript, và Firebase.

## 🚀 Tính năng

- ✅ Đăng ký/Đăng nhập (Email/Password, Google OAuth)
- ✅ Tìm kiếm bài hát, ca sĩ, album
- ✅ Phát nhạc với đầy đủ controls (play, pause, next, previous, shuffle, repeat)
- ✅ Quản lý playlist cá nhân
- ✅ Yêu thích và lịch sử nghe nhạc
- ✅ Bảng xếp hạng và Top 100
- ✅ Dark mode / Light mode
- ✅ Responsive design

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Audio Player**: Howler.js
- **Backend**: Firebase (Auth, Firestore)
- **API**: ZingMP3 API

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd my-music
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Firebase

1. Tạo project mới trên [Firebase Console](https://console.firebase.google.com/)
2. Bật Authentication (Email/Password và Google)
3. Tạo Firestore Database
4. Copy thông tin config và tạo file `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## 📁 Cấu trúc project

```
src/
├── components/       # React components
│   ├── common/      # Components dùng chung
│   ├── layout/      # Layout components
│   └── music/       # Music-related components
├── pages/           # Page components
├── hooks/           # Custom hooks
├── services/        # API services
├── store/           # Zustand stores
├── types/           # TypeScript types
├── utils/           # Utility functions
└── constants/       # Constants
```

## 🔧 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## 🚀 Deploy

### Deploy lên Firebase Hosting

1. Cài đặt Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Init project:
```bash
firebase init hosting
```

4. Build và deploy:
```bash
npm run build
firebase deploy
```

## 📝 Lưu ý

- ZingMP3 API có thể có rate limiting, cần xử lý lỗi phù hợp
- Firebase cần được cấu hình đúng để authentication và database hoạt động
- Một số tính năng có thể cần thêm cấu hình trong Firebase Console

## 📄 License

MIT
