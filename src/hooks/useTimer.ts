import { useRef, useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface TimerState {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

interface UseTimerOptions {
  onComplete?: () => void;
  onTick?: (remainingSeconds: number) => void;
}

interface UseTimerReturn {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  setTime: (seconds: number) => void;
  addTime: (seconds: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

// Maximum timer duration: 24 hours
const MAX_SECONDS = 24 * 60 * 60;

// Check if Web Audio API is available for alarm
const isWebAudioSupported = (): boolean => {
  if (Platform.OS !== 'web') return false;
  return typeof window !== 'undefined' && 'AudioContext' in window;
};

export const useTimer = (options?: UseTimerOptions): UseTimerReturn => {
  const [state, setState] = useState<TimerState>({
    remainingSeconds: 0,
    totalSeconds: 0,
    isRunning: false,
    isPaused: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play alarm sound when timer completes
  const playAlarm = useCallback((): void => {
    if (!isWebAudioSupported()) {
      // iOS native alarm will be implemented later
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    // Resume if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Create a simple alarm sound (3 beeps)
    const playBeep = (startTime: number, frequency: number, duration: number): void => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Play 3 ascending beeps
    playBeep(now, 880, 0.2);
    playBeep(now + 0.3, 1100, 0.2);
    playBeep(now + 0.6, 1320, 0.4);
  }, []);

  // Clear interval
  const clearTimer = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Set time (replaces current time)
  const setTime = useCallback((seconds: number): void => {
    const clampedSeconds = Math.max(0, Math.min(MAX_SECONDS, seconds));
    setState({
      remainingSeconds: clampedSeconds,
      totalSeconds: clampedSeconds,
      isRunning: false,
      isPaused: false,
    });
    clearTimer();
  }, [clearTimer]);

  // Add time to current
  const addTime = useCallback((seconds: number): void => {
    setState((prev) => {
      if (prev.isRunning) return prev;

      const newTotal = Math.min(MAX_SECONDS, prev.totalSeconds + seconds);
      const newRemaining = Math.min(MAX_SECONDS, prev.remainingSeconds + seconds);

      return {
        ...prev,
        remainingSeconds: newRemaining,
        totalSeconds: newTotal,
      };
    });
  }, []);

  // Start the timer
  const start = useCallback((): void => {
    setState((prev) => {
      if (prev.remainingSeconds <= 0) return prev;
      return { ...prev, isRunning: true, isPaused: false };
    });
  }, []);

  // Pause the timer
  const pause = useCallback((): void => {
    clearTimer();
    setState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: true,
    }));
  }, [clearTimer]);

  // Resume the timer
  const resume = useCallback((): void => {
    setState((prev) => {
      if (prev.remainingSeconds <= 0) return prev;
      return { ...prev, isRunning: true, isPaused: false };
    });
  }, []);

  // Reset the timer
  const reset = useCallback((): void => {
    clearTimer();
    setState({
      remainingSeconds: 0,
      totalSeconds: 0,
      isRunning: false,
      isPaused: false,
    });
  }, [clearTimer]);

  // Handle countdown logic
  useEffect(() => {
    if (!state.isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev.isRunning || prev.remainingSeconds <= 0) {
          return prev;
        }

        const newRemaining = prev.remainingSeconds - 1;

        // Timer completed
        if (newRemaining <= 0) {
          playAlarm();
          options?.onComplete?.();
          return {
            ...prev,
            remainingSeconds: 0,
            isRunning: false,
            isPaused: false,
          };
        }

        options?.onTick?.(newRemaining);

        return {
          ...prev,
          remainingSeconds: newRemaining,
        };
      });
    }, 1000);

    return () => clearTimer();
  }, [state.isRunning, clearTimer, playAlarm, options]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [clearTimer]);

  return {
    remainingSeconds: state.remainingSeconds,
    totalSeconds: state.totalSeconds,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    setTime,
    addTime,
    start,
    pause,
    resume,
    reset,
  };
};
