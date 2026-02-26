import { useRef, useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type { TimeSignature, AccentPattern } from '@/types';

// Constants for Web Audio API look-ahead scheduling
const SCHEDULE_AHEAD_TIME = 0.1; // Schedule 100ms ahead
const SCHEDULER_INTERVAL = 25; // Check every 25ms

interface MetronomeState {
  isPlaying: boolean;
  currentBeat: number;
}

interface UseMetronomeOptions {
  bpm: number;
  timeSignature: TimeSignature;
  accentPattern: AccentPattern;
  onBeatChange?: (beat: number) => void;
}

interface UseMetronomeReturn {
  isPlaying: boolean;
  currentBeat: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

// Check if Web Audio API is available
const isWebAudioSupported = (): boolean => {
  if (Platform.OS !== 'web') return false;
  return typeof window !== 'undefined' && 'AudioContext' in window;
};

// Import native module dynamically for iOS
let NativeMetronome: typeof import('metronome-module') | null = null;
if (Platform.OS === 'ios') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    NativeMetronome = require('metronome-module');
  } catch {
    // Native module not available (running in Expo Go or web)
  }
}

export const useMetronome = ({
  bpm,
  timeSignature,
  accentPattern,
  onBeatChange,
}: UseMetronomeOptions): UseMetronomeReturn => {
  const [state, setState] = useState<MetronomeState>({
    isPlaying: false,
    currentBeat: 0,
  });

  // Refs for Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const schedulerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextBeatTimeRef = useRef<number>(0);
  const currentBeatRef = useRef<number>(0);
  const beatsPerMeasureRef = useRef<number>(4);
  const isPlayingRef = useRef<boolean>(false);

  // Ref for native beat listener subscription
  const beatListenerRef = useRef<{ remove: () => void } | null>(null);

  // Parse time signature
  useEffect(() => {
    const [beats] = timeSignature.split('/');
    beatsPerMeasureRef.current = parseInt(beats, 10);

    // Update native module if available
    if (NativeMetronome?.isNativeAvailable()) {
      NativeMetronome.setTimeSignature(timeSignature);
    }
  }, [timeSignature]);

  // Update BPM in native module
  useEffect(() => {
    if (NativeMetronome?.isNativeAvailable()) {
      NativeMetronome.setBpm(bpm);
    }
  }, [bpm]);

  // Update accent pattern in native module
  useEffect(() => {
    if (NativeMetronome?.isNativeAvailable()) {
      NativeMetronome.setAccentPattern(accentPattern);
    }
  }, [accentPattern]);

  // Calculate beat interval in seconds (for Web)
  const getBeatInterval = useCallback((): number => {
    return 60 / bpm;
  }, [bpm]);

  // Determine if a beat should have an accent (for Web)
  const isAccentBeat = useCallback(
    (beat: number): boolean => {
      if (accentPattern === 'first') return beat === 0;
      if (accentPattern === 'first-third') return beat === 0 || beat === 2;
      if (accentPattern === 'second-fourth') return beat === 1 || beat === 3;
      return false;
    },
    [accentPattern]
  );

  // Play a click sound at the specified time (Web Audio API)
  const playClick = useCallback(
    (time: number, isAccent: boolean): void => {
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.frequency.value = isAccent ? 1000 : 800;
      oscillator.type = 'sine';
      gainNode.gain.value = isAccent ? 0.5 : 0.3;

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(time);
      gainNode.gain.setValueAtTime(gainNode.gain.value, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      oscillator.stop(time + 0.05);
    },
    []
  );

  // Web Audio API scheduler
  const scheduler = useCallback((): void => {
    const ctx = audioContextRef.current;
    if (!ctx || !isPlayingRef.current) return;

    const currentTime = ctx.currentTime;
    const scheduleAheadTime = currentTime + SCHEDULE_AHEAD_TIME;

    while (nextBeatTimeRef.current < scheduleAheadTime) {
      const beat = currentBeatRef.current;
      const isAccent = isAccentBeat(beat);

      playClick(nextBeatTimeRef.current, isAccent);

      const nextBeat = (beat + 1) % beatsPerMeasureRef.current;
      currentBeatRef.current = nextBeat;

      const beatForCallback = beat;
      setTimeout(() => {
        setState((prev) => ({ ...prev, currentBeat: beatForCallback }));
        onBeatChange?.(beatForCallback);
      }, (nextBeatTimeRef.current - currentTime) * 1000);

      nextBeatTimeRef.current += getBeatInterval();
    }
  }, [isAccentBeat, playClick, getBeatInterval, onBeatChange]);

  // Start metronome (Web Audio API)
  const startWeb = useCallback((): void => {
    if (!isWebAudioSupported()) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    nextBeatTimeRef.current = ctx.currentTime + 0.05;
    currentBeatRef.current = 0;
    isPlayingRef.current = true;

    setState({ isPlaying: true, currentBeat: 0 });

    schedulerTimerRef.current = setInterval(scheduler, SCHEDULER_INTERVAL);
  }, [scheduler]);

  // Stop metronome (Web Audio API)
  const stopWeb = useCallback((): void => {
    isPlayingRef.current = false;

    if (schedulerTimerRef.current) {
      clearInterval(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }

    setState({ isPlaying: false, currentBeat: 0 });
  }, []);

  // Start metronome (Native iOS)
  const startNative = useCallback(async (): Promise<void> => {
    if (!NativeMetronome?.isNativeAvailable()) return;

    // Setup beat listener
    beatListenerRef.current = NativeMetronome.addBeatListener((event) => {
      setState((prev) => ({ ...prev, currentBeat: event.beat }));
      onBeatChange?.(event.beat);
    });

    // Set current values before starting
    NativeMetronome.setBpm(bpm);
    NativeMetronome.setTimeSignature(timeSignature);
    NativeMetronome.setAccentPattern(accentPattern);

    await NativeMetronome.start();
    setState({ isPlaying: true, currentBeat: 0 });
  }, [bpm, timeSignature, accentPattern, onBeatChange]);

  // Stop metronome (Native iOS)
  const stopNative = useCallback((): void => {
    if (!NativeMetronome?.isNativeAvailable()) return;

    NativeMetronome.stop();

    if (beatListenerRef.current) {
      beatListenerRef.current.remove();
      beatListenerRef.current = null;
    }

    setState({ isPlaying: false, currentBeat: 0 });
  }, []);

  // Platform-aware start
  const start = useCallback((): void => {
    if (Platform.OS === 'ios' && NativeMetronome?.isNativeAvailable()) {
      startNative();
    } else if (isWebAudioSupported()) {
      startWeb();
    }
  }, [startNative, startWeb]);

  // Platform-aware stop
  const stop = useCallback((): void => {
    if (Platform.OS === 'ios' && NativeMetronome?.isNativeAvailable()) {
      stopNative();
    } else {
      stopWeb();
    }
  }, [stopNative, stopWeb]);

  // Toggle play/stop
  const toggle = useCallback((): void => {
    if (state.isPlaying) {
      stop();
    } else {
      start();
    }
  }, [state.isPlaying, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup Web Audio
      if (schedulerTimerRef.current) {
        clearInterval(schedulerTimerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      // Cleanup Native
      if (beatListenerRef.current) {
        beatListenerRef.current.remove();
      }
      if (NativeMetronome?.isNativeAvailable()) {
        NativeMetronome.stop();
      }
    };
  }, []);

  return {
    isPlaying: state.isPlaying,
    currentBeat: state.currentBeat,
    start,
    stop,
    toggle,
  };
};
