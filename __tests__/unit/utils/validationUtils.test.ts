/**
 * Validation utility functions tests
 */

import {
  isValidEmail,
  isValidPresetName,
  isValidBpm,
  isValidFileSize,
  isValidAudioFormat,
  isValidTimeSignature,
  sanitizeString,
  canAddPreset,
  MIN_BPM,
  MAX_BPM,
  MAX_PRESET_NAME_LENGTH,
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_AUDIO_FORMATS,
} from '../../../src/utils/validationUtils';

describe('validationUtils', () => {
  describe('constants', () => {
    it('should have correct BPM range', () => {
      expect(MIN_BPM).toBe(20);
      expect(MAX_BPM).toBe(300);
    });

    it('should have correct preset name length limit', () => {
      expect(MAX_PRESET_NAME_LENGTH).toBe(50);
    });

    it('should have correct file size limit (20MB)', () => {
      expect(MAX_FILE_SIZE_BYTES).toBe(20 * 1024 * 1024);
    });

    it('should have correct supported audio formats', () => {
      expect(SUPPORTED_AUDIO_FORMATS).toContain('audio/mpeg');
      expect(SUPPORTED_AUDIO_FORMATS).toContain('audio/wav');
      expect(SUPPORTED_AUDIO_FORMATS).toContain('audio/x-wav');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.jp')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('user name@domain.com')).toBe(false);
    });
  });

  describe('isValidPresetName', () => {
    it('should return true for valid preset names', () => {
      expect(isValidPresetName('My Preset')).toBe(true);
      expect(isValidPresetName('練習用120BPM')).toBe(true);
      expect(isValidPresetName('a')).toBe(true);
      expect(isValidPresetName('a'.repeat(50))).toBe(true);
    });

    it('should return false for invalid preset names', () => {
      expect(isValidPresetName('')).toBe(false);
      expect(isValidPresetName('   ')).toBe(false);
      expect(isValidPresetName('a'.repeat(51))).toBe(false);
    });

    it('should trim whitespace before validation', () => {
      expect(isValidPresetName('  valid  ')).toBe(true);
    });
  });

  describe('isValidBpm', () => {
    it('should return true for valid BPM values', () => {
      expect(isValidBpm(20)).toBe(true);
      expect(isValidBpm(120)).toBe(true);
      expect(isValidBpm(300)).toBe(true);
    });

    it('should return false for BPM below minimum', () => {
      expect(isValidBpm(19)).toBe(false);
      expect(isValidBpm(0)).toBe(false);
      expect(isValidBpm(-10)).toBe(false);
    });

    it('should return false for BPM above maximum', () => {
      expect(isValidBpm(301)).toBe(false);
      expect(isValidBpm(500)).toBe(false);
    });

    it('should return false for non-finite numbers', () => {
      expect(isValidBpm(Infinity)).toBe(false);
      expect(isValidBpm(-Infinity)).toBe(false);
      expect(isValidBpm(NaN)).toBe(false);
    });
  });

  describe('isValidFileSize', () => {
    it('should return true for valid file sizes', () => {
      expect(isValidFileSize(1)).toBe(true);
      expect(isValidFileSize(1024)).toBe(true);
      expect(isValidFileSize(MAX_FILE_SIZE_BYTES)).toBe(true);
    });

    it('should return false for zero or negative sizes', () => {
      expect(isValidFileSize(0)).toBe(false);
      expect(isValidFileSize(-1)).toBe(false);
    });

    it('should return false for sizes exceeding limit', () => {
      expect(isValidFileSize(MAX_FILE_SIZE_BYTES + 1)).toBe(false);
    });
  });

  describe('isValidAudioFormat', () => {
    it('should return true for supported formats', () => {
      expect(isValidAudioFormat('audio/mpeg')).toBe(true);
      expect(isValidAudioFormat('audio/wav')).toBe(true);
      expect(isValidAudioFormat('audio/x-wav')).toBe(true);
    });

    it('should return false for unsupported formats', () => {
      expect(isValidAudioFormat('audio/ogg')).toBe(false);
      expect(isValidAudioFormat('video/mp4')).toBe(false);
      expect(isValidAudioFormat('application/pdf')).toBe(false);
      expect(isValidAudioFormat('')).toBe(false);
    });
  });

  describe('isValidTimeSignature', () => {
    it('should return true for valid time signatures', () => {
      expect(isValidTimeSignature('2/4')).toBe(true);
      expect(isValidTimeSignature('3/4')).toBe(true);
      expect(isValidTimeSignature('4/4')).toBe(true);
      expect(isValidTimeSignature('6/8')).toBe(true);
      expect(isValidTimeSignature('9/8')).toBe(true);
      expect(isValidTimeSignature('12/8')).toBe(true);
    });

    it('should return false for invalid formats', () => {
      expect(isValidTimeSignature('')).toBe(false);
      expect(isValidTimeSignature('4')).toBe(false);
      expect(isValidTimeSignature('4/4/4')).toBe(false);
      expect(isValidTimeSignature('four/four')).toBe(false);
    });

    it('should return false for invalid beat counts', () => {
      expect(isValidTimeSignature('0/4')).toBe(false);
      expect(isValidTimeSignature('17/4')).toBe(false);
    });

    it('should return false for invalid note values', () => {
      expect(isValidTimeSignature('4/3')).toBe(false);
      expect(isValidTimeSignature('4/5')).toBe(false);
      expect(isValidTimeSignature('4/0')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should remove < and > characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeString('Hello <World>')).toBe('Hello World');
    });

    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('should preserve normal text', () => {
      expect(sanitizeString('My Preset Name')).toBe('My Preset Name');
      expect(sanitizeString('練習用120BPM')).toBe('練習用120BPM');
    });
  });

  describe('canAddPreset', () => {
    it('should return true when under limit', () => {
      expect(canAddPreset(0)).toBe(true);
      expect(canAddPreset(5)).toBe(true);
      expect(canAddPreset(9)).toBe(true);
    });

    it('should return false when at or over limit', () => {
      expect(canAddPreset(10)).toBe(false);
      expect(canAddPreset(15)).toBe(false);
    });

    it('should respect custom max count', () => {
      expect(canAddPreset(4, 5)).toBe(true);
      expect(canAddPreset(5, 5)).toBe(false);
    });
  });
});
