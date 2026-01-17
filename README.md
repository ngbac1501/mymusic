# My Music - Ứng dụng nghe nhạc trực tuyến

<div align="center">

![My Music](public/favicon.png)

**Ứng dụng web nghe nhạc hiện đại với đầy đủ tính năng**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[Demo](https://mymusic.vercel.app) • [Features](#-tính-năng) • [Installation](#-cài-đặt) • [Usage](#-sử-dụng)

</div>

---

## 🚀 Tính năng

### Core Features
- ✅ **Authentication** - Đăng ký/Đăng nhập (Email/Password, Google OAuth)
- ✅ **Music Player** - Phát nhạc với đầy đủ controls (play, pause, next, previous, shuffle, repeat)
- ✅ **Search** - Tìm kiếm bài hát, ca sĩ, album với tabs filtering
- ✅ **Playlists** - Quản lý playlist cá nhân, thêm/xóa bài hát
- ✅ **Favorites** - Yêu thích bài hát và xem lịch sử nghe nhạc
- ✅ **Charts** - Bảng xếp hạng và Top 100
- ✅ **Responsive** - Hoạt động tốt trên mọi thiết bị

### Advanced Features
- 🎨 **Modern UI/UX** - Glassmorphism, gradients, smooth animations
- 📱 **PWA Support** - Cài đặt như app native, hoạt động offline
- ⌨️ **Keyboard Shortcuts** - Điều khiển player bằng phím tắt
- 🌙 **Dark Mode** - Giao diện tối mặc định
- 🎯 **Error Handling** - Error boundary và user-friendly error messages
- ⚡ **Performance** - Code splitting, lazy loading, caching
- 🧪 **Testing** - Vitest + Testing Library setup
- 📝 **Code Quality** - Prettier, ESLint, TypeScript strict mode

---

## 🛠️ Công nghệ sử dụng

### Frontend
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **Audio:** Howler.js
- **Build Tool:** Vite

### Backend & Services
- **Authentication:** Firebase Auth
- **Database:** Firestore
- **API:** ZingMP3 API
- **Hosting:** Vercel

### Developer Tools
- **Testing:** Vitest + Testing Library
- **Code Quality:** ESLint + Prettier
- **PWA:** vite-plugin-pwa + Workbox

---

## 📦 Cài đặt

### Prerequisites
- Node.js 18+ và npm
- Firebase account
- Git

### 1. Clone repository

```bash
git clone https://github.com/ngbac1501/mymusic.git
cd mymusic
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Firebase

1. Tạo project mới trên [Firebase Console](https://console.firebase.google.com/)
2. Bật Authentication (Email/Password và Google)
3. Tạo Firestore Database
4. Copy `.env.example` thành `.env` và điền thông tin:

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

---

## 📁 Cấu trúc project

```
src/
├── components/          # React components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components (Header, Sidebar, Footer)
│   ├── modals/         # Modal components
│   ├── music/          # Music-related components
│   ├── ui/             # UI components (Button, Card, Badge, Tabs)
│   └── user/           # User components
├── config/             # Configuration files
├── hooks/              # Custom hooks
├── pages/              # Page components
├── services/           # API services
├── store/              # Zustand stores
├── types/              # TypeScript types
├── utils/              # Utility functions
└── constants/          # Constants
```

---

## 🔧 Scripts

```bash
# Development
npm run dev              # Start dev server (frontend + backend)
npm run client           # Start frontend only
npm run server           # Start backend only

# Build
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm test                 # Run tests
npm run test:ui          # Open test UI
npm run test:coverage    # Generate coverage report
```

---

## ⌨️ Keyboard Shortcuts

| Phím | Chức năng |
|------|-----------|
| `Space` | Play/Pause |
| `→` | Bài tiếp theo |
| `←` | Bài trước |
| `↑` | Tăng âm lượng |
| `↓` | Giảm âm lượng |
| `M` | Tắt/Bật tiếng |
| `Ctrl+K` | Tìm kiếm |
| `Ctrl+H` | Về trang chủ |

---

## 📱 PWA Features

- ✅ **Installable** - Cài đặt như app native
- ✅ **Offline** - Hoạt động offline sau lần truy cập đầu
- ✅ **Fast** - Cache assets, fonts cho tốc độ tối đa
- ✅ **Responsive** - Tối ưu cho mọi màn hình

### Cách cài đặt PWA:
1. Mở app trên Chrome/Edge
2. Tìm icon "Install" trên address bar
3. Click "Install"
4. App xuất hiện trên home screen/desktop

---

## 🚀 Deploy

### Deploy lên Vercel (Recommended)

1. Push code lên GitHub
2. Import project vào [Vercel](https://vercel.com)
3. Thêm environment variables
4. Deploy!

### Deploy lên Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage
npm run test:coverage
```

Test files: `*.test.tsx` hoặc `*.test.ts`

---

## 📝 Code Quality

### Prettier
```bash
npm run format        # Auto-format all files
npm run format:check  # Check formatting
```

### ESLint
```bash
npm run lint          # Check for errors
```

### Pre-commit (Recommended)
Install Husky để auto-format trước khi commit:
```bash
npm install -D husky lint-staged
npx husky install
```

---

## 🎨 UI/UX Highlights

- **Glassmorphism** - Frosted glass effects
- **Gradients** - Vibrant color gradients
- **Animations** - Smooth transitions với Framer Motion
- **Typography** - Inter & Outfit fonts
- **Icons** - Lucide React icons
- **Responsive** - Mobile-first design
- **Dark Mode** - Beautiful dark theme

---

## 🔒 Security

- ✅ Environment variable validation
- ✅ Firebase security rules
- ✅ Input sanitization
- ✅ XSS protection
- ✅ CORS configured

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 👥 Contributing

Contributions are welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 🐛 Bug Reports

Found a bug? [Open an issue](https://github.com/ngbac1501/mymusic/issues)

---

## 📧 Contact

- GitHub: [@ngbac1501](https://github.com/ngbac1501)
- Email: your-email@example.com

---

<div align="center">

**Made with ❤️ using React + TypeScript + Tailwind CSS**

⭐ Star this repo if you like it!

</div>
