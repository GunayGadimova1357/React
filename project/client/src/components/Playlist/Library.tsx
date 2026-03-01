import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { IoIosArrowBack } from "react-icons/io";
import { FiSearch, FiPlus, FiMoreVertical } from "react-icons/fi";
import { LuLayoutGrid } from "react-icons/lu";
import { Music, Disc, Play, Heart, ListMusic, Trash2 } from "lucide-react";

import { libraryApi, SavedAlbum, SavedSong } from "@/api/libraryApi";
import { playlistsApi, PlaylistInfo } from "@/api/playlistsApi";
import { useAuth } from "@/hooks/useAuth";
import { usePlayer } from "@/context/PlayerContext";
import { EmptyState } from "../VisualHelper";
import PlaylistModal from "../modals/PlaylistModal";

type LibraryFilter = "playlists" | "albums" | "songs";

const Library: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userName } = useAuth();
  const { playWithId } = usePlayer();

  const [albums, setAlbums] = useState<SavedAlbum[]>([]);
  const [songs, setSongs] = useState<SavedSong[]>([]);
  const [myPlaylists, setMyPlaylists] = useState<PlaylistInfo[]>([]);
  
  const [filter, setFilter] = useState<LibraryFilter>("playlists");
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [activeMenu, setActiveMenu] = useState<{ id: string, type: LibraryFilter } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthorized = !!userName;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchLibraryData = async () => {
    if (!isAuthorized) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [albumsData, songsData, playlistsData] = await Promise.all([
        libraryApi.getSavedAlbums(),
        libraryApi.getSavedSongs(),
        playlistsApi.getMyPlaylists()
      ]);

      setAlbums(albumsData);
      setSongs(songsData);
      setMyPlaylists(playlistsData);
    } catch (err) {
      console.error("Failed to load library data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, [isAuthorized]);

  const handleDelete = async (id: string, type: LibraryFilter) => {
    try {
      if (type === 'playlists') {
        await playlistsApi.delete(id);
        setMyPlaylists(prev => prev.filter(p => p.id !== id));
        toast.success(t("playlist.success.deleted"));
      } else if (type === 'albums') {
        await libraryApi.unsaveAlbum(id);
        setAlbums(prev => prev.filter(a => a.id !== id));
        toast.success(t("library.success.album_removed"));
      } else if (type === 'songs') {
        await libraryApi.unsaveSong(id);
        setSongs(prev => prev.filter(s => s.id !== id));
        toast.success(t("library.success.song_removed"));
      }
      setActiveMenu(null);
    } catch (err) {
      toast.error(t("common.errors.action_failed"));
    }
  };

  const renderEmptyState = () => {
    switch (filter) {
      case 'playlists':
        return <EmptyState title={t("library.empty.playlists_title")} message={t("library.empty.playlists_message")} icon={ListMusic} />;
      case 'albums':
        return <EmptyState title={t("library.empty.albums_title")} message={t("library.empty.albums_message")} icon={Disc} />;
      case 'songs':
        return <EmptyState title={t("library.empty.songs_title")} message={t("library.empty.songs_message")} icon={Heart} />;
      default: return null;
    }
  };

  const MoreButton = ({ id, type }: { id: string, type: LibraryFilter }) => (
    <button 
      onClick={(e) => { 
        e.stopPropagation(); 
        setActiveMenu({ id, type }); 
      }}
      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
    >
      <FiMoreVertical size={18} />
    </button>
  );

  return (
    <div className="w-full h-full bg-[#121212] text-zinc-100 p-4 sm:p-6 overflow-auto custom-scrollbar">
      
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-90">
            <IoIosArrowBack size={24} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold truncate">{t("library.title")}</h1>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center justify-center p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-90">
          <FiPlus size={26} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar whitespace-nowrap">
          {(['playlists', 'albums', 'songs'] as LibraryFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                filter === f ? "bg-zinc-100 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              {t(`library.filters.${f}`)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
           {[...Array(14)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-3">
                <div className="aspect-square w-full bg-zinc-800 rounded-md" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
              </div>
           ))}
        </div>
      ) : !isAuthorized ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <EmptyState title={t("library.unauthorized_title")} message={t("library.login_required")} icon={Music} />
          <button onClick={() => navigate("/login")} className="mt-6 w-full max-w-xs py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition">
            {t("signin.sign_in")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8">
          
          {filter === 'playlists' && myPlaylists.map((playlist) => (
            <div key={playlist.id} className="group relative flex flex-col gap-2">
              <div onClick={() => navigate(`/playlist/${playlist.id}`)} className="relative aspect-square w-full rounded-md overflow-hidden bg-zinc-800 shadow-md cursor-pointer">
                {playlist.coverUrl ? (
                  <img src={playlist.coverUrl} alt={playlist.title} className="w-full h-full object-cover transition sm:group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900">
                    <Music className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-400" />
                  </div>
                )}
                <MoreButton id={playlist.id} type="playlists" />
              </div>

              {activeMenu?.id === playlist.id && (
                <div ref={menuRef} className="absolute right-0 top-10 z-50 min-w-[160px] bg-[#282828] border border-white/10 rounded-md shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                  <button onClick={() => handleDelete(playlist.id, 'playlists')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors">
                    <Trash2 size={16} /> {t("common.delete")}
                  </button>
                </div>
              )}

              <div className="px-1">
                <h3 className="text-xs sm:text-sm font-bold truncate group-hover:text-white leading-tight">{playlist.title}</h3>
                <p className="text-[10px] sm:text-xs font-medium text-zinc-400 mt-0.5">
                    {playlist.songsCount} {t("playlist.tracks_count", { count: playlist.songsCount })}
                </p>
              </div>
            </div>
          ))}

          {filter === 'albums' && albums.map((album) => (
            <div key={album.id} className="group relative flex flex-col gap-2">
              <div onClick={() => navigate(`/album/${album.id}`)} className="relative aspect-square w-full rounded-md overflow-hidden bg-zinc-800 shadow-md cursor-pointer">
                <img src={album.coverUrl} alt={album.albumName} className="w-full h-full object-cover transition sm:group-hover:scale-105" />
                <MoreButton id={album.id} type="albums" />
              </div>

              {activeMenu?.id === album.id && (
                <div ref={menuRef} className="absolute right-0 top-10 z-50 min-w-[160px] bg-[#282828] border border-white/10 rounded-md shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                  <button onClick={() => handleDelete(album.id, 'albums')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10 transition-colors">
                    <Trash2 size={16} /> {t("library.actions.unsave")}
                  </button>
                </div>
              )}

              <div className="px-1">
                <h3 className="text-xs sm:text-sm font-bold truncate group-hover:text-white leading-tight">{album.albumName}</h3>
                <p className="text-[10px] sm:text-xs font-medium text-zinc-400 mt-0.5">{t("library.filters.albums")}</p>
              </div>
            </div>
          ))}

          {filter === 'songs' && songs.map((song) => (
            <div key={song.id} className="group relative flex flex-col gap-2">
              <div onClick={() => playWithId(song.id)} className="relative aspect-square w-full rounded-md overflow-hidden bg-zinc-800 shadow-md cursor-pointer">
                <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 sm:group-hover:opacity-100 flex items-center justify-center transition">
                   <Play size={24} fill="white" className="text-white" />
                </div>
                <MoreButton id={song.id} type="songs" />
              </div>

              {activeMenu?.id === song.id && (
                <div ref={menuRef} className="absolute right-0 top-10 z-50 min-w-[160px] bg-[#282828] border border-white/10 rounded-md shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                  <button onClick={() => handleDelete(song.id, 'songs')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10 transition-colors">
                    <Trash2 size={16} /> {t("library.actions.unsave")}
                  </button>
                </div>
              )}

              <div className="px-1">
                <h3 className="text-xs sm:text-sm font-bold truncate group-hover:text-white leading-tight">{song.title}</h3>
                <p className="text-[10px] sm:text-xs font-medium text-zinc-400 mt-0.5">{t("library.filters.songs")}</p>
              </div>
            </div>
          ))}

          {((filter === 'playlists' && myPlaylists.length === 0) || 
            (filter === 'albums' && albums.length === 0) || 
            (filter === 'songs' && songs.length === 0)) && (
            <div className="col-span-full py-8">
               {renderEmptyState()}
            </div>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <PlaylistModal onClose={() => setIsCreateModalOpen(false)} onPlaylistCreated={fetchLibraryData} />
      )}
    </div>
  );
};

export default Library;