import { requireNativeModule } from 'expo-modules-core';
import { Platform, NativeEventEmitter, NativeModules } from 'react-native';

// Types
export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export interface LoadResult {
  duration: number;
  fileName: string;
}

export interface TimeUpdateEvent {
  currentTime: number;
}

// Native module interface
interface AudioPlayerModuleInterface {
  loadUrl(urlString: string): Promise<LoadResult>;
  play(): void;
  pause(): void;
  stop(): void;
  seek(time: number): void;
  skipBack(seconds: number): void;
  skipForward(seconds: number): void;
  setPlaybackSpeed(speed: number): void;
  setLoopStart(): void;
  setLoopEnd(): void;
  clearLoop(): void;
  toggleLoop(): void;
  getCurrentTime(): number;
  getDuration(): number;
  isPlaying(): boolean;
  unload(): void;
  pickFile(): Promise<LoadResult | null>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// Get native module (iOS only)
const getNativeModule = (): AudioPlayerModuleInterface | null => {
  if (Platform.OS !== 'ios') {
    return null;
  }

  try {
    return requireNativeModule<AudioPlayerModuleInterface>('AudioPlayerModule');
  } catch {
    console.warn('AudioPlayerModule native module not available');
    return null;
  }
};

const nativeModule = getNativeModule();

// Event emitter
const emitter = nativeModule
  ? new NativeEventEmitter(NativeModules.AudioPlayerModule)
  : null;

/**
 * Load audio from URL
 */
export async function loadUrl(url: string): Promise<LoadResult> {
  if (nativeModule) {
    return nativeModule.loadUrl(url);
  }
  throw new Error('Native module not available');
}

/**
 * Play audio
 */
export function play(): void {
  if (nativeModule) {
    nativeModule.play();
  }
}

/**
 * Pause audio
 */
export function pause(): void {
  if (nativeModule) {
    nativeModule.pause();
  }
}

/**
 * Stop audio
 */
export function stop(): void {
  if (nativeModule) {
    nativeModule.stop();
  }
}

/**
 * Seek to time in seconds
 */
export function seek(time: number): void {
  if (nativeModule) {
    nativeModule.seek(time);
  }
}

/**
 * Skip back by seconds
 */
export function skipBack(seconds = 15): void {
  if (nativeModule) {
    nativeModule.skipBack(seconds);
  }
}

/**
 * Skip forward by seconds
 */
export function skipForward(seconds = 15): void {
  if (nativeModule) {
    nativeModule.skipForward(seconds);
  }
}

/**
 * Set playback speed
 */
export function setPlaybackSpeed(speed: PlaybackSpeed): void {
  if (nativeModule) {
    nativeModule.setPlaybackSpeed(speed);
  }
}

/**
 * Set loop start point
 */
export function setLoopStart(): void {
  if (nativeModule) {
    nativeModule.setLoopStart();
  }
}

/**
 * Set loop end point
 */
export function setLoopEnd(): void {
  if (nativeModule) {
    nativeModule.setLoopEnd();
  }
}

/**
 * Clear loop points
 */
export function clearLoop(): void {
  if (nativeModule) {
    nativeModule.clearLoop();
  }
}

/**
 * Toggle looping
 */
export function toggleLoop(): void {
  if (nativeModule) {
    nativeModule.toggleLoop();
  }
}

/**
 * Get current playback time
 */
export function getCurrentTime(): number {
  if (nativeModule) {
    return nativeModule.getCurrentTime();
  }
  return 0;
}

/**
 * Get audio duration
 */
export function getDuration(): number {
  if (nativeModule) {
    return nativeModule.getDuration();
  }
  return 0;
}

/**
 * Check if audio is playing
 */
export function isPlaying(): boolean {
  if (nativeModule) {
    return nativeModule.isPlaying();
  }
  return false;
}

/**
 * Unload audio
 */
export function unload(): void {
  if (nativeModule) {
    nativeModule.unload();
  }
}

/**
 * Pick audio file using system picker
 */
export async function pickFile(): Promise<LoadResult | null> {
  if (nativeModule) {
    return nativeModule.pickFile();
  }
  return null;
}

/**
 * Subscribe to time update events
 */
export function addTimeUpdateListener(
  callback: (event: TimeUpdateEvent) => void
): { remove: () => void } {
  if (emitter && nativeModule) {
    nativeModule.addListener('onTimeUpdate');
    const subscription = emitter.addListener('onTimeUpdate', callback);
    return {
      remove: () => {
        subscription.remove();
        nativeModule?.removeListeners(1);
      },
    };
  }
  return { remove: () => {} };
}

/**
 * Subscribe to playback ended events
 */
export function addPlaybackEndedListener(
  callback: () => void
): { remove: () => void } {
  if (emitter && nativeModule) {
    nativeModule.addListener('onPlaybackEnded');
    const subscription = emitter.addListener('onPlaybackEnded', callback);
    return {
      remove: () => {
        subscription.remove();
        nativeModule?.removeListeners(1);
      },
    };
  }
  return { remove: () => {} };
}

/**
 * Check if native audio player is available
 */
export function isNativeAvailable(): boolean {
  return nativeModule !== null;
}

// Default export
export default {
  loadUrl,
  play,
  pause,
  stop,
  seek,
  skipBack,
  skipForward,
  setPlaybackSpeed,
  setLoopStart,
  setLoopEnd,
  clearLoop,
  toggleLoop,
  getCurrentTime,
  getDuration,
  isPlaying,
  unload,
  pickFile,
  addTimeUpdateListener,
  addPlaybackEndedListener,
  isNativeAvailable,
};
