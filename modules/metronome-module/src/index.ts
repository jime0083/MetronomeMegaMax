import { requireNativeModule } from 'expo-modules-core';
import { Platform, NativeEventEmitter, NativeModules } from 'react-native';

// Types
export type TimeSignature =
  | '2/4'
  | '3/4'
  | '4/4'
  | '5/4'
  | '6/4'
  | '7/4'
  | '3/8'
  | '6/8'
  | '9/8'
  | '12/8';

export type AccentPattern = 'first' | 'first-third' | 'second-fourth';

export interface BeatEvent {
  beat: number;
}

// Native module interface
interface MetronomeModuleInterface {
  start(): Promise<void>;
  stop(): void;
  setBpm(bpm: number): void;
  setTimeSignature(signature: string): void;
  setAccentPattern(pattern: string): void;
  isPlaying(): boolean;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// Get native module (iOS only)
const getNativeModule = (): MetronomeModuleInterface | null => {
  if (Platform.OS !== 'ios') {
    return null;
  }

  try {
    return requireNativeModule<MetronomeModuleInterface>('MetronomeModule');
  } catch {
    console.warn('MetronomeModule native module not available');
    return null;
  }
};

const nativeModule = getNativeModule();

// Event emitter for beat events (using React Native's NativeEventEmitter)
const emitter = nativeModule
  ? new NativeEventEmitter(NativeModules.MetronomeModule)
  : null;

/**
 * Start the metronome
 */
export async function start(): Promise<void> {
  if (nativeModule) {
    await nativeModule.start();
  }
}

/**
 * Stop the metronome
 */
export function stop(): void {
  if (nativeModule) {
    nativeModule.stop();
  }
}

/**
 * Set the BPM (beats per minute)
 * @param bpm - BPM value between 20 and 300
 */
export function setBpm(bpm: number): void {
  if (nativeModule) {
    nativeModule.setBpm(bpm);
  }
}

/**
 * Set the time signature
 * @param signature - Time signature string (e.g., "4/4", "3/4")
 */
export function setTimeSignature(signature: TimeSignature): void {
  if (nativeModule) {
    nativeModule.setTimeSignature(signature);
  }
}

/**
 * Set the accent pattern
 * @param pattern - Accent pattern type
 */
export function setAccentPattern(pattern: AccentPattern): void {
  if (nativeModule) {
    nativeModule.setAccentPattern(pattern);
  }
}

/**
 * Check if the metronome is currently playing
 */
export function isPlaying(): boolean {
  if (nativeModule) {
    return nativeModule.isPlaying();
  }
  return false;
}

/**
 * Subscribe to beat events
 * @param callback - Function called on each beat with beat number
 * @returns Subscription object with remove() method
 */
export function addBeatListener(
  callback: (event: BeatEvent) => void
): { remove: () => void } {
  if (emitter && nativeModule) {
    nativeModule.addListener('onBeat');
    const subscription = emitter.addListener('onBeat', callback);
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
 * Check if native metronome is available
 */
export function isNativeAvailable(): boolean {
  return nativeModule !== null;
}

// Default export with all functions
export default {
  start,
  stop,
  setBpm,
  setTimeSignature,
  setAccentPattern,
  isPlaying,
  addBeatListener,
  isNativeAvailable,
};
