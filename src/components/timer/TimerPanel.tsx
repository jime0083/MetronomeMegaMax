import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Panel } from '@/components/layout/Panel';
import { DropdownSelector } from '@/components/common/DropdownSelector';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { TIMER_INCREMENT_OPTIONS, MAX_TIMER_SECONDS, TIMER_PRESET_OPTIONS } from '@/constants';

interface TimerPanelProps {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  onAddTime: (seconds: number) => void;
  onSetTime: (seconds: number) => void;
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
  onSetTime,
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

  // Format preset options for dropdown display
  const presetDropdownOptions = useMemo(() =>
    TIMER_PRESET_OPTIONS.map(opt => ({
      value: opt.value,
      label: opt.label,
    })),
    []
  );

  // Find current preset value (or 0 for custom)
  const currentPresetValue = useMemo(() => {
    const matchingPreset = TIMER_PRESET_OPTIONS.find(opt => opt.value === totalSeconds);
    return matchingPreset ? matchingPreset.value : 0;
  }, [totalSeconds]);

  const handlePresetSelect = useCallback((value: number) => {
    if (value > 0) {
      onSetTime(value);
    }
  }, [onSetTime]);

  return (
    <Panel title="TIMER">
      {/* Time Display */}
      <View style={styles.timeDisplayContainer}>
        <View style={styles.timeRow}>
          <View style={styles.timeDigitContainer}>
            <Text style={[styles.timeDigit, isAlmostDone && styles.timeDigitWarning]}>
              {timeDisplay.hours}
            </Text>
            <Text style={styles.timeLabel}>HRS</Text>
          </View>
          <Text style={[styles.timeSeparator, isAlmostDone && styles.timeDigitWarning]}>:</Text>
          <View style={styles.timeDigitContainer}>
            <Text style={[styles.timeDigit, isAlmostDone && styles.timeDigitWarning]}>
              {timeDisplay.minutes}
            </Text>
            <Text style={styles.timeLabel}>MIN</Text>
          </View>
          <Text style={[styles.timeSeparator, isAlmostDone && styles.timeDigitWarning]}>:</Text>
          <View style={styles.timeDigitContainer}>
            <Text style={[styles.timeDigit, isAlmostDone && styles.timeDigitWarning]}>
              {timeDisplay.seconds}
            </Text>
            <Text style={styles.timeLabel}>SEC</Text>
          </View>
        </View>
      </View>

      {/* Preset Selector */}
      {!isRunning && !isPaused && (
        <View style={styles.presetSelectorContainer}>
          <DropdownSelector
            label="時間を選択"
            value={currentPresetValue}
            options={presetDropdownOptions}
            onChange={handlePresetSelect}
          />
        </View>
      )}

      {/* Increment Buttons */}
      <View style={styles.incrementsContainer}>
        <View style={styles.incrementsRow}>
          {TIMER_INCREMENT_OPTIONS.map((seconds) => (
            <TouchableOpacity
              key={seconds}
              style={[styles.incrementButton, isRunning && styles.incrementButtonDisabled]}
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
  // Time Display
  timeDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    marginTop: spacing[4],
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeDigitContainer: {
    alignItems: 'center',
  },
  timeDigit: {
    color: colors.text.primary,
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.mono,
    minWidth: 70,
    textAlign: 'center',
  },
  timeDigitWarning: {
    color: colors.warning,
  },
  timeSeparator: {
    color: colors.text.secondary,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.normal,
    marginHorizontal: spacing[1],
    marginTop: spacing[1],
  },
  timeLabel: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing[1],
  },

  // Preset Selector
  presetSelectorContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },

  // Increment Buttons
  incrementsContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
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
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.primary,
    minWidth: 56,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }),
  },
  incrementButtonDisabled: {
    borderColor: colors.border.light,
  },
  incrementButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.mono,
  },
  incrementButtonTextDisabled: {
    color: colors.text.disabled,
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
    paddingVertical: spacing[3],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
  mainButtonSecondary: {
    backgroundColor: colors.accent[500],
    borderColor: colors.accent[600],
  },
  mainButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
  mainButtonTextSecondary: {
    color: colors.surface.primary,
  },

  // Save Button
  saveButton: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.secondary,
  },
  saveButtonText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
});
