/**
 * Timer utility functions tests
 */

import {
  formatTime,
  parseTime,
  clampSeconds,
  validateSeconds,
  addSeconds,
  calculateProgress,
  MAX_SECONDS,
} from '../../../src/utils/timerUtils';

describe('timerUtils', () => {
  describe('formatTime', () => {
    it('should format 0 seconds as 00:00', () => {
      expect(formatTime(0)).toBe('00:00');
    });

    it('should format 30 seconds as 00:30', () => {
      expect(formatTime(30)).toBe('00:30');
    });

    it('should format 60 seconds as 01:00', () => {
      expect(formatTime(60)).toBe('01:00');
    });

    it('should format 90 seconds as 01:30', () => {
      expect(formatTime(90)).toBe('01:30');
    });

    it('should format 3600 seconds (1 hour) as 01:00:00', () => {
      expect(formatTime(3600)).toBe('01:00:00');
    });

    it('should format 3661 seconds as 01:01:01', () => {
      expect(formatTime(3661)).toBe('01:01:01');
    });

    it('should format 7200 seconds (2 hours) as 02:00:00', () => {
      expect(formatTime(7200)).toBe('02:00:00');
    });
  });

  describe('parseTime', () => {
    it('should parse MM:SS format', () => {
      expect(parseTime('01:30')).toBe(90);
      expect(parseTime('00:30')).toBe(30);
      expect(parseTime('05:00')).toBe(300);
    });

    it('should parse HH:MM:SS format', () => {
      expect(parseTime('01:00:00')).toBe(3600);
      expect(parseTime('01:30:00')).toBe(5400);
      expect(parseTime('02:15:30')).toBe(8130);
    });

    it('should return 0 for invalid format', () => {
      expect(parseTime('invalid')).toBe(0);
      expect(parseTime('')).toBe(0);
    });
  });

  describe('clampSeconds', () => {
    it('should return same value for valid seconds', () => {
      expect(clampSeconds(60)).toBe(60);
      expect(clampSeconds(3600)).toBe(3600);
    });

    it('should clamp negative values to 0', () => {
      expect(clampSeconds(-10)).toBe(0);
      expect(clampSeconds(-1000)).toBe(0);
    });

    it('should clamp values above MAX_SECONDS', () => {
      expect(clampSeconds(MAX_SECONDS + 1)).toBe(MAX_SECONDS);
      expect(clampSeconds(MAX_SECONDS + 1000)).toBe(MAX_SECONDS);
    });

    it('should allow MAX_SECONDS (24 hours)', () => {
      expect(clampSeconds(MAX_SECONDS)).toBe(MAX_SECONDS);
    });
  });

  describe('validateSeconds', () => {
    it('should return true for valid seconds', () => {
      expect(validateSeconds(0)).toBe(true);
      expect(validateSeconds(60)).toBe(true);
      expect(validateSeconds(MAX_SECONDS)).toBe(true);
    });

    it('should return false for negative seconds', () => {
      expect(validateSeconds(-1)).toBe(false);
      expect(validateSeconds(-100)).toBe(false);
    });

    it('should return false for seconds above MAX_SECONDS', () => {
      expect(validateSeconds(MAX_SECONDS + 1)).toBe(false);
    });
  });

  describe('addSeconds', () => {
    it('should add seconds correctly', () => {
      expect(addSeconds(60, 30)).toBe(90);
      expect(addSeconds(0, 60)).toBe(60);
    });

    it('should clamp result to MAX_SECONDS', () => {
      expect(addSeconds(MAX_SECONDS - 10, 100)).toBe(MAX_SECONDS);
    });

    it('should clamp negative results to 0', () => {
      expect(addSeconds(10, -100)).toBe(0);
    });
  });

  describe('calculateProgress', () => {
    it('should return 0 for full remaining time', () => {
      expect(calculateProgress(60, 60)).toBe(0);
    });

    it('should return 50 for half remaining time', () => {
      expect(calculateProgress(30, 60)).toBe(50);
    });

    it('should return 100 for no remaining time', () => {
      expect(calculateProgress(0, 60)).toBe(100);
    });

    it('should return 0 for zero total', () => {
      expect(calculateProgress(0, 0)).toBe(0);
    });

    it('should calculate correct progress', () => {
      expect(calculateProgress(45, 60)).toBe(25);
      expect(calculateProgress(15, 60)).toBe(75);
    });
  });

  describe('MAX_SECONDS constant', () => {
    it('should be 24 hours in seconds', () => {
      expect(MAX_SECONDS).toBe(24 * 60 * 60);
      expect(MAX_SECONDS).toBe(86400);
    });
  });
});
