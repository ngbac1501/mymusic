// Constants cho ứng dụng

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SEARCH: '/search',
  CHART: '/chart',
  TOP100: '/top100',
  TRENDING: '/trending',
  SONG: (id: string) => `/song/${id}`,
  ARTIST: (id: string) => `/artist/${id}`,
  ALBUM: (id: string) => `/album/${id}`,
  PLAYLIST: (id: string) => `/playlist/${id}`,
  MY_MUSIC: '/my-music',
  MY_PLAYLISTS: '/my-music/playlists',
  MY_FAVORITES: '/my-music/favorites',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// ZingMP3 API Base URL
export const ZINGMP3_API_BASE = 'https://zingmp3.vn/api';

// Firestore Collections
export const COLLECTIONS = {
  USERS: 'users',
  PLAYLISTS: 'playlists',
  FAVORITES: 'favorites',
  LISTENING_HISTORY: 'listening_history',
  USER_STATS: 'user_stats',
  SEARCH_HISTORY: 'search_history',
} as const;

// Player defaults
export const PLAYER_DEFAULTS = {
  VOLUME: 0.7,
  REPEAT_MODE: 'none' as const,
  SHUFFLE: false,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  VOLUME: 'volume',
  QUEUE: 'queue',
  CURRENT_SONG: 'currentSong',
  CURRENT_INDEX: 'currentIndex',
} as const;

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  LOGIN_ERROR: 'Đăng nhập thất bại. Vui lòng thử lại.',
  REGISTER_SUCCESS: 'Đăng ký thành công!',
  REGISTER_ERROR: 'Đăng ký thất bại. Vui lòng thử lại.',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  PLAYLIST_CREATED: 'Tạo playlist thành công!',
  PLAYLIST_DELETED: 'Xóa playlist thành công!',
  SONG_ADDED_TO_PLAYLIST: 'Đã thêm bài hát vào playlist!',
  SONG_REMOVED_FROM_PLAYLIST: 'Đã xóa bài hát khỏi playlist!',
  SONG_ADDED_TO_FAVORITES: 'Đã thêm vào yêu thích!',
  SONG_REMOVED_FROM_FAVORITES: 'Đã xóa khỏi yêu thích!',
  ERROR: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
