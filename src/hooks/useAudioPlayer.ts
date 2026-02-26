import { useRef, useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type { PlaybackSpeed } from '@/types';

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: PlaybackSpeed;
  isLooping: boolean;
  loopStart: number | null;
  loopEnd: number | null;
  fileName: string | null;
  isLoaded: boolean;
}

interface UseAudioPlayerOptions {
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

interface UseAudioPlayerReturn {
  // State
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: PlaybackSpeed;
  isLooping: boolean;
  loopStart: number | null;
  loopEnd: number | null;
  fileName: string | null;
  isLoaded: boolean;

  // Actions
  loadFile: (file: File) => Promise<void>;
  loadUrl: (url: string, fileName?: string) => Promise<void>;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  skipBack: (seconds?: number) => void;
  skipForward: (seconds?: number) => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  setLoopStart: () => void;
  setLoopEnd: () => void;
  clearLoop: () => void;
  toggleLoop: () => void;
  unload: () => void;
}

// Check if we're on web
const isWeb = Platform.OS === 'web';

export const useAudioPlayer = (
  options?: UseAudioPlayerOptions
): UseAudioPlayerReturn => {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackSpeed: 1,
    isLooping: false,
    loopStart: null,
    loopEnd: null,
    fileName: null,
    isLoaded: false,
  });

  // Audio element reference (Web only)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Create audio element on mount (Web only)
  useEffect(() => {
    if (!isWeb) return;

    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    // Event handlers
    const handleLoadedMetadata = (): void => {
      setState((prev) => ({
        ...prev,
        duration: audio.duration,
        isLoaded: true,
      }));
    };

    const handleEnded = (): void => {
      if (state.isLooping && state.loopStart !== null) {
        audio.currentTime = state.loopStart;
        audio.play();
      } else {
        setState((prev) => ({ ...prev, isPlaying: false }));
        options?.onEnded?.();
      }
    };

    const handleError = (): void => {
      const error = new Error('Failed to load audio file');
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isLoaded: false,
      }));
      options?.onError?.(error);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);

      // Cleanup
      audio.pause();
      audio.src = '';

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update time and handle loop points
  useEffect(() => {
    if (!isWeb || !state.isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const updateTime = (): void => {
      const audio = audioRef.current;
      if (!audio) return;

      const currentTime = audio.currentTime;

      // Handle A-B loop
      if (
        state.isLooping &&
        state.loopStart !== null &&
        state.loopEnd !== null &&
        currentTime >= state.loopEnd
      ) {
        audio.currentTime = state.loopStart;
      }

      setState((prev) => ({ ...prev, currentTime }));
      options?.onTimeUpdate?.(currentTime);

      animationFrameRef.current = requestAnimationFrame(updateTime);
    };

    animationFrameRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlaying, state.isLooping, state.loopStart, state.loopEnd, options]);

  // Load file from File object (Web only)
  const loadFile = useCallback(async (file: File): Promise<void> => {
    if (!isWeb || !audioRef.current) return;

    // Cleanup previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    audioRef.current.src = url;

    setState((prev) => ({
      ...prev,
      fileName: file.name,
      currentTime: 0,
      duration: 0,
      isLoaded: false,
      isPlaying: false,
      loopStart: null,
      loopEnd: null,
    }));
  }, []);

  // Load from URL
  const loadUrl = useCallback(
    async (url: string, fileName?: string): Promise<void> => {
      if (!isWeb || !audioRef.current) return;

      audioRef.current.src = url;

      setState((prev) => ({
        ...prev,
        fileName: fileName || url.split('/').pop() || 'Unknown',
        currentTime: 0,
        duration: 0,
        isLoaded: false,
        isPlaying: false,
        loopStart: null,
        loopEnd: null,
      }));
    },
    []
  );

  // Play
  const play = useCallback((): void => {
    if (!isWeb || !audioRef.current || !state.isLoaded) return;

    audioRef.current.play();
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, [state.isLoaded]);

  // Pause
  const pause = useCallback((): void => {
    if (!isWeb || !audioRef.current) return;

    audioRef.current.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  // Toggle play/pause
  const toggle = useCallback((): void => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  // Seek to time
  const seek = useCallback((time: number): void => {
    if (!isWeb || !audioRef.current) return;

    const clampedTime = Math.max(0, Math.min(state.duration, time));
    audioRef.current.currentTime = clampedTime;
    setState((prev) => ({ ...prev, currentTime: clampedTime }));
  }, [state.duration]);

  // Skip back (default 15 seconds)
  const skipBack = useCallback(
    (seconds = 15): void => {
      seek(state.currentTime - seconds);
    },
    [state.currentTime, seek]
  );

  // Skip forward (default 15 seconds)
  const skipForward = useCallback(
    (seconds = 15): void => {
      seek(state.currentTime + seconds);
    },
    [state.currentTime, seek]
  );

  // Set playback speed
  const setPlaybackSpeed = useCallback((speed: PlaybackSpeed): void => {
    if (!isWeb || !audioRef.current) return;

    audioRef.current.playbackRate = speed;
    // Note: preservesPitch is supported in modern browsers
    if ('preservesPitch' in audioRef.current) {
      (audioRef.current as HTMLAudioElement & { preservesPitch: boolean }).preservesPitch = true;
    }

    setState((prev) => ({ ...prev, playbackSpeed: speed }));
  }, []);

  // Set loop start point
  const setLoopStart = useCallback((): void => {
    setState((prev) => ({ ...prev, loopStart: state.currentTime }));
  }, [state.currentTime]);

  // Set loop end point
  const setLoopEnd = useCallback((): void => {
    setState((prev) => ({ ...prev, loopEnd: state.currentTime }));
  }, [state.currentTime]);

  // Clear loop points
  const clearLoop = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      loopStart: null,
      loopEnd: null,
      isLooping: false,
    }));
  }, []);

  // Toggle loop
  const toggleLoop = useCallback((): void => {
    setState((prev) => ({ ...prev, isLooping: !prev.isLooping }));
  }, []);

  // Unload audio
  const unload = useCallback((): void => {
    if (!isWeb || !audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.src = '';

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setState({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      playbackSpeed: 1,
      isLooping: false,
      loopStart: null,
      loopEnd: null,
      fileName: null,
      isLoaded: false,
    });
  }, []);

  return {
    // State
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    playbackSpeed: state.playbackSpeed,
    isLooping: state.isLooping,
    loopStart: state.loopStart,
    loopEnd: state.loopEnd,
    fileName: state.fileName,
    isLoaded: state.isLoaded,

    // Actions
    loadFile,
    loadUrl,
    play,
    pause,
    toggle,
    seek,
    skipBack,
    skipForward,
    setPlaybackSpeed,
    setLoopStart,
    setLoopEnd,
    clearLoop,
    toggleLoop,
    unload,
  };
};
