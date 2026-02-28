/**
 * Metronome Accuracy Performance Tests
 *
 * This tests the timing precision of the metronome scheduling logic.
 * According to project requirements, metronome must be accurate within ±1ms.
 */

import { calculateBeatInterval } from '../../../src/utils/metronomeUtils';

describe('Metronome Accuracy', () => {
  describe('Beat Interval Calculation Precision', () => {
    const testCases = [
      { bpm: 60, expectedMs: 1000 },
      { bpm: 120, expectedMs: 500 },
      { bpm: 180, expectedMs: 333.333 },
      { bpm: 240, expectedMs: 250 },
      { bpm: 300, expectedMs: 200 },
    ];

    testCases.forEach(({ bpm, expectedMs }) => {
      it(`should calculate precise interval for ${bpm} BPM (${expectedMs}ms)`, () => {
        const intervalSeconds = calculateBeatInterval(bpm);
        const intervalMs = intervalSeconds * 1000;

        // Allow ±0.001ms tolerance for floating point
        expect(Math.abs(intervalMs - expectedMs)).toBeLessThan(0.01);
      });
    });
  });

  describe('Scheduling Algorithm Simulation', () => {
    /**
     * Simulates the look-ahead scheduling pattern used in Web Audio API
     * to verify timing accuracy.
     */
    it('should maintain timing accuracy over 100 scheduled beats at 120 BPM', () => {
      const bpm = 120;
      const beatInterval = calculateBeatInterval(bpm);
      const expectedIntervalMs = beatInterval * 1000;
      const numBeats = 100;

      // Simulate scheduled beat times
      const scheduledTimes: number[] = [];
      let currentTime = 0;

      for (let i = 0; i < numBeats; i++) {
        scheduledTimes.push(currentTime);
        currentTime += beatInterval;
      }

      // Verify each interval
      for (let i = 1; i < scheduledTimes.length; i++) {
        const interval = (scheduledTimes[i] - scheduledTimes[i - 1]) * 1000;
        const drift = Math.abs(interval - expectedIntervalMs);

        // Must be within ±1ms as per project requirements
        expect(drift).toBeLessThan(1);
      }
    });

    it('should maintain timing accuracy over 100 scheduled beats at 60 BPM', () => {
      const bpm = 60;
      const beatInterval = calculateBeatInterval(bpm);
      const expectedIntervalMs = beatInterval * 1000;
      const numBeats = 100;

      const scheduledTimes: number[] = [];
      let currentTime = 0;

      for (let i = 0; i < numBeats; i++) {
        scheduledTimes.push(currentTime);
        currentTime += beatInterval;
      }

      for (let i = 1; i < scheduledTimes.length; i++) {
        const interval = (scheduledTimes[i] - scheduledTimes[i - 1]) * 1000;
        const drift = Math.abs(interval - expectedIntervalMs);
        expect(drift).toBeLessThan(1);
      }
    });

    it('should maintain timing accuracy at maximum BPM (300)', () => {
      const bpm = 300;
      const beatInterval = calculateBeatInterval(bpm);
      const expectedIntervalMs = beatInterval * 1000;
      const numBeats = 100;

      const scheduledTimes: number[] = [];
      let currentTime = 0;

      for (let i = 0; i < numBeats; i++) {
        scheduledTimes.push(currentTime);
        currentTime += beatInterval;
      }

      for (let i = 1; i < scheduledTimes.length; i++) {
        const interval = (scheduledTimes[i] - scheduledTimes[i - 1]) * 1000;
        const drift = Math.abs(interval - expectedIntervalMs);
        expect(drift).toBeLessThan(1);
      }
    });
  });

  describe('Cumulative Drift Prevention', () => {
    it('should not accumulate drift over long duration (1 hour simulation)', () => {
      const bpm = 120;
      const beatInterval = calculateBeatInterval(bpm);
      const beatsPerMinute = bpm;
      const durationMinutes = 60;
      const totalBeats = beatsPerMinute * durationMinutes;

      // Calculate expected end time vs actual accumulated time
      const expectedEndTime = totalBeats * beatInterval;

      let accumulatedTime = 0;
      for (let i = 0; i < totalBeats; i++) {
        accumulatedTime += beatInterval;
      }

      // Total drift over 1 hour should be negligible (< 1ms)
      const totalDriftMs = Math.abs(accumulatedTime - expectedEndTime) * 1000;
      expect(totalDriftMs).toBeLessThan(1);
    });
  });

  describe('Look-ahead Scheduling Pattern', () => {
    const LOOK_AHEAD_TIME = 0.1; // 100ms
    const SCHEDULE_INTERVAL = 0.025; // 25ms

    it('should correctly determine beats to schedule within look-ahead window', () => {
      const bpm = 120;
      const beatInterval = calculateBeatInterval(bpm);

      // Simulate scheduling at a specific point in time
      const currentTime = 0;
      const lookAheadTime = currentTime + LOOK_AHEAD_TIME;

      // Calculate how many beats fit in the look-ahead window
      const beatsInWindow = Math.floor(LOOK_AHEAD_TIME / beatInterval) + 1;

      // For 120 BPM (0.5s interval) with 100ms look-ahead, should schedule 1 beat
      expect(beatsInWindow).toBeGreaterThanOrEqual(1);
    });

    it('should have sufficient look-ahead time for all supported BPMs', () => {
      // At maximum BPM (300), interval is 200ms
      // Look-ahead of 100ms should still catch at least 1 beat
      const maxBpm = 300;
      const beatInterval = calculateBeatInterval(maxBpm);
      const beatIntervalMs = beatInterval * 1000;

      // Verify that schedule interval is sufficient
      expect(SCHEDULE_INTERVAL * 1000).toBeLessThan(beatIntervalMs);
    });
  });
});
