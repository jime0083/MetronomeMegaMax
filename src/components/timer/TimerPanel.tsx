import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Panel } from '@/components/layout/Panel';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import { TIMER_INCREMENT_OPTIONS, MAX_TIMER_SECONDS } from '@/constants';

interface TimerPanelProps {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  onAddTime: (seconds: number) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSavePreset?: () => void;
  isPremium?: boolean;
}

export const TimerPanel: React.FC<TimerPanelProps> = ({
  remainingSeconds,
  totalSeconds,
  isRunning,
  isPaused,
  onAddTime,
  onStart,
  onPause,
  onResume,
  onReset,
  onSavePreset,
  isPremium = false,
}) => {
  // Format seconds to HH:MM:SS
  const formatTime = useCallback((totalSecs: number): { hours: string; minutes: string; seconds: string } => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  }, []);

  const timeDisplay = useMemo(
    () => formatTime(remainingSeconds),
    [remainingSeconds, formatTime]
  );

  // Progress percentage
  const progressPercent = useMemo(() => {
    if (totalSeconds === 0) return 0;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  }, [totalSeconds, remainingSeconds]);

  // Format increment button labels
  const formatIncrement = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    return `${seconds / 60}m`;
  };

  const handleAddTime = useCallback(
    (seconds: number) => {
      if (remainingSeconds + seconds <= MAX_TIMER_SECONDS) {
        onAddTime(seconds);
      }
    },
    [remainingSeconds, onAddTime]
  );

  const handleMainButton = useCallback(() => {
    if (!isRunning && !isPaused) {
      onStart();
    } else if (isRunning) {
      onPause();
    } else {
      onResume();
    }
  }, [isRunning, isPaused, onStart, onPause, onResume]);

  const getMainButtonLabel = (): string => {
    if (!isRunning && !isPaused) return 'START';
    if (isRunning) return 'PAUSE';
    return 'RESUME';
  };

  const isAlmostDone = remainingSeconds <= 10 && remainingSeconds > 0 && isRunning;

  return (
    <Panel title="TIMER">
      {/* Circular Progress Ring */}
      <View style={styles.progressContainer}>
        <View style={styles.progressRing}>
          {/* Background ring */}
          <View style={styles.ringBackground} />

          {/* Progress arc - simplified visual representation */}
          <View
            style={[
              styles.progressArc,
              {
                opacity: progressPercent > 0 ? 1 : 0.3,
              },
            ]}
          />

          {/* Time Display */}
          <View style={styles.timeDisplayContainer}>
            <View style={styles.timeRow}>
              <Text style={[styles.timeDigit, isAlmostDone && styles.timeDigitWarning]}>
                {timeDisplay.hours}
              </Text>
              <Text style={[styles.timeSeparator, isAlmostDone && styles.timeDigitWarning]}>:</Text>
              <Text style={[styles.timeDigit, isAlmostDone && styles.timeDigitWarning]}>
                {timeDisplay.minutes}
              </Text>
              <Text style={[styles.timeSeparator, isAlmostDone && styles.timeDigitWarning]}>:</Text>
              <Text style={[styles.timeDigit, isAlmostDone && styles.timeDigitWarning]}>
                {timeDisplay.seconds}
              </Text>
            </View>
            <View style={styles.timeLabels}>
              <Text style={styles.timeLabel}>HRS</Text>
              <Text style={styles.timeLabel}>MIN</Text>
              <Text style={styles.timeLabel}>SEC</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Increment Buttons */}
      <View style={styles.incrementsContainer}>
        <Text style={styles.incrementsLabel}>ADD TIME</Text>
        <View style={styles.incrementsRow}>
          {TIMER_INCREMENT_OPTIONS.map((seconds) => (
            <TouchableOpacity
              key={seconds}
              style={styles.incrementButton}
              onPress={() => handleAddTime(seconds)}
              disabled={isRunning}
              accessibilityLabel={`Add ${formatIncrement(seconds)}`}
            >
              <Text style={[styles.incrementButtonText, isRunning && styles.incrementButtonTextDisabled]}>
                +{formatIncrement(seconds)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.mainButton,
            (isRunning || isPaused) && styles.mainButtonSecondary,
          ]}
          onPress={handleMainButton}
          disabled={totalSeconds === 0 && !isRunning && !isPaused}
        >
          <Text
            style={[
              styles.mainButtonText,
              (isRunning || isPaused) && styles.mainButtonTextSecondary,
            ]}
          >
            {getMainButtonLabel()}
          </Text>
        </TouchableOpacity>

        {(isRunning || isPaused || remainingSeconds !== totalSeconds) && (
          <TouchableOpacity style={styles.resetButton} onPress={onReset}>
            <Text style={styles.resetButtonText}>RESET</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Save Preset Button (Premium) */}
      {isPremium && totalSeconds > 0 && !isRunning && !isPaused && (
        <TouchableOpacity style={styles.saveButton} onPress={onSavePreset}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      )}
    </Panel>
  );
};

const styles = StyleSheet.create({
  // Progress Ring
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  progressRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 110,
    borderWidth: 6,
    borderColor: colors.surface.darkElevated,
  },
  progressArc: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 110,
    borderWidth: 6,
    borderColor: colors.accent[500],
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },

  // Time Display
  timeDisplayContainer: {
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeDigit: {
    color: colors.text.dark.primary,
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.black,
    fontFamily: typography.fontFamily.mono,
    minWidth: 60,
    textAlign: 'center',
  },
  timeDigitWarning: {
    color: colors.warning,
    textShadowColor: colors.warning,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  timeSeparator: {
    color: colors.text.dark.secondary,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.normal,
    marginHorizontal: spacing[1],
  },
  timeLabels: {
    flexDirection: 'row',
    marginTop: spacing[2],
    gap: spacing[8],
  },
  timeLabel: {
    color: colors.text.dark.tertiary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    width: 40,
    textAlign: 'center',
  },

  // Increment Buttons
  incrementsContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  incrementsLabel: {
    color: colors.text.dark.tertiary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginBottom: spacing[3],
  },
  incrementsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[2],
    maxWidth: 320,
  },
  incrementButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface.darkElevated,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.text.dark.tertiary,
    minWidth: 56,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }),
  },
  incrementButtonText: {
    color: colors.text.dark.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.mono,
  },
  incrementButtonTextDisabled: {
    color: colors.text.dark.disabled,
  },

  // Control Buttons
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  mainButton: {
    paddingHorizontal: spacing[10],
    paddingVertical: spacing[4],
    backgroundColor: colors.accent[500],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    shadowColor: colors.accent[500],
  },
  mainButtonSecondary: {
    backgroundColor: colors.surface.darkElevated,
    borderWidth: 2,
    borderColor: colors.accent[500],
    shadowColor: '#000',
  },
  mainButtonText: {
    color: colors.background.dark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
    letterSpacing: 4,
  },
  mainButtonTextSecondary: {
    color: colors.accent[500],
  },
  resetButton: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.text.dark.tertiary,
  },
  resetButtonText: {
    color: colors.text.dark.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },

  // Save Button
  saveButton: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.text.dark.tertiary,
  },
  saveButtonText: {
    color: colors.text.dark.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
});
