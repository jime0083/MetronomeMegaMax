/**
 * Metronome utility functions tests
 */

import {
  calculateBeatInterval,
  parseTimeSignature,
  isAccentBeat,
  getNextBeat,
  validateBpm,
  clampBpm,
} from '../../../src/utils/metronomeUtils';

describe('metronomeUtils', () => {
  describe('calculateBeatInterval', () => {
    it('should return correct interval for 60 BPM (1 second)', () => {
      expect(calculateBeatInterval(60)).toBe(1);
    });

    it('should return correct interval for 120 BPM (0.5 seconds)', () => {
      expect(calculateBeatInterval(120)).toBe(0.5);
    });

    it('should return correct interval for 240 BPM (0.25 seconds)', () => {
      expect(calculateBeatInterval(240)).toBe(0.25);
    });

    it('should throw error for zero BPM', () => {
      expect(() => calculateBeatInterval(0)).toThrow('BPM must be positive');
    });

    it('should throw error for negative BPM', () => {
      expect(() => calculateBeatInterval(-60)).toThrow('BPM must be positive');
    });
  });

  describe('parseTimeSignature', () => {
    it('should parse 4/4 time signature', () => {
      expect(parseTimeSignature('4/4')).toBe(4);
    });

    it('should parse 3/4 time signature', () => {
      expect(parseTimeSignature('3/4')).toBe(3);
    });

    it('should parse 6/8 time signature', () => {
      expect(parseTimeSignature('6/8')).toBe(6);
    });

    it('should parse 2/4 time signature', () => {
      expect(parseTimeSignature('2/4')).toBe(2);
    });
  });

  describe('isAccentBeat', () => {
    describe('first accent pattern', () => {
      it('should return true for beat 0', () => {
        expect(isAccentBeat(0, 'first')).toBe(true);
      });

      it('should return false for beat 1', () => {
        expect(isAccentBeat(1, 'first')).toBe(false);
      });

      it('should return false for beat 2', () => {
        expect(isAccentBeat(2, 'first')).toBe(false);
      });

      it('should return false for beat 3', () => {
        expect(isAccentBeat(3, 'first')).toBe(false);
      });
    });

    describe('first-third accent pattern', () => {
      it('should return true for beat 0', () => {
        expect(isAccentBeat(0, 'first-third')).toBe(true);
      });

      it('should return false for beat 1', () => {
        expect(isAccentBeat(1, 'first-third')).toBe(false);
      });

      it('should return true for beat 2', () => {
        expect(isAccentBeat(2, 'first-third')).toBe(true);
      });

      it('should return false for beat 3', () => {
        expect(isAccentBeat(3, 'first-third')).toBe(false);
      });
    });

    describe('second-fourth accent pattern', () => {
      it('should return false for beat 0', () => {
        expect(isAccentBeat(0, 'second-fourth')).toBe(false);
      });

      it('should return true for beat 1', () => {
        expect(isAccentBeat(1, 'second-fourth')).toBe(true);
      });

      it('should return false for beat 2', () => {
        expect(isAccentBeat(2, 'second-fourth')).toBe(false);
      });

      it('should return true for beat 3', () => {
        expect(isAccentBeat(3, 'second-fourth')).toBe(true);
      });
    });

  });

  describe('getNextBeat', () => {
    it('should return next beat in 4/4 time', () => {
      expect(getNextBeat(0, 4)).toBe(1);
      expect(getNextBeat(1, 4)).toBe(2);
      expect(getNextBeat(2, 4)).toBe(3);
    });

    it('should wrap around at end of measure', () => {
      expect(getNextBeat(3, 4)).toBe(0);
    });

    it('should work with 3/4 time', () => {
      expect(getNextBeat(2, 3)).toBe(0);
    });

    it('should work with 6/8 time', () => {
      expect(getNextBeat(5, 6)).toBe(0);
    });
  });

  describe('validateBpm', () => {
    it('should return true for valid BPM (20-300)', () => {
      expect(validateBpm(20)).toBe(true);
      expect(validateBpm(120)).toBe(true);
      expect(validateBpm(300)).toBe(true);
    });

    it('should return false for BPM below 20', () => {
      expect(validateBpm(19)).toBe(false);
      expect(validateBpm(0)).toBe(false);
      expect(validateBpm(-10)).toBe(false);
    });

    it('should return false for BPM above 300', () => {
      expect(validateBpm(301)).toBe(false);
      expect(validateBpm(500)).toBe(false);
    });
  });

  describe('clampBpm', () => {
    it('should return same value for valid BPM', () => {
      expect(clampBpm(120)).toBe(120);
      expect(clampBpm(60)).toBe(60);
    });

    it('should clamp to minimum 20', () => {
      expect(clampBpm(10)).toBe(20);
      expect(clampBpm(0)).toBe(20);
      expect(clampBpm(-50)).toBe(20);
    });

    it('should clamp to maximum 300', () => {
      expect(clampBpm(350)).toBe(300);
      expect(clampBpm(1000)).toBe(300);
    });
  });
});
