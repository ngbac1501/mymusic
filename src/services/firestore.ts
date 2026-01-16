// Firestore Service
// Quản lý các thao tác với Firestore database

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { COLLECTIONS } from '@/constants';
import type {
  User,
  UserPlaylist,
  Favorite,
  ListeningHistory,
  UserStats,
} from '@/types';

// Helper để convert Firestore Timestamp sang Date
function timestampToDate(timestamp: any): Date {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
}

// ==================== USER ====================

/**
 * Lấy thông tin user
 */
export async function getUser(userId: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
  if (!userDoc.exists()) return null;

  const data = userDoc.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as User;
}

/**
 * Tạo hoặc cập nhật user
 */
export async function setUser(userId: string, userData: Partial<User>): Promise<void> {
  await setDoc(
    doc(db, COLLECTIONS.USERS, userId),
    {
      ...userData,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
}

// ==================== PLAYLISTS ====================

/**
 * Lấy tất cả playlists của user
 */
export async function getUserPlaylists(userId: string): Promise<UserPlaylist[]> {
  const q = query(
    collection(db, COLLECTIONS.PLAYLISTS),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  const playlists = snapshot.docs.map((doc) => ({
    playlistId: doc.id,
    ...doc.data(),
    createdAt: timestampToDate(doc.data().createdAt),
    updatedAt: timestampToDate(doc.data().updatedAt),
  })) as UserPlaylist[];

  // Sort by createdAt descending (newest first) on client-side
  return playlists.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Lấy playlist theo ID
 */
export async function getPlaylist(playlistId: string): Promise<UserPlaylist | null> {
  const playlistDoc = await getDoc(doc(db, COLLECTIONS.PLAYLISTS, playlistId));
  if (!playlistDoc.exists()) return null;

  const data = playlistDoc.data();
  return {
    playlistId: playlistDoc.id,
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as UserPlaylist;
}

/**
 * Tạo playlist mới
 */
export async function createPlaylist(
  userId: string,
  name: string,
  description?: string
): Promise<string> {
  const newPlaylist: Omit<UserPlaylist, 'playlistId'> = {
    userId,
    name,
    description,
    songs: [],
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.PLAYLISTS), {
    ...newPlaylist,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return docRef.id;
}

/**
 * Cập nhật playlist
 */
export async function updatePlaylist(
  playlistId: string,
  updates: Partial<UserPlaylist>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.PLAYLISTS, playlistId), {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Xóa playlist
 */
export async function deletePlaylist(playlistId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PLAYLISTS, playlistId));
}

/**
 * Thêm bài hát vào playlist
 */
export async function addSongToPlaylist(playlistId: string, songId: string): Promise<void> {
  const playlist = await getPlaylist(playlistId);
  if (!playlist) throw new Error('Playlist not found');

  // Ensure songs array exists
  const currentSongs = playlist.songs || [];
  
  if (!currentSongs.includes(songId)) {
    console.log(`📌 Adding song ${songId} to playlist ${playlistId}`);
    await updatePlaylist(playlistId, {
      songs: [...currentSongs, songId],
    });
    console.log(`✅ Song ${songId} added successfully`);
  } else {
    console.log(`⚠️ Song ${songId} already in playlist`);
  }
}

/**
 * Xóa bài hát khỏi playlist
 */
export async function removeSongFromPlaylist(playlistId: string, songId: string): Promise<void> {
  const playlist = await getPlaylist(playlistId);
  if (!playlist) throw new Error('Playlist not found');

  const currentSongs = playlist.songs || [];
  console.log(`📌 Removing song ${songId} from playlist ${playlistId}`);
  
  await updatePlaylist(playlistId, {
    songs: currentSongs.filter((id) => id !== songId),
  });
  
  console.log(`✅ Song ${songId} removed successfully`);
}

// ==================== FAVORITES ====================

/**
 * Lấy tất cả bài hát yêu thích của user
 */
export async function getFavorites(userId: string): Promise<Favorite[]> {
  const q = query(
    collection(db, COLLECTIONS.FAVORITES),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  const favorites = snapshot.docs.map((doc) => ({
    ...doc.data(),
    addedAt: timestampToDate(doc.data().addedAt),
  })) as Favorite[];

  // Sort by addedAt descending (newest first) on client-side
  return favorites.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
}

/**
 * Kiểm tra bài hát có trong favorites không
 */
export async function isFavorite(userId: string, songId: string): Promise<boolean> {
  const q = query(
    collection(db, COLLECTIONS.FAVORITES),
    where('userId', '==', userId),
    where('songId', '==', songId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

/**
 * Thêm vào favorites
 */
export async function addToFavorites(userId: string, songId: string): Promise<void> {
  const q = query(
    collection(db, COLLECTIONS.FAVORITES),
    where('userId', '==', userId),
    where('songId', '==', songId)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    await addDoc(collection(db, COLLECTIONS.FAVORITES), {
      userId,
      songId,
      addedAt: Timestamp.now(),
    });
  }
}

/**
 * Xóa khỏi favorites
 */
export async function removeFromFavorites(userId: string, songId: string): Promise<void> {
  const q = query(
    collection(db, COLLECTIONS.FAVORITES),
    where('userId', '==', userId),
    where('songId', '==', songId)
  );
  const snapshot = await getDocs(q);

  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}

// ==================== LISTENING HISTORY ====================

/**
 * Lấy lịch sử nghe nhạc
 */
export async function getListeningHistory(
  userId: string,
  limitCount: number = 50
): Promise<ListeningHistory[]> {
  const q = query(
    collection(db, COLLECTIONS.LISTENING_HISTORY),
    where('userId', '==', userId),
    orderBy('playedAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    playedAt: timestampToDate(doc.data().playedAt),
  })) as ListeningHistory[];
}

/**
 * Thêm vào lịch sử
 */
export async function addToHistory(
  userId: string,
  songId: string,
  duration: number
): Promise<void> {
  await addDoc(collection(db, COLLECTIONS.LISTENING_HISTORY), {
    userId,
    songId,
    playedAt: Timestamp.now(),
    duration,
  });
}

// ==================== USER STATS ====================

/**
 * Lấy thống kê user
 */
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const statsDoc = await getDoc(doc(db, COLLECTIONS.USER_STATS, userId));
  if (!statsDoc.exists()) return null;

  const data = statsDoc.data();
  return {
    ...data,
    updatedAt: timestampToDate(data.updatedAt),
  } as UserStats;
}

/**
 * Cập nhật thống kê user
 */
export async function updateUserStats(
  userId: string,
  stats: Partial<UserStats>
): Promise<void> {
  await setDoc(
    doc(db, COLLECTIONS.USER_STATS, userId),
    {
      ...stats,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
}

// ==================== SEARCH HISTORY ====================

export interface SearchHistoryItem {
  id?: string;
  userId: string;
  query: string;
  searchedAt: Date;
}

/**
 * Lưu query tìm kiếm vào lịch sử
 */
export async function saveSearchQuery(userId: string, queryText: string): Promise<void> {
  // Kiểm tra xem query đã tồn tại chưa
  const q = query(
    collection(db, COLLECTIONS.SEARCH_HISTORY),
    where('userId', '==', userId),
    where('query', '==', queryText)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    // Thêm mới nếu chưa tồn tại
    await addDoc(collection(db, COLLECTIONS.SEARCH_HISTORY), {
      userId,
      query: queryText,
      searchedAt: Timestamp.now(),
    });
  } else {
    // Cập nhật timestamp nếu đã tồn tại
    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, {
      searchedAt: Timestamp.now(),
    });
  }
}

/**
 * Lấy lịch sử tìm kiếm
 */
export async function getSearchHistory(
  userId: string,
  limitCount: number = 10
): Promise<SearchHistoryItem[]> {
  const q = query(
    collection(db, COLLECTIONS.SEARCH_HISTORY),
    where('userId', '==', userId),
    orderBy('searchedAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    searchedAt: timestampToDate(doc.data().searchedAt),
  })) as SearchHistoryItem[];
}

/**
 * Xóa một item khỏi lịch sử tìm kiếm
 */
export async function deleteSearchHistoryItem(historyId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.SEARCH_HISTORY, historyId));
}

/**
 * Xóa toàn bộ lịch sử tìm kiếm
 */
export async function clearSearchHistory(userId: string): Promise<void> {
  const q = query(
    collection(db, COLLECTIONS.SEARCH_HISTORY),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);

  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}
