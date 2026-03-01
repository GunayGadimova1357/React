import React, {
  createContext,
  useRef,
  ReactNode,
  RefObject,
  useContext,
  useState,
  useEffect,
} from "react";
import { songApi } from "@/api/songApi";
import { addPlay } from "@/api/playApi";
import { UiSong, mapSongToUi } from "@/mappers/musicMappers";
import { recentHistory } from "@/utils/recentHistory";
import { artistApi } from "@/api/artistsApi";
import { libraryApi } from "@/api/libraryApi";

type RepeatMode = "none" | "all" | "one";

interface TimeType {
  currentTime: { second: number; minute: number };
  totalTime: { second: number; minute: number };
}

interface PlayerContextType {
  audioRef: RefObject<HTMLAudioElement | null>;
  seekBg: RefObject<HTMLDivElement | null>;
  seekBar: RefObject<HTMLDivElement | null>;
  track: UiSong | null;
  tracks: UiSong[];
  playStatus: boolean;
  time: TimeType;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;

  setTrack: (track: UiSong | null) => void;
  setTracks: (tracks: UiSong[]) => void;
  play: () => void;
  pause: () => void;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  playWithId: (id: string, customTracks?: UiSong[]) => Promise<void>;

  seekSong: (e: any) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  changeVolume: (e: any) => void;
  formatTime: (min: number, sec: number) => string;
  toggleLike: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);


