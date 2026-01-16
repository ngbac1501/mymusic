// ZingMP3 API Service
// Sử dụng backend proxy server để gọi ZingMP3 API
// Backend sử dụng package zingmp3-api từ: https://github.com/whoant/ZingMp3API

import axios from 'axios';
import type { Song, Artist, Playlist, Chart, SearchResult, ChartItem } from '@/types';

// Backend API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Axios instance với config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache for backend health status
let backendHealthCache: { status: 'healthy' | 'unhealthy'; timestamp: number } | null = null;
const HEALTH_CHECK_INTERVAL = 60000; // 1 minute

/**
 * Check if backend server is healthy
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    // Use cached result if fresh
    if (backendHealthCache && Date.now() - backendHealthCache.timestamp < HEALTH_CHECK_INTERVAL) {
      return backendHealthCache.status === 'healthy';
    }

    const response = await axios.get(`${API_BASE.replace('/api', '')}/health`, {
      timeout: 5000,
    });

    const isHealthy = response.status === 200;
    backendHealthCache = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: Date.now(),
    };

    return isHealthy;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    backendHealthCache = {
      status: 'unhealthy',
      timestamp: Date.now(),
    };
    return false;
  }
}

/**
 * Lấy thông tin đầy đủ bài hát theo ID
 * @param songId - ID bài hát (ví dụ: 'ZWBOW9CO' từ URL zingmp3.vn/bai-hat/.../ZWBOW9CO.html)
 * 
 * Note: Có fallback nếu backend fail - sẽ return minimal song data
 */
export async function getSong(songId: string): Promise<Song> {
  // Create minimal fallback data first
  const createFallback = (id: string) => ({
    encodeId: id,
    title: `Song ${id}`,
    alias: id,
    artists: [],
    artistNames: '',
    thumbnail: '',
    thumbnailM: '',
    duration: 0,
  });

  try {
    console.log(`🔄 Fetching song info for ${songId}...`);
    const { data } = await api.get(`/song/${songId}`, { timeout: 8000 });
    
    if (!data) {
      console.warn(`⚠️ Backend returned empty data for ${songId}`);
      return createFallback(songId);
    }

    console.log(`✅ Got song data for ${songId}:`, data.title || data.encodeId);

    // Map response từ backend sang Song type
    return {
      encodeId: data.encodeId || songId,
      title: data.title || `Song ${songId}`,
      alias: data.alias || songId,
      artists: data.artists || [],
      artistNames: data.artistsNames || data.artists?.map((a: any) => a.name).join(', ') || '',
      thumbnail: data.thumbnail || data.thumbnailM || '',
      thumbnailM: data.thumbnailM || data.thumbnail || '',
      duration: data.duration || 0,
      streamingStatus: data.streamingStatus,
      isWorldWide: data.isWorldWide,
      link: data.link,
      mvlink: data.mvlink,
    };
  } catch (error: any) {
    console.warn(`⚠️ Failed to fetch song ${songId}:`, error.message);
    console.log(`📌 Returning fallback data for ${songId}`);
    
    // Return fallback - this allows playlists to work even if backend is down
    return createFallback(songId);
  }
}

/**
 * Lấy streaming URL cho bài hát
 */
export async function getStreamingUrl(songId: string): Promise<string> {
  try {
    const { data } = await api.get(`/song/${songId}`);

    console.log('Song data:', { songId, hasStreaming: !!data.streaming });

    // Backend trả về full info bao gồm streaming URL
    if (data.streaming) {
      // Ưu tiên 320kbps, nhưng skip nếu là "VIP" (bị restrict)
      let url = '';

      if (data.streaming['320'] && data.streaming['320'] !== 'VIP') {
        url = data.streaming['320'];
      } else if (data.streaming['128']) {
        url = data.streaming['128'];
      }

      if (!url) {
        console.warn('No streaming URL available for song:', songId);
        throw new Error('Không có URL phát nhạc cho bài hát này');
      }
      console.log('Streaming URL found:', url.substring(0, 50) + '...');
      return url;
    }

    console.warn('No streaming data for song:', songId);
    throw new Error('Bài hát này không có sẵn để phát');
  } catch (error) {
    console.error('Error getting streaming URL:', error);
    throw error;
  }
}

/**
 * Tìm kiếm
 * @param query - Từ khóa tìm kiếm
 * @param _type - Loại tìm kiếm (hiện tại backend search tất cả)
 */
