// Metronome types
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

export interface BpmPreset {
  id: string;
  name: string;
  bpm: number;
  timeSignature: TimeSignature;
  accentPattern: AccentPattern;
  createdAt: number;
  updatedAt: number;
}

// Timer types
export interface TimerPreset {
  id: string;
  name: string;
  durationSeconds: number;
  createdAt: number;
  updatedAt: number;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  remainingSeconds: number;
  totalSeconds: number;
}

// Audio Player types
export interface LoopPoint {
  id: string;
  name: string;
  fileUrl: string;
  fileName: string;
  startTime: number;
  endTime: number;
  createdAt: number;
  updatedAt: number;
}

export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: PlaybackSpeed;
  isLooping: boolean;
  loopStart: number | null;
  loopEnd: number | null;
}

// User types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isPremium: boolean;
  premiumExpiresAt: number | null;
}

// Subscription types
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'none';

export interface Subscription {
  status: SubscriptionStatus;
  platform: 'ios' | 'web';
  expiresAt: number | null;
  productId: string | null;
}

// Language types
export type Language = 'ja' | 'en' | 'es';

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// App settings
export interface AppSettings {
  language: Language;
  theme: Theme;
}

// Panel types for mobile view
export type PanelType = 'metronome' | 'timer' | 'audio';
