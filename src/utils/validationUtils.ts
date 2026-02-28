/**
 * Validation utility functions
 * Pure functions extracted for testing
 */

// Constants
export const MIN_BPM = 20;
export const MAX_BPM = 300;
export const MAX_PRESET_NAME_LENGTH = 50;
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
export const SUPPORTED_AUDIO_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/x-wav'] as const;

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate preset name
 */
export const isValidPresetName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_PRESET_NAME_LENGTH;
};

/**
 * Validate BPM value
 */
export const isValidBpm = (bpm: number): boolean => {
  return Number.isFinite(bpm) && bpm >= MIN_BPM && bpm <= MAX_BPM;
};

/**
 * Validate file size
 */
export const isValidFileSize = (sizeInBytes: number): boolean => {
  return sizeInBytes > 0 && sizeInBytes <= MAX_FILE_SIZE_BYTES;
};

/**
 * Validate audio MIME type
 */
export const isValidAudioFormat = (mimeType: string): boolean => {
  return (SUPPORTED_AUDIO_FORMATS as readonly string[]).includes(mimeType);
};

/**
 * Validate time signature format (e.g., "4/4", "3/4", "6/8")
 */
export const isValidTimeSignature = (timeSignature: string): boolean => {
  const regex = /^\d+\/\d+$/;
  if (!regex.test(timeSignature)) return false;

  const [beats, noteValue] = timeSignature.split('/').map(Number);
  return beats > 0 && beats <= 16 && [2, 4, 8, 16].includes(noteValue);
};

/**
 * Sanitize string input (remove dangerous characters)
 */
export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

/**
 * Validate preset count (max 10)
 */
export const canAddPreset = (currentCount: number, maxCount: number = 10): boolean => {
  return currentCount < maxCount;
};
