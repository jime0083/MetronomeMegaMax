/**
 * Metronome utility functions
 * Pure functions extracted for testing
 */

import type { TimeSignature, AccentPattern } from '@/types';

/**
 * Calculate beat interval in seconds from BPM
 */
export const calculateBeatInterval = (bpm: number): number => {
  if (bpm <= 0) throw new Error('BPM must be positive');
  return 60 / bpm;
};

/**
 * Parse time signature to get beats per measure
 */
export const parseTimeSignature = (timeSignature: TimeSignature): number => {
  const [beats] = timeSignature.split('/');
  const parsed = parseInt(beats, 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error('Invalid time signature');
  }
  return parsed;
};

/**
 * Determine if a beat should have an accent
 */
export const isAccentBeat = (
  beat: number,
  accentPattern: AccentPattern
): boolean => {
  if (accentPattern === 'first') return beat === 0;
  if (accentPattern === 'first-third') return beat === 0 || beat === 2;
  if (accentPattern === 'second-fourth') return beat === 1 || beat === 3;
  return false;
};

/**
 * Calculate next beat number (wraps around)
 */
export const getNextBeat = (currentBeat: number, beatsPerMeasure: number): number => {
  return (currentBeat + 1) % beatsPerMeasure;
};

/**
 * Validate BPM range
 */
export const validateBpm = (bpm: number): boolean => {
  return bpm >= 20 && bpm <= 300;
};

/**
 * Clamp BPM to valid range
 */
export const clampBpm = (bpm: number): number => {
  return Math.max(20, Math.min(300, bpm));
};
