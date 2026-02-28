/**
 * Timer utility functions
 * Pure functions extracted for testing
 */

// Maximum timer duration: 24 hours
export const MAX_SECONDS = 24 * 60 * 60;

/**
 * Format seconds to HH:MM:SS
 */
export const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number): string => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Parse time string to seconds
 */
export const parseTime = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);

  if (parts.length === 3) {
    // HH:MM:SS
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    // MM:SS
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  return 0;
};

/**
 * Clamp seconds to valid range
 */
export const clampSeconds = (seconds: number): number => {
  return Math.max(0, Math.min(MAX_SECONDS, seconds));
};

/**
 * Validate seconds is within range
 */
export const validateSeconds = (seconds: number): boolean => {
  return seconds >= 0 && seconds <= MAX_SECONDS;
};

/**
 * Add seconds with clamping
 */
export const addSeconds = (current: number, add: number): number => {
  return clampSeconds(current + add);
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (remaining: number, total: number): number => {
  if (total === 0) return 0;
  return ((total - remaining) / total) * 100;
};
