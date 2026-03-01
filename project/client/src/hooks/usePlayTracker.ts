import { useCallback, useRef } from "react";
import { addPlay } from "@/api/playApi";

const MIN_MS = 5000; // <5 сек не пишем
const MAX_MS = 60 * 60 * 1000; // 1 час

export function usePlayTracker() {
  const currentSongIdRef = useRef<string | null>(null);
  const startedAtRef = useRef<number | null>(null);

  const start = useCallback((songId: string) => {
    currentSongIdRef.current = songId;
    startedAtRef.current = Date.now();
  }, []);

  const stopAndSend = useCallback(async () => {
    const songId = currentSongIdRef.current;
    const startedAt = startedAtRef.current;

    currentSongIdRef.current = null;
    startedAtRef.current = null;

    if (!songId || !startedAt) return;

    let msPlayed = Date.now() - startedAt;
    if (msPlayed < MIN_MS) return;
    if (msPlayed > MAX_MS) msPlayed = MAX_MS;

    try {
      await addPlay(songId, msPlayed);
    } catch (e) {
      console.error("addPlay failed:", e);
    }
  }, []);

  const switchTo = useCallback(async (nextSongId: string) => {
    await stopAndSend();
    start(nextSongId);
  }, [start, stopAndSend]);

  return { start, stopAndSend, switchTo };
}