export const PlayerContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekBg = useRef<HTMLDivElement>(null);
  const seekBar = useRef<HTMLDivElement>(null);

  const [tracks, setTracks] = useState<UiSong[]>([]);
  const [track, setTrack] = useState<UiSong | null>(null);

  const [playStatus, setPlayStatus] = useState(false);
  const [volume, setVolume] = useState(
    Number(localStorage.getItem("player-volume")) || 0.7
  );
  const [isMuted, setIsMuted] = useState(false);

  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");

  const [time, setTime] = useState<TimeType>({
    currentTime: { minute: 0, second: 0 },
    totalTime: { minute: 0, second: 0 },
  });

  // Play Tracking (msPlayed)
  const playStartedAtRef = useRef<number | null>(null);
  const playSongIdRef = useRef<string | null>(null);
  const lastSentSongIdRef = useRef<string | null>(null);
  const lastTrackIdRef = useRef<string | null>(null);

  const sendPlayIfNeeded = async () => {
    const songId = playSongIdRef.current;
    const startedAt = playStartedAtRef.current;

    playSongIdRef.current = null;
    playStartedAtRef.current = null;

    if (!songId || !startedAt) return;

    let msPlayed = Date.now() - startedAt;

    if (msPlayed < 5000) return; // < 5 секунд не пишем
    if (msPlayed > 60 * 60 * 1000) msPlayed = 60 * 60 * 1000; // 1 час

    if (lastSentSongIdRef.current === songId && msPlayed < 8000) return;
    lastSentSongIdRef.current = songId;

    try {
      await addPlay(songId, msPlayed);
    } catch (e) {
      console.error("AddPlay failed:", e);
    }
  };

  const startPlayTracking = (songId: string) => {
    playSongIdRef.current = songId;
    playStartedAtRef.current = Date.now();
  };

  const play = async () => {
    if (audioRef.current && track) {
      try {
        await audioRef.current.play();
        setPlayStatus(true);

        // старт трекинга
        startPlayTracking(track.id);
      } catch (err) {
        console.warn("Autoplay blocked. Waiting for user interaction.");
        setPlayStatus(false);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);

      // стоп + отправка msPlayed
      sendPlayIfNeeded();
    }
  };

  const toggleShuffle = () => setIsShuffle((prev) => !prev);
  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === "none") return "all";
      if (prev === "all") return "one";
      return "none";
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await songApi.getAll();
        const ui = data.map(mapSongToUi);
        let finalTracks = ui.length > 0 ? ui : mockTracks;

        // Загружаем saved songs, если пользователь авторизован
        try {
          const savedSongs = await libraryApi.getSavedSongs();
          const savedIds = new Set(savedSongs.map(s => s.id));
          finalTracks = finalTracks.map(t => ({ ...t, isLiked: savedIds.has(t.id) }));
        } catch (err) {
          // Если не авторизован или ошибка, оставляем isLiked undefined/false
          console.warn("Failed to load saved songs:", err);
        }

        setTracks(finalTracks);
      } catch (err) {
        console.error("Failed to fetch songs:", err);
        setTracks(mockTracks);
      }
    })();
  }, []);

  const playWithId = async (id: string, customTracks?: UiSong[]) => {
    if (track && track.id === id) {
      if (playStatus) {
        pause();
      } else {
        play();
      }
      return;
    }

    if (playStatus) {
      await sendPlayIfNeeded();
    }

    const targetTracks = customTracks || tracks;
    if (customTracks) setTracks(customTracks);

    const found = targetTracks.find((x) => x.id === id);
    if (!found) return;

    setTrack(found);

    if (audioRef.current) {
      audioRef.current.src = found.audioUrl;
      audioRef.current.load();
      play();
    }
  };

  const next = async () => {
    if (!track || tracks.length === 0) return;

    if (playStatus) {
      await sendPlayIfNeeded();
    }

    if (repeatMode === "one") {
      if (audioRef.current) audioRef.current.currentTime = 0;
      play();
      return;
    }

    const idx = tracks.findIndex((x) => x.id === track.id);
    let nextIndex;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);

      if (nextIndex === idx && tracks.length > 1) {
        nextIndex = (nextIndex + 1) % tracks.length;
      }
    } else {
      nextIndex = idx + 1;
      if (nextIndex >= tracks.length) {
        if (repeatMode === "all") {
          nextIndex = 0;
        } else {
          pause();
          return;
        }
      }
    }

    setTrack(tracks[nextIndex]);
  };

  const previous = async () => {
    if (!audioRef.current || !track || tracks.length === 0) return;

    if (playStatus) {
      await sendPlayIfNeeded();
    }

    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      startPlayTracking(track.id);
    } else {
      const idx = tracks.findIndex((x) => x.id === track.id);
      const prevIndex = idx <= 0 ? tracks.length - 1 : idx - 1;
      setTrack(tracks[prevIndex]);
    }
  };

  useEffect(() => {
    if (!track || !audioRef.current) {
      lastTrackIdRef.current = null;
      return;
    }

    if (lastTrackIdRef.current !== track.id) {
      lastTrackIdRef.current = track.id;
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.id]);

  // Сохраняем артиста в историю когда трек начинает играть
  useEffect(() => {
    if (track && track.artistId && track.artist && playStatus) {
      artistApi
        .getArtistProfile(track.artistId)
        .then((artist) => {
          recentHistory.addArtist({
            id: track.artistId!,
            name: track.artist,
            image: artist.photoUrl || track.image || "",
          });
        })
        .catch(() => {
          recentHistory.addArtist({
            id: track.artistId!,
            name: track.artist,
            image: track.image || "",
          });
        });
    }
  }, [track?.id, playStatus]);

  const seekSong = (e: any) => {
    if (!audioRef.current || !seekBg.current) return;
    const rect = seekBg.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const offset = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const percentage = offset / rect.width;

    if (isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  const changeVolume = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const value = Math.min(
      Math.max((clientX - rect.left) / rect.width, 0),
      1
    );
    setVolume(value);
    localStorage.setItem("player-volume", value.toString());
    setIsMuted(false);
  };

  const formatTime = (min: number, sec: number) =>
    `${min}:${sec.toString().padStart(2, "0")}`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!audio.duration || !seekBar.current) return;

      const progress = (audio.currentTime / audio.duration) * 100;
      seekBar.current.style.width = `${progress}%`;

      setTime({
        currentTime: {
          minute: Math.floor(audio.currentTime / 60),
          second: Math.floor(audio.currentTime % 60),
        },
        totalTime: {
          minute: Math.floor(audio.duration / 60),
          second: Math.floor(audio.duration % 60),
        },
      });
    };

    const onEnded = async () => {
      // перед переходом — отправим play
      await sendPlayIfNeeded();
      await next();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, tracks, isShuffle, repeatMode]);

  useEffect(() => {
    const handler = () => {
      sendPlayIfNeeded();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLike = async () => {
    if (!track) return;
    const isCurrentlyLiked = track.isLiked || false;
    try {
      if (isCurrentlyLiked) {
        await libraryApi.unsaveSong(track.id);
      } else {
        await libraryApi.saveSong(track.id);
      }
      // Обновляем isLiked в track
      setTrack((prev) => prev ? { ...prev, isLiked: !isCurrentlyLiked } : null);
      // Также обновляем в tracks
      setTracks((prevTracks) =>
        prevTracks.map((t) =>
          t.id === track.id ? { ...t, isLiked: !isCurrentlyLiked } : t
        )
      );
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        seekBg,
        seekBar,
        track,
        tracks,
        playStatus,
        time,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        setTrack,
        setTracks,
        play,
        pause,
        next,
        previous,
        playWithId,
        seekSong,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        changeVolume,
        formatTime,
        toggleLike,
      }}
    >
      {children}
      <audio ref={audioRef} src={track?.audioUrl} preload="auto" />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer error");
  return ctx;
};
