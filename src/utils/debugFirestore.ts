/**
 * Debug utilities to check Firestore data structure
 * Usage: In browser console, call window.debugPlaylist(playlistId)
 */

import { getPlaylist, getUserPlaylists } from '@/services/firestore';
import { getSong } from '@/services/zingmp3';

export async function debugPlaylist(playlistId: string) {
  console.log(`\n🔍 Debugging Playlist: ${playlistId}`);
  try {
    const playlist = await getPlaylist(playlistId);
    console.log('📋 Playlist data:', playlist);
    
    if (!playlist) {
      console.error('❌ Playlist not found');
      return;
    }

    console.log(`\n📊 Playlist Summary:
    - Name: ${playlist.name}
    - Songs count: ${playlist.songs?.length || 0}
    - Songs array: ${JSON.stringify(playlist.songs, null, 2)}
    `);

    if (playlist.songs && playlist.songs.length > 0) {
      console.log(`\n🎵 Attempting to fetch first song: ${playlist.songs[0]}`);
      try {
        const firstSong = await getSong(playlist.songs[0]);
        console.log('✅ First song data:', firstSong);
      } catch (error) {
        console.error('❌ Failed to fetch first song:', error);
      }
    }
  } catch (error) {
    console.error('❌ Error debugging playlist:', error);
  }
}

export async function debugAllPlaylists(userId: string) {
  console.log(`\n🔍 Debugging All Playlists for user: ${userId}`);
  try {
    const playlists = await getUserPlaylists(userId);
    console.log(`📊 Found ${playlists.length} playlists`);
    
    playlists.forEach((playlist, index) => {
      console.log(`
  ${index + 1}. ${playlist.name}
     - ID: ${playlist.playlistId}
     - Songs: ${playlist.songs?.length || 0}
     - Song IDs: ${JSON.stringify(playlist.songs)}
      `);
    });
  } catch (error) {
    console.error('❌ Error debugging playlists:', error);
  }
}

// Attach to window for browser console access
if (typeof window !== 'undefined') {
  (window as any).debugPlaylist = debugPlaylist;
  (window as any).debugAllPlaylists = debugAllPlaylists;
}