export async function search(query: string, _type: 'song' | 'playlist' | 'artist' | 'all' = 'all'): Promise<SearchResult> {
  try {
    const { data } = await api.get('/search', { params: { q: query } });

    // Map response sang SearchResult type
    return {
      songs: data.songs || [],
      playlists: data.playlists || [],
      artists: data.artists || [],
      videos: data.videos || [],
    };
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
}

/**
 * Lấy chart home (BXH tổng hợp)
 */
export async function getChartHome(): Promise<Chart> {
  try {
    const { data } = await api.get('/chart');
    return data;
  } catch (error) {
    console.error('Error getting chart home:', error);
    throw error;
  }
}

/**
 * Lấy Top 100
 */
export async function getTop100(): Promise<Playlist[]> {
  try {
    const { data } = await api.get('/top100');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error getting top 100:', error);
    throw error;
  }
}

/**
 * Lấy thông tin ca sĩ
 * @param artistId - Tên ca sĩ hoặc ID (ví dụ: 'sontungmtp')
 */
export async function getArtist(artistId: string): Promise<Artist & { songs: Song[]; playlists: Playlist[] }> {
  try {
    const { data } = await api.get(`/artist/${artistId}`);

    return {
      id: data.id || artistId,
      name: data.name || '',
      link: data.link || '',
      spotlight: data.spotlight || false,
      alias: data.alias || artistId,
      thumbnail: data.thumbnail || data.thumbnailM || '',
      thumbnailM: data.thumbnailM || data.thumbnail || '',
      playlistId: data.playlistId,
      songs: data.sections?.find((s: any) => s.sectionType === 'song')?.items || [],
      playlists: data.sections?.find((s: any) => s.sectionType === 'playlist')?.items || [],
    };
  } catch (error) {
    console.error('Error getting artist:', error);
    throw error;
  }
}

/**
 * Lấy danh sách bài hát của ca sĩ
 */
export async function getArtistSongs(artistId: string, _page: number = 1, _count: number = 20): Promise<Song[]> {
  try {
    const { data } = await api.get(`/artist/${artistId}`);
    const songSection = data.sections?.find((s: any) => s.sectionType === 'song');
    return songSection?.items || [];
  } catch (error) {
    console.error('Error getting artist songs:', error);
    throw error;
  }
}

/**
 * Lấy thông tin playlist/album
 * @param playlistId - ID playlist/album (ví dụ: 'ZWZB96C8' từ URL zingmp3.vn/album/.../ZWZB96C8.html)
 */
export async function getPlaylist(playlistId: string): Promise<Playlist> {
  try {
    const { data } = await api.get(`/playlist/${playlistId}`);

    return {
      encodeId: data.encodeId || playlistId,
      title: data.title || '',
      thumbnail: data.thumbnail || data.thumbnailM || '',
      thumbnailM: data.thumbnailM || data.thumbnail || '',
      description: data.description,
      artists: data.artists || [],
      song: data.song || { items: [], total: 0 },
      like: data.like,
      listen: data.listen,
      createdAt: data.createdAt,
    };
  } catch (error) {
    console.error('Error getting playlist:', error);
    throw error;
  }
}

/**
 * Lấy bài hát mới phát hành
 */
export async function getNewReleases(): Promise<Song[]> {
  try {
    const { data } = await api.get('/new-releases');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error getting new releases:', error);
    // Trả về array rỗng thay vì throw để tránh crash UI
    return [];
  }
}

/**
 * Lấy trang chủ
 * @param page - Số trang (mặc định: 1)
 */
export async function getHome(page: number = 1): Promise<any> {
  try {
    const { data } = await api.get('/home', { params: { page } });
    return data;
  } catch (error) {
    console.error('Error getting home:', error);
    throw error;
  }
}

/**
 * Lấy bài hát trending
 */
export async function getTrendingSongs(): Promise<ChartItem[]> {
  try {
    const { data } = await api.get('/trending');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error getting trending songs:', error);
    // Trả về array rỗng thay vì throw để tránh crash UI
    return [];
  }
}

/**
 * Lấy đề xuất bài hát
 */
export async function getRecommendations(_songId?: string): Promise<Song[]> {
  try {
    const { data } = await api.get('/recommendations');

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item: any) => ({
      encodeId: item.encodeId,
      title: item.title,
      alias: item.alias,
      artists: item.artists,
      artistNames: item.artistsNames || item.artists?.map((a: any) => a.name).join(', ') || '',
      thumbnail: item.thumbnail,
      thumbnailM: item.thumbnailM,
      duration: item.duration,
    }));
  } catch (error) {
    console.error('Error getting recommendations:', error);
    // Trả về array rỗng thay vì throw để tránh crash UI
    return [];
  }
}

/**
 * Lấy lời bài hát
 * @param songId - ID bài hát
 */
export async function getLyric(songId: string): Promise<any> {
  try {
    const { data } = await api.get(`/lyric?id=${songId}`);
    return data.data;
  } catch (error) {
    console.error('Error getting lyric:', error);
    return null;
  }
}
