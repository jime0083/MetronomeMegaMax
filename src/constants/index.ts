import type { TimeSignature, AccentPattern, PlaybackSpeed } from '@/types';

// BPM constraints
export const MIN_BPM = 20;
export const MAX_BPM = 300;
export const DEFAULT_BPM = 120;

// Timer constraints
export const MAX_TIMER_SECONDS = 24 * 60 * 60; // 24 hours
export const TIMER_INCREMENT_OPTIONS = [30, 60, 180, 300, 600, 1800] as const;

// Time signatures
export const TIME_SIGNATURES: readonly TimeSignature[] = [
  '2/4',
  '3/4',
  '4/4',
  '5/4',
  '6/4',
  '7/4',
  '3/8',
  '6/8',
  '9/8',
  '12/8',
] as const;

// Accent patterns
export const ACCENT_PATTERNS: readonly { value: AccentPattern; labelKey: string }[] = [
  { value: 'first', labelKey: 'accent.first' },
  { value: 'first-third', labelKey: 'accent.firstThird' },
  { value: 'second-fourth', labelKey: 'accent.secondFourth' },
] as const;

// Playback speeds
export const PLAYBACK_SPEEDS: readonly PlaybackSpeed[] = [
  0.5, 0.75, 1, 1.25, 1.5, 1.75, 2,
] as const;

// Premium limits
export const MAX_BPM_PRESETS = 10;
export const MAX_TIMER_PRESETS = 10;
export const MAX_LOOP_POINTS = 3;
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

// Responsive breakpoints (Web)
export const BREAKPOINTS = {
  MOBILE: 0,
  TABLET: 1120,
  DESKTOP_SMALL: 1280,
  DESKTOP_LARGE: 1440,
} as const;

// Ad sizes
export const AD_SIZES = {
  SIDEBAR: { width: 160, height: 600 },
  BANNER_LARGE: { width: 728, height: 90 },
  BANNER_MOBILE: { width: 320, height: 50 },
} as const;

// Audio settings
export const AUDIO_LOOK_AHEAD_TIME = 0.1; // 100ms look-ahead for scheduling
export const AUDIO_SCHEDULE_INTERVAL = 25; // 25ms interval for checking schedule

// Supported audio formats
export const SUPPORTED_AUDIO_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/x-wav'] as const;
