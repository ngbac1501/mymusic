// Types cho ứng dụng nghe nhạc

// User types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    theme: 'light' | 'dark';
    language: 'vi' | 'en';
  };
}

// Song types từ ZingMP3 API
export interface Song {
  encodeId: string;
  title: string;
  alias: string;
  artists: Artist[];
  artistNames: string;
  thumbnail: string;
  thumbnailM: string;
  duration: number;
  streamingStatus?: number;
  isWorldWide?: boolean;
  link?: string;
  mvlink?: string;
}

export interface Artist {
  id: string;
  name: string;
  link: string;
  spotlight: boolean;
  alias: string;
  thumbnail: string;
  thumbnailM: string;
  playlistId?: string;
}

export interface Album {
  encodeId: string;
  title: string;
  thumbnail: string;
  thumbnailM: string;
  releaseDate: number;
  artists: Artist[];
  description?: string;
  song?: {
    items: Song[];
    total: number;
  };
}

export interface Playlist {
  encodeId: string;
  title: string;
  thumbnail: string;
  thumbnailM: string;
  description?: string;
  artists?: Artist[];
  song?: {
    items: Song[];
    total: number;
  };
  like?: number;
  listen?: number;
  createdAt?: number;
}

// Firestore Playlist (user's custom playlist)
export interface UserPlaylist {
  playlistId: string;
  userId: string;
  name: string;
  description?: string;
  songs: string[]; // Array of song IDs
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
}

// Favorites
export interface Favorite {
  userId: string;
  songId: string;
  addedAt: Date;
}

// Listening History
export interface ListeningHistory {
  userId: string;
  songId: string;
  playedAt: Date;
  duration: number; // seconds listened
}

// User Statistics
export interface UserStats {
  userId: string;
  totalListens: number;
  topSongs: Array<{
    songId: string;
    count: number;
  }>;
  topArtists: Array<{
    artistId: string;
    count: number;
  }>;
  updatedAt: Date;
}

// Player State
export interface PlayerState {
  currentSong: Song | null;
  currentIndex: number;
  queue: Song[];
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  volume: number;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}

// Chart types
export interface ChartItem {
  encodeId: string;
  title: string;
  alias: string;
  artists: Artist[];
  thumbnail: string;
  thumbnailM: string;
  duration: number;
  rank: number;
  rankStatus: 'UP' | 'DOWN' | 'NONE';
  score: number;
}

export interface Chart {
  RTChart: {
    items: ChartItem[];
    chart: {
      times: Array<{
        hour: string;
      }>;
      minScore: number;
      maxScore: number;
    };
  };
  weekChart: {
    vn: Playlist;
    us: Playlist;
    korea: Playlist;
  };
}

// Search types
export interface SearchResult {
  songs: Song[];
  playlists: Playlist[];
  artists: Artist[];
  videos: any[];
}

// API Response types
export interface APIResponse<T> {
  err: number;
  msg: string;
  data: T;
}
