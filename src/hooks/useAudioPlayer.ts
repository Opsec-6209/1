import { useState, useCallback, useEffect, useRef } from "react";
import { playlist } from "../data/playlist";

export type RepeatMode = "off" | "all" | "one";

export function useAudioPlayer() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const saved = localStorage.getItem("sakura-track-index");
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    try {
      const saved = localStorage.getItem("sakura-volume");
      return saved ? Number(saved) : 0.7;
    } catch {
      return 0.7;
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shuffle, setShuffle] = useState(() => {
    try {
      return localStorage.getItem("sakura-shuffle") === "1";
    } catch {
      return false;
    }
  });
  const [repeat, setRepeat] = useState<RepeatMode>(() => {
    try {
      const v = localStorage.getItem("sakura-repeat");
      if (v === "all" || v === "one" || v === "off") return v;
      return "all";
    } catch {
      return "all";
    }
  });

  const [audio] = useState(() => {
    const a = new Audio();
    a.preload = "auto";
    return a;
  });

  const track = playlist[currentIndex];
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const repeatRef = useRef(repeat);
  repeatRef.current = repeat;
  const shuffleRef = useRef(shuffle);
  shuffleRef.current = shuffle;

  const play = useCallback(() => {
    audio.src = track.file;
    audio.volume = isMuted ? 0 : volume;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, [track.file, audio, volume, isMuted]);

  const pause = useCallback(() => {
    audio.pause();
    setIsPlaying(false);
  }, [audio]);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const pickNextIndex = useCallback(
    (current: number) => {
      if (shuffleRef.current && playlist.length > 1) {
        let next = current;
        while (next === current) {
          next = Math.floor(Math.random() * playlist.length);
        }
        return next;
      }
      return (current + 1) % playlist.length;
    },
    []
  );

  const next = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => pickNextIndex(prev));
    setTimeout(() => setIsTransitioning(false), 250);
  }, [pickNextIndex]);

  const prev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      if (shuffleRef.current && playlist.length > 1) {
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * playlist.length);
        }
        return next;
      }
      return (prev - 1 + playlist.length) % playlist.length;
    });
    setTimeout(() => setIsTransitioning(false), 250);
  }, []);

  const seek = useCallback(
    (time: number) => {
      audio.currentTime = time;
      setCurrentTime(time);
    },
    [audio]
  );

  const setVolume = useCallback(
    (v: number) => {
      audio.volume = v;
      setVolumeState(v);
      setIsMuted(v === 0);
      try {
        localStorage.setItem("sakura-volume", String(v));
      } catch {}
    },
    [audio]
  );

  const toggleMute = useCallback(() => {
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume, audio]);

  const toggleShuffle = useCallback(() => {
    setShuffle((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sakura-shuffle", next ? "1" : "0");
      } catch {}
      return next;
    });
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeat((prev) => {
      const order: RepeatMode[] = ["off", "all", "one"];
      const next = order[(order.indexOf(prev) + 1) % order.length];
      try {
        localStorage.setItem("sakura-repeat", next);
      } catch {}
      return next;
    });
  }, []);

  const jumpTo = useCallback((index: number) => {
    if (index < 0 || index >= playlist.length) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 250);
  }, []);

  useEffect(() => {
    audio.volume = isMuted ? 0 : volume;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    audio.src = track.file;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      if (repeatRef.current === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      if (repeatRef.current === "off" && currentIndex === playlist.length - 1) {
        setIsPlaying(false);
        return;
      }
      setCurrentIndex((prev) => pickNextIndex(prev));
    };
    const onPause = () => {
      if (!audio.ended) setIsPlaying(false);
    };
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);

    if (isPlayingRef.current) {
      audio.play().catch(() => {});
    }

    try {
      localStorage.setItem("sakura-track-index", String(currentIndex));
    } catch {}

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, [currentIndex, track.file, audio, pickNextIndex]);

  return {
    audio,
    track,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    currentIndex,
    totalTracks: playlist.length,
    isTransitioning,
    shuffle,
    repeat,
    play,
    pause,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    jumpTo,
  };
}
