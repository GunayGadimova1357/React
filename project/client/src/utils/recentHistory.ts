export interface RecentArtist {
  id: string;
  name: string;
  image: string;
  timestamp: number;
}

export interface RecentPlaylist {
  id: string;
  name: string;
  image: string;
  timestamp: number;
}

const RECENT_ARTISTS_KEY = "recent-artists";
const RECENT_PLAYLISTS_KEY = "recent-playlists";
const MAX_RECENT_ITEMS = 6;

export const recentHistory = {
  addArtist: (artist: { id: string; name: string; image: string }) => {
    try {
      const stored = localStorage.getItem(RECENT_ARTISTS_KEY);
      const artists: RecentArtist[] = stored ? JSON.parse(stored) : [];
      
      // Удаляем если уже есть
      const filtered = artists.filter(a => a.id !== artist.id);
      
      // Добавляем в начало
      const updated = [
        { ...artist, timestamp: Date.now() },
        ...filtered
      ].slice(0, MAX_RECENT_ITEMS);
      
      localStorage.setItem(RECENT_ARTISTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save recent artist:", err);
    }
  },

  addPlaylist: (playlist: { id: string; name: string; image: string }) => {
    try {
      const stored = localStorage.getItem(RECENT_PLAYLISTS_KEY);
      const playlists: RecentPlaylist[] = stored ? JSON.parse(stored) : [];
      
      // Удаляем если уже есть
      const filtered = playlists.filter(p => p.id !== playlist.id);
      
      // Добавляем в начало
      const updated = [
        { ...playlist, timestamp: Date.now() },
        ...filtered
      ].slice(0, MAX_RECENT_ITEMS);
      
      localStorage.setItem(RECENT_PLAYLISTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save recent playlist:", err);
    }
  },

  getRecentArtists: (): RecentArtist[] => {
    try {
      const stored = localStorage.getItem(RECENT_ARTISTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to get recent artists:", err);
      return [];
    }
  },

  getRecentPlaylists: (): RecentPlaylist[] => {
    try {
      const stored = localStorage.getItem(RECENT_PLAYLISTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to get recent playlists:", err);
      return [];
    }
  },

  getAllRecent: (): { artists: RecentArtist[]; playlists: RecentPlaylist[] } => {
    return {
      artists: recentHistory.getRecentArtists(),
      playlists: recentHistory.getRecentPlaylists(),
    };
  },

  clearAll: () => {
    try {
      localStorage.removeItem(RECENT_ARTISTS_KEY);
      localStorage.removeItem(RECENT_PLAYLISTS_KEY);
    } catch (err) {
      console.error("Failed to clear recent history:", err);
    }
  },
};
