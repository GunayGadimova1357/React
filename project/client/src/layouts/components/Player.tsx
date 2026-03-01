import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  Heart,
  ChevronDown,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import useIsMobile from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";
import { libraryApi } from "@/api/libraryApi";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const Player = () => {
  const { t } = useTranslation();
  const { userName } = useAuth();
  const {
    track,
    setTrack,
    play,
    pause,
    next,
    previous,
    playStatus,
    time,
    seekBg,
    seekBar,
    seekSong,
    volume,
    isMuted,
    toggleMute,
    changeVolume,
    formatTime,
    audioRef,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    toggleLike,
  } = usePlayer();

  const isMobile = useIsMobile();
  const getPlayerScale = () =>
    Math.max(0.85, Math.min(window.innerWidth / 1024, 1));
  const [scale, setScale] = useState(getPlayerScale);
  const mobileControlSize = Math.round(40 * scale);
  const mobilePlayIconSize = Math.round(36 * scale);
  const mobileIconSize = Math.round(22 * scale);
  const mobileHeaderIconSize = Math.round(32 * scale);
  const mobileCloseIconSize = Math.round(24 * scale);
  const mobileHeartSize = Math.round(24 * scale);

  useEffect(() => {
    const handleResize = () => {
      setScale(getPlayerScale());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isAuthorized = !!userName;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const isLiked = track?.isLiked || false;

  const mobileSeekBar = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 70;

  const playerMeasureRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  const setPlayerSpaceVar = useCallback(() => {
    const el = playerMeasureRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    const bottom = parseFloat(styles.bottom || "0") || 0;
    const space = Math.ceil(rect.height + bottom);
    document.documentElement.style.setProperty("--player-space", `${space}px`);
  }, []);

  useEffect(() => {
    if (!track) {
      document.documentElement.style.setProperty("--player-space", "0px");
      return;
    }

    setPlayerSpaceVar();

    const el = playerMeasureRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => setPlayerSpaceVar());
    ro.observe(el);

    window.addEventListener("resize", setPlayerSpaceVar);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setPlayerSpaceVar);
    };
  }, [track, isExpanded, isMobile, setPlayerSpaceVar]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchEnd.current - touchStart.current;
    if (distance > minSwipeDistance) {
      setIsExpanded(false);
    }
  };

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    seekSong(e);
  };

  const handleMouseMove = useCallback(
    (e: any) => {
      if (isDragging) seekSong(e);
    },
    [isDragging, seekSong],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove, { passive: false });
      window.addEventListener("touchend", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      setIsFullscreen(true);
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setIsFullscreen(false);
        setIsClosing(false);
      }, 300);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsClosing(true);
        setTimeout(() => {
          setIsFullscreen(false);
          setIsClosing(false);
        }, 300);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isFullscreen]);

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      if (isFullscreen) {
        setIsClosing(true);
        setTimeout(() => {
          setIsFullscreen(false);
          setIsClosing(false);
        }, 300);
      }
      if (isExpanded) {
        setIsClosing(true);
        setTimeout(() => {
          setIsExpanded(false);
          setIsClosing(false);
        }, 300);
      }
    };

    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 50);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [isFullscreen, isExpanded]);

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const updateMobileProgress = () => {
      if (audio.duration && mobileSeekBar.current) {
        const progress = (audio.currentTime / audio.duration) * 100;
        mobileSeekBar.current.style.width = `${progress}%`;
      }
    };

    audio.addEventListener("timeupdate", updateMobileProgress);
    return () => audio.removeEventListener("timeupdate", updateMobileProgress);
  }, [track, audioRef]);

  const handleToggleLike = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!track) return;
    if (!isAuthorized) {
      toast.error(t("library.login_required"));
      return;
    }

    try {
      setIsLikeLoading(true);
      await toggleLike();
      toast.success(!isLiked ? t("library.song_added") : t("library.song_removed"));
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsLikeLoading(false);
    }
  };

  const renderRepeatIcon = (size: number) => {
    const commonClass = `${repeatMode !== "none" ? "text-white" : "text-zinc-700"} transition-all cursor-pointer`;
    if (repeatMode === "one") {
      return (
        <Repeat1 size={size} className={commonClass} onClick={toggleRepeat} />
      );
    }
    return (
      <Repeat size={size} className={commonClass} onClick={toggleRepeat} />
    );
  };

  if (isMobile) {
    if (!track) return null;

    return (
      <>
        {!isExpanded && (
          <div
            ref={playerMeasureRef}
            className={`fixed left-2 right-2 z-50 bg-zinc-900 backdrop-blur-xl border border-zinc-700/50 h-16 rounded-2xl flex items-center px-4 gap-4 shadow-xl transition-all duration-500 ease-out ${
              track ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
            style={{ bottom: 'calc(64px + var(--safe-area-inset-bottom))' }}
          >
            <div
              className="flex flex-1 items-center gap-3 min-w-0"
              onClick={(e) => {
                if (e.target.closest('button')) return;
                setIsClosing(false);
                setIsExpanded(true);
              }}
            >
              <img
                src={track.image}
                className="w-12 h-12 rounded-xl shadow-lg object-cover border border-zinc-700/30"
                alt=""
              />
              <div className="flex-1 truncate">
                <p className="text-sm font-semibold text-white truncate leading-tight">
                  {track.name}
                </p>
                <p className="text-xs text-zinc-400 truncate leading-tight">
                  {track.artist}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleLike}
                onMouseDown={(e) => e.preventDefault()}
                disabled={!track || isLikeLoading}
                className={`p-2 text-zinc-500 hover:text-white active:scale-90 transition-all ${
                  !track ? "opacity-40 cursor-not-allowed" : ""
                }`}
                title={
                  isLiked
                    ? t("library.actions.unsave")
                    : t("library.actions.save")
                }
              >
                <Heart
                  size={18}
                  className={
                    isLiked ? "fill-white text-white" : "text-zinc-500"
                  }
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playStatus ? pause() : play();
                }}
                className="p-2.5 text-white active:scale-90 transition-all hover:bg-white/10 rounded-lg"
              >
                {playStatus ? (
                  <Pause size={20} fill="white" />
                ) : (
                  <Play size={20} fill="white" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTrack(null);
                }}
                className="p-2 text-zinc-500 hover:text-white active:scale-90 transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-800 overflow-hidden rounded-b-2xl">
              <div
                ref={mobileSeekBar}
                className="h-full bg-white transition-all duration-300"
                style={{ width: "0%" }}
              />
            </div>
          </div>
        )}

        {isExpanded && (
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`fixed inset-0 z-[110] bg-zinc-900 flex flex-col touch-none transition-all duration-500 ease-out ${
              isClosing
                ? "animate-[slideDown_0.3s_ease-in]"
                : "animate-[slideUp_0.5s_ease-out]"
            }`}
            style={{
              padding:
                "calc(clamp(16px, 4vw, 24px) + var(--safe-area-inset-top)) clamp(16px, 4vw, 24px) calc(clamp(16px, 4vw, 24px) + var(--safe-area-inset-bottom)) clamp(16px, 4vw, 24px)",
            }}
          >
            <header className="flex justify-between items-center h-14 shrink-0">
              <button
                onClick={() => {
                  setIsClosing(true);
                  setTimeout(() => {
                    setIsExpanded(false);
                    setIsClosing(false);
                  }, 300);
                }}
                className="p-2 -ml-2 text-zinc-400 hover:text-white active:scale-90 transition-all"
              >
                <ChevronDown size={mobileHeaderIconSize} />
              </button>
              <p className="text-xs font-medium text-zinc-500">
                {t("player.nowPlaying")}
              </p>
              <button
                onClick={() => {
                  setIsClosing(true);
                  setTimeout(() => {
                    setIsExpanded(false);
                    setTrack(null);
                    setIsClosing(false);
                  }, 300);
                }}
                className="p-2 -mr-2 text-zinc-400 hover:text-white transition-all"
              >
                <X size={mobileCloseIconSize} />
              </button>
            </header>

            <div
              className={`flex-1 flex flex-col items-center justify-around py-4 overflow-hidden select-none transition-all duration-500 ${isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
            >
              <div
                className={`w-full max-w-[320px] aspect-square shrink-0 shadow-2xl transition-all duration-700 delay-100 ${isClosing ? "opacity-0 scale-90 translate-y-4" : "opacity-100 scale-100 translate-y-0"}`}
              >
                <img
                  src={track.image}
                  className="w-full h-full rounded-3xl object-cover border border-zinc-700/30 pointer-events-none"
                  alt=""
                />
              </div>

              <div
                className={`w-full text-left px-2 transition-all duration-500 delay-200 ${isClosing ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[clamp(20px,6vw,28px)] font-bold text-white leading-tight truncate mb-1">
                    {track.name}
                  </h2>
                  <button
                    type="button"
                    onClick={handleToggleLike}
                    onMouseDown={(e) => e.preventDefault()}
                    disabled={isLikeLoading}
                    className="p-2 text-zinc-500 hover:text-white active:scale-90 transition-all flex-shrink-0"
                    title={
                      isLiked
                        ? t("library.actions.unsave")
                        : t("library.actions.save")
                    }
                  >
                    <Heart
                      size={mobileHeartSize}
                      className={
                        isLiked ? "fill-white text-white" : "text-zinc-500"
                      }
                    />
                  </button>
                </div>
                <p className="text-[clamp(14px,4.5vw,18px)] text-zinc-400 mt-1">
                  {track.artist}
                </p>
              </div>

              <div
                className={`w-full space-y-8 px-2 transition-all duration-500 delay-300 ${isClosing ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
              >
                <div className="space-y-3">
                  <div
                    ref={seekBg}
                    onMouseDown={handleMouseDown}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e);
                    }}
                    className="relative w-full h-1.5 bg-zinc-800 rounded-full cursor-pointer group"
                  >
                    <div
                      ref={seekBar}
                      className="absolute top-0 left-0 h-full bg-white rounded-full transition-none"
                    >
                      <div className="absolute right-[-6px] top-[-5px] w-4 h-4 bg-white rounded-full shadow-lg border-2 border-zinc-800" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 tabular-nums font-medium">
                    <span>
                      {formatTime(
                        time.currentTime.minute,
                        time.currentTime.second,
                      )}
                    </span>
                    <span>
                      {formatTime(time.totalTime.minute, time.totalTime.second)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button onClick={toggleShuffle} className="p-2">
                    <Shuffle
                      size={mobileIconSize}
                      className={`${isShuffle ? "text-white" : "text-zinc-600"} transition-colors`}
                    />
                  </button>
                  <div className="flex items-center gap-8">
                    <button
                      onClick={previous}
                      className="p-3 text-white hover:scale-110 active:scale-95 transition-transform"
                    >
                      <SkipBack size={mobileControlSize} fill="currentColor" />
                    </button>
                    <button
                      onClick={playStatus ? pause : play}
                      className="w-[clamp(56px,18vw,80px)] h-[clamp(56px,18vw,80px)] rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform group hover:shadow-2xl"
                    >
                      {playStatus ? (
                        <Pause
                          size={mobilePlayIconSize}
                          className="text-zinc-900 fill-current"
                        />
                      ) : (
                        <Play
                          size={mobilePlayIconSize}
                          className="text-zinc-900 fill-current ml-1"
                        />
                      )}
                    </button>
                    <button
                      onClick={next}
                      className="p-3 text-white hover:scale-110 active:scale-95 transition-transform"
                    >
                      <SkipForward size={mobileControlSize} fill="currentColor" />
                    </button>
                  </div>
                  <button onClick={toggleRepeat} className="p-2">
                    {renderRepeatIcon(mobileIconSize)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <footer
        ref={playerMeasureRef}
        className={`fixed left-0 right-0 bottom-0 z-50 bg-black backdrop-blur-xl border-t border-zinc-700/50 h-20 md:h-24 transition-all duration-500 ease-out ${
          isFullscreen
            ? "opacity-0 pointer-events-none translate-y-full"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between px-4 md:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-4 w-[30%] min-w-0">
            {track ? (
              <div className="flex items-center gap-4 group animate-[fadeIn_0.5s_ease-out] min-w-0">
                <img
                  src={track.image}
                  className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl shadow-lg object-cover border border-zinc-700/30 group-hover:border-zinc-600/50 transition-all flex-shrink-0"
                  alt=""
                />
                <div className="truncate min-w-0">
                  <p className="text-xs md:text-sm font-semibold truncate hover:text-white/90 transition-colors">
                    {track.name}
                  </p>
                  <p className="text-[10px] md:text-xs text-zinc-400 truncate mt-0.5 hover:text-zinc-300 cursor-pointer transition-colors">
                    {track.artist}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleLike}
                  onMouseDown={(e) => e.preventDefault()}
                  disabled={isLikeLoading}
                  className="p-2 text-zinc-500 hover:text-white active:scale-90 transition-all flex-shrink-0"
                  title={
                    isLiked
                      ? t("library.actions.unsave")
                      : t("library.actions.save")
                  }
                >
                  <Heart
                    size={18}
                    className={
                      isLiked ? "fill-white text-white" : "text-zinc-500"
                    }
                  />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 opacity-60">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl bg-zinc-800/50 border border-zinc-700/30 flex-shrink-0 animate-pulse flex items-center justify-center">
                  <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded bg-zinc-700/50"></div>
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="h-3 md:h-3.5 w-32 md:w-40 bg-zinc-800/50 rounded animate-pulse"></div>
                  <div className="h-2.5 md:h-3 w-24 md:w-32 bg-zinc-800/50 rounded animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center flex-1 max-w-[45%] min-w-0">
            <div className="flex items-center gap-3 md:gap-5 lg:gap-7 mb-2 md:mb-3">
              <button
                onClick={toggleShuffle}
                disabled={!track}
                className={`transition-all ${track ? "cursor-pointer hover:scale-110 active:scale-95" : "opacity-20 cursor-not-allowed"}`}
              >
                <Shuffle
                  size={14}
                  className={`${isShuffle ? "text-white" : "text-zinc-500"} transition-colors md:hidden`}
                />
                <Shuffle
                  size={16}
                  className={`${isShuffle ? "text-white" : "text-zinc-500"} transition-colors hidden md:block lg:hidden`}
                />
                <Shuffle
                  size={18}
                  className={`${isShuffle ? "text-white" : "text-zinc-500"} transition-colors hidden lg:block`}
                />
              </button>
              <button
                onClick={previous}
                disabled={!track}
                className={`text-zinc-400 transition-all ${track ? "hover:text-white cursor-pointer hover:scale-110 active:scale-95" : "opacity-20"}`}
              >
                <SkipBack size={20} fill="currentColor" className="md:hidden" />
                <SkipBack
                  size={22}
                  fill="currentColor"
                  className="hidden md:block lg:hidden"
                />
                <SkipBack
                  size={24}
                  fill="currentColor"
                  className="hidden lg:block"
                />
              </button>
              <button
                onClick={playStatus ? pause : play}
                disabled={!track}
                className={`w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white shadow-lg transition-all flex-shrink-0 ${
                  track
                    ? "hover:bg-zinc-100 hover:scale-110 active:scale-95"
                    : "opacity-20 cursor-not-allowed"
                }`}
              >
                {playStatus ? (
                  <>
                    <Pause
                      size={18}
                      className="text-black fill-current md:hidden"
                    />
                    <Pause
                      size={20}
                      className="text-black fill-current hidden md:block lg:hidden"
                    />
                    <Pause
                      size={22}
                      className="text-black fill-current hidden lg:block"
                    />
                  </>
                ) : (
                  <>
                    <Play
                      size={18}
                      className="text-black fill-current ml-0.5 md:hidden"
                    />
                    <Play
                      size={20}
                      className="text-black fill-current ml-0.5 hidden md:block lg:hidden"
                    />
                    <Play
                      size={22}
                      className="text-black fill-current ml-0.5 hidden lg:block"
                    />
                  </>
                )}
              </button>
              <button
                onClick={next}
                disabled={!track}
                className={`text-zinc-400 transition-all ${track ? "hover:text-white cursor-pointer hover:scale-110 active:scale-95" : "opacity-20"}`}
              >
                <SkipForward
                  size={20}
                  fill="currentColor"
                  className="md:hidden"
                />
                <SkipForward
                  size={22}
                  fill="currentColor"
                  className="hidden md:block lg:hidden"
                />
                <SkipForward
                  size={24}
                  fill="currentColor"
                  className="hidden lg:block"
                />
              </button>

              <button
                onClick={toggleRepeat}
                disabled={!track}
                className={`transition-all ${track ? "cursor-pointer hover:scale-110 active:scale-95" : "opacity-20 pointer-events-none"}`}
              >
                <div className="md:hidden">{renderRepeatIcon(14)}</div>
                <div className="hidden md:block lg:hidden">
                  {renderRepeatIcon(16)}
                </div>
                <div className="hidden lg:block">{renderRepeatIcon(18)}</div>
              </button>
            </div>

            <div
              className={`flex items-center gap-2 md:gap-3 w-full group select-none ${!track && "opacity-60"}`}
            >
              {track ? (
                <>
                  <span className="text-[10px] md:text-xs tabular-nums text-zinc-500 w-8 md:w-10 lg:w-12 text-right font-medium flex-shrink-0">
                    {formatTime(
                      time.currentTime.minute,
                      time.currentTime.second,
                    )}
                  </span>
                  <div
                    ref={seekBg}
                    onMouseDown={handleMouseDown}
                    className="relative flex-1 h-1 md:h-1.5 bg-zinc-800 rounded-full cursor-pointer group min-w-0"
                  >
                    <div
                      ref={seekBar}
                      className="absolute top-0 left-0 h-full bg-white rounded-full transition-none group-hover:bg-zinc-100"
                    >
                      <div
                        className={`absolute right-[-4px] md:right-[-6px] top-[-3px] md:top-[-4px] w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-lg border-2 border-zinc-800 transition-opacity ${
                          isDragging
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] md:text-xs tabular-nums text-zinc-500 w-8 md:w-10 lg:w-12 font-medium flex-shrink-0">
                    {formatTime(time.totalTime.minute, time.totalTime.second)}
                  </span>
                </>
              ) : (
                <>
                  <div className="h-2.5 md:h-3 w-8 md:w-10 lg:w-12 bg-zinc-800/50 rounded animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 h-1 md:h-1.5 bg-zinc-800/50 rounded-full min-w-0"></div>
                  <div className="h-2.5 md:h-3 w-8 md:w-10 lg:w-12 bg-zinc-800/50 rounded animate-pulse flex-shrink-0"></div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 md:gap-4 lg:gap-6 w-[30%] min-w-0">
            <div
              className={`flex items-center gap-2 md:gap-3 group w-24 md:w-28 lg:w-32 ${!track ? "opacity-60" : ""}`}
            >
              <button
                onClick={toggleMute}
                disabled={!track}
                className={`text-zinc-500 hover:text-white transition-all hover:scale-110 active:scale-95 flex-shrink-0 ${
                  !track ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                {isMuted ? (
                  <>
                    <VolumeX size={16} className="md:hidden" />
                    <VolumeX size={18} className="hidden md:block" />
                  </>
                ) : (
                  <>
                    <Volume2 size={16} className="md:hidden" />
                    <Volume2 size={18} className="hidden md:block" />
                  </>
                )}
              </button>
              <div
                onClick={changeVolume}
                className={`flex-1 h-1 bg-zinc-800 rounded-full relative group min-w-0 ${
                  !track ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                }`}
              >
                <div
                  className="h-full bg-white rounded-full transition-all group-hover:bg-zinc-100"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              disabled={!track}
              className={`text-zinc-500 hover:text-white transition-all hover:scale-110 active:scale-95 p-1 flex-shrink-0 hidden md:block ${
                !track ? "opacity-20 cursor-not-allowed" : ""
              }`}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      </footer>

      {isFullscreen && track && (
        <div
          ref={fullscreenContainerRef}
          className={`fixed inset-0 z-[100] bg-black flex flex-col transition-all duration-500 ease-out ${
            isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <header
            className={`flex justify-between items-center h-14 md:h-16 px-4 md:px-6 lg:px-8 shrink-0 border-b border-zinc-700/50 transition-all duration-500 delay-100 ${
              isClosing
                ? "opacity-0 translate-y-[-20px]"
                : "opacity-100 translate-y-0"
            }`}
          >
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4 min-w-0">
              <img
                src={track.image}
                className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-xl object-cover border border-zinc-700/30 flex-shrink-0"
                alt=""
              />
              <div className="min-w-0 truncate">
                <p className="text-xs md:text-sm font-semibold text-white truncate">
                  {track.name}
                </p>
                <p className="text-[10px] md:text-xs text-zinc-400 truncate">
                  {track.artist}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                type="button"
                onClick={handleToggleLike}
                onMouseDown={(e) => e.preventDefault()}
                disabled={isLikeLoading}
                className="p-2 text-zinc-500 hover:text-white transition-all hover:bg-white/10 rounded-lg"
                title={
                  isLiked
                    ? t("library.actions.unsave")
                    : t("library.actions.save")
                }
              >
                <Heart
                  size={20}
                  className={
                    isLiked ? "fill-white text-white" : "text-zinc-500"
                  }
                />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-zinc-400 hover:text-white transition-all hover:bg-white/10 rounded-lg"
                title="Exit fullscreen"
              >
                <Minimize2 size={20} />
              </button>
            </div>
          </header>

          <div className="flex-1 flex items-center justify-center px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 max-w-7xl w-full">
              <div
                className={`flex-shrink-0 w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] lg:w-[500px] aspect-square transition-all duration-700 delay-200 ${
                  isClosing
                    ? "opacity-0 scale-90 lg:translate-x-[-50px] translate-y-[-20px]"
                    : "opacity-100 scale-100 lg:translate-x-0 translate-y-0"
                }`}
              >
                <div className="w-full h-full shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-700/30">
                  <img
                    src={track.image}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              </div>

              <div
                className={`flex-1 flex flex-col gap-6 md:gap-7 lg:gap-8 min-w-0 w-full transition-all duration-700 delay-300 ${
                  isClosing
                    ? "opacity-0 lg:translate-x-[50px] translate-y-[20px]"
                    : "opacity-100 lg:translate-x-0 translate-y-0"
                }`}
              >
                <div className="text-center lg:text-left">
                  <h1
                    className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 md:mb-3 truncate transition-all duration-500 delay-400 ${
                      isClosing
                        ? "opacity-0 translate-y-[-20px]"
                        : "opacity-100 translate-y-0"
                    }`}
                  >
                    {track.name}
                  </h1>
                  <p
                    className={`text-lg md:text-xl lg:text-2xl text-zinc-400 mb-6 md:mb-7 lg:mb-8 transition-all duration-500 delay-500 ${
                      isClosing
                        ? "opacity-0 translate-y-[-20px]"
                        : "opacity-100 translate-y-0"
                    }`}
                  >
                    {track.artist}
                  </p>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <div
                    ref={seekBg}
                    onMouseDown={handleMouseDown}
                    className="relative w-full h-1.5 md:h-2 bg-zinc-800 rounded-full cursor-pointer group"
                  >
                    <div
                      ref={seekBar}
                      className="absolute top-0 left-0 h-full bg-white rounded-full transition-none"
                    >
                      <div className="absolute right-[-6px] md:right-[-8px] top-[-5px] md:top-[-6px] w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-lg border-2 border-zinc-800" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm text-zinc-500 tabular-nums font-medium">
                    <span>
                      {formatTime(
                        time.currentTime.minute,
                        time.currentTime.second,
                      )}
                    </span>
                    <span>
                      {formatTime(time.totalTime.minute, time.totalTime.second)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 md:gap-4">
                  <button
                    onClick={toggleShuffle}
                    className={`p-2 md:p-3 transition-all hover:scale-110 active:scale-95 ${isShuffle ? "text-white" : "text-zinc-600 hover:text-white"}`}
                  >
                    <Shuffle size={20} className="md:hidden" />
                    <Shuffle size={22} className="hidden md:block lg:hidden" />
                    <Shuffle size={24} className="hidden lg:block" />
                  </button>
                  <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
                    <button
                      onClick={previous}
                      className="p-2 md:p-3 lg:p-4 text-white hover:scale-110 active:scale-95 transition-transform"
                    >
                      <SkipBack
                        size={32}
                        fill="currentColor"
                        className="md:hidden"
                      />
                      <SkipBack
                        size={40}
                        fill="currentColor"
                        className="hidden md:block lg:hidden"
                      />
                      <SkipBack
                        size={48}
                        fill="currentColor"
                        className="hidden lg:block"
                      />
                    </button>
                    <button
                      onClick={playStatus ? pause : play}
                      className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-white flex items-center justify-center shadow-xl md:shadow-2xl hover:scale-105 active:scale-95 transition-transform flex-shrink-0"
                    >
                      {playStatus ? (
                        <>
                          <Pause
                            size={28}
                            className="text-zinc-900 fill-current md:hidden"
                          />
                          <Pause
                            size={34}
                            className="text-zinc-900 fill-current hidden md:block lg:hidden"
                          />
                          <Pause
                            size={40}
                            className="text-zinc-900 fill-current hidden lg:block"
                          />
                        </>
                      ) : (
                        <>
                          <Play
                            size={28}
                            className="text-zinc-900 fill-current ml-1 md:hidden"
                          />
                          <Play
                            size={34}
                            className="text-zinc-900 fill-current ml-1 hidden md:block lg:hidden"
                          />
                          <Play
                            size={40}
                            className="text-zinc-900 fill-current ml-1 hidden lg:block"
                          />
                        </>
                      )}
                    </button>
                    <button
                      onClick={next}
                      className="p-2 md:p-3 lg:p-4 text-white hover:scale-110 active:scale-95 transition-transform"
                    >
                      <SkipForward
                        size={32}
                        fill="currentColor"
                        className="md:hidden"
                      />
                      <SkipForward
                        size={40}
                        fill="currentColor"
                        className="hidden md:block lg:hidden"
                      />
                      <SkipForward
                        size={48}
                        fill="currentColor"
                        className="hidden lg:block"
                      />
                    </button>
                  </div>
                  <button
                    onClick={toggleRepeat}
                    className={`p-2 md:p-3 transition-all hover:scale-110 active:scale-95 ${repeatMode !== "none" ? "text-white" : "text-zinc-600 hover:text-white"}`}
                  >
                    <div className="md:hidden">{renderRepeatIcon(20)}</div>
                    <div className="hidden md:block lg:hidden">
                      {renderRepeatIcon(22)}
                    </div>
                    <div className="hidden lg:block">
                      {renderRepeatIcon(24)}
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-3 md:gap-4 pt-2 md:pt-3 lg:pt-4">
                  <button
                    onClick={toggleMute}
                    className="text-zinc-500 hover:text-white transition-all hover:scale-110 active:scale-95 flex-shrink-0"
                  >
                    {isMuted ? (
                      <>
                        <VolumeX size={18} className="md:hidden" />
                        <VolumeX
                          size={20}
                          className="hidden md:block lg:hidden"
                        />
                        <VolumeX size={22} className="hidden lg:block" />
                      </>
                    ) : (
                      <>
                        <Volume2 size={18} className="md:hidden" />
                        <Volume2
                          size={20}
                          className="hidden md:block lg:hidden"
                        />
                        <Volume2 size={22} className="hidden lg:block" />
                      </>
                    )}
                  </button>
                  <div
                    onClick={changeVolume}
                    className="flex-1 h-1 md:h-1.5 bg-zinc-800 rounded-full cursor-pointer relative group min-w-0"
                  >
                    <div
                      className="h-full bg-white rounded-full transition-all group-hover:bg-zinc-100"
                      style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Player;
