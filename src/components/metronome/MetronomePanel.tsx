import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Panel } from '@/components/layout/Panel';
import { DropdownSelector } from '@/components/common/DropdownSelector';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import type { TimeSignature, AccentPattern } from '@/types';
import { MIN_BPM, MAX_BPM } from '@/constants';

// Time signature options
const TIME_SIGNATURE_OPTIONS: { value: TimeSignature; label: string }[] = [
  { value: '2/4', label: '2/4' },
  { value: '3/4', label: '3/4' },
  { value: '4/4', label: '4/4' },
  { value: '5/4', label: '5/4' },
  { value: '6/4', label: '6/4' },
  { value: '7/4', label: '7/4' },
  { value: '3/8', label: '3/8' },
  { value: '6/8', label: '6/8' },
  { value: '9/8', label: '9/8' },
  { value: '12/8', label: '12/8' },
];

// Accent pattern options
const ACCENT_PATTERN_OPTIONS: { value: AccentPattern; label: string }[] = [
  { value: 'first', label: '1拍目' },
  { value: 'first-third', label: '1・3拍目' },
  { value: 'second-fourth', label: '2・4拍目' },
];

interface MetronomePanelProps {
  bpm: number;
  timeSignature: TimeSignature;
  accentPattern: AccentPattern;
  isPlaying: boolean;
  currentBeat: number;
  onBpmChange: (bpm: number) => void;
  onTimeSignatureChange: (ts: TimeSignature) => void;
  onAccentPatternChange: (pattern: AccentPattern) => void;
  onTogglePlay: () => void;
  onSavePreset?: () => void;
  isPremium?: boolean;
}

// Get tempo name from BPM
const getTempoName = (bpm: number): string => {
  if (bpm < 40) return 'Grave';
  if (bpm < 60) return 'Largo';
  if (bpm < 66) return 'Larghetto';
  if (bpm < 76) return 'Adagio';
  if (bpm < 108) return 'Andante';
  if (bpm < 120) return 'Moderato';
  if (bpm < 156) return 'Allegro';
  if (bpm < 176) return 'Vivace';
  if (bpm < 200) return 'Presto';
  return 'Prestissimo';
};

export const MetronomePanel: React.FC<MetronomePanelProps> = ({
  bpm,
  timeSignature,
  accentPattern,
  isPlaying,
  currentBeat,
  onBpmChange,
  onTimeSignatureChange,
  onAccentPatternChange,
  onTogglePlay,
  onSavePreset,
  isPremium = false,
}) => {
  const pendulumAnim = useRef(new Animated.Value(0)).current;

  // Parse time signature to get beats per measure
  const beatsPerMeasure = parseInt(timeSignature.split('/')[0], 10);

  // Vertical pendulum animation - swings left and right
  useEffect(() => {
    if (isPlaying) {
      const duration = (60 / bpm) * 1000; // One beat duration in ms

      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pendulumAnim, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pendulumAnim, {
            toValue: -1,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pendulumAnim, {
            toValue: 0,
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );

      animation.start();
      return () => animation.stop();
    } else {
      Animated.timing(pendulumAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isPlaying, bpm, pendulumAnim]);

  const handleBpmIncrement = useCallback(() => {
    if (bpm < MAX_BPM) onBpmChange(bpm + 1);
  }, [bpm, onBpmChange]);

  const handleBpmDecrement = useCallback(() => {
    if (bpm > MIN_BPM) onBpmChange(bpm - 1);
  }, [bpm, onBpmChange]);

  // Pendulum rotation (swinging from top pivot point)
  const pendulumRotation = pendulumAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-25deg', '0deg', '25deg'],
  });

  const isAccentBeat = (beat: number): boolean => {
    if (accentPattern === 'first') return beat === 0;
    if (accentPattern === 'first-third') return beat === 0 || beat === 2;
    if (accentPattern === 'second-fourth') return beat === 1 || beat === 3;
    return false;
  };

  return (
    <Panel title="METRONOME">
      {/* Tempo Name */}
      <Text style={styles.tempoName}>{getTempoName(bpm)}</Text>

      {/* Vertical Pendulum Container */}
      <View style={styles.pendulumContainer}>
        {/* Pendulum arm with pivot at top */}
        <Animated.View
          style={[
            styles.pendulumArm,
            {
              transform: [{ rotate: pendulumRotation }],
            },
          ]}
        >
          {/* Pendulum rod (orange) */}
          <View style={styles.pendulumRod} />
          {/* Pendulum weight (white circle) */}
          <View style={styles.pendulumWeight} />
        </Animated.View>

        {/* Pivot point at top */}
        <View style={styles.pendulumPivot} />
      </View>

      {/* BPM Display */}
      <View style={styles.bpmContainer}>
        <TouchableOpacity
          style={styles.bpmButton}
          onPress={handleBpmDecrement}
          onLongPress={() => onBpmChange(Math.max(MIN_BPM, bpm - 10))}
          accessibilityLabel="Decrease BPM"
        >
          <Text style={styles.bpmButtonText}>−</Text>
        </TouchableOpacity>

        <View style={styles.bpmDisplay}>
          <Text style={styles.bpmValue}>{bpm}</Text>
          <Text style={styles.bpmLabel}>BPM</Text>
        </View>

        <TouchableOpacity
          style={styles.bpmButton}
          onPress={handleBpmIncrement}
          onLongPress={() => onBpmChange(Math.min(MAX_BPM, bpm + 10))}
          accessibilityLabel="Increase BPM"
        >
          <Text style={styles.bpmButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Beat Indicators */}
      <View style={styles.beatIndicators}>
        {Array.from({ length: beatsPerMeasure }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.beatDot,
              currentBeat === index && isPlaying && styles.beatDotActive,
              isAccentBeat(index) && styles.beatDotAccent,
              currentBeat === index && isPlaying && isAccentBeat(index) && styles.beatDotAccentActive,
            ]}
          />
        ))}
      </View>

      {/* Selectors Row */}
      <View style={styles.selectorsRow}>
        <DropdownSelector
          label="TIME"
          value={timeSignature}
          options={TIME_SIGNATURE_OPTIONS}
          onChange={onTimeSignatureChange}
        />

        <DropdownSelector
          label="ACCENT"
          value={accentPattern}
          options={ACCENT_PATTERN_OPTIONS}
          onChange={onAccentPatternChange}
          displayValue={
            accentPattern === 'first'
              ? '1'
              : accentPattern === 'first-third'
                ? '1・3'
                : '2・4'
          }
        />
      </View>

      {/* Start/Stop Button */}
      <TouchableOpacity
        style={[styles.playButton, isPlaying && styles.playButtonActive]}
        onPress={onTogglePlay}
        accessibilityLabel={isPlaying ? 'Stop metronome' : 'Start metronome'}
      >
        <Text style={[styles.playButtonText, isPlaying && styles.playButtonTextActive]}>
          {isPlaying ? 'STOP' : 'START'}
        </Text>
      </TouchableOpacity>

      {/* Save Preset Button (Premium) */}
      {isPremium && (
        <TouchableOpacity style={styles.saveButton} onPress={onSavePreset}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      )}
    </Panel>
  );
};

const styles = StyleSheet.create({
  // Tempo Name
  tempoName: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[2],
    letterSpacing: 1,
  },

  // Pendulum
  pendulumContainer: {
    height: 160,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: spacing[4],
    position: 'relative',
  },
  pendulumPivot: {
    position: 'absolute',
    top: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border.primary,
    zIndex: 10,
  },
  pendulumArm: {
    position: 'absolute',
    top: 6,
    alignItems: 'center',
    transformOrigin: 'top center',
  },
  pendulumRod: {
    width: 6,
    height: 110,
    backgroundColor: colors.accent[500],
    borderRadius: 3,
  },
  pendulumWeight: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface.primary,
    marginTop: -4,
    borderWidth: 3,
    borderColor: colors.border.primary,
  },

  // BPM Controls
  bpmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
    marginBottom: spacing[4],
  },
  bpmButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border.primary,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }),
  },
  bpmButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.medium,
    marginTop: -2,
  },
  bpmDisplay: {
    alignItems: 'center',
    minWidth: 100,
  },
  bpmValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.mono,
    letterSpacing: -1,
    lineHeight: typography.fontSize['5xl'] * 1.1,
  },
  bpmLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing[1],
  },

  // Beat Indicators
  beatIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  beatDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.beat.inactive,
    borderWidth: 2,
    borderColor: colors.border.secondary,
  },
  beatDotActive: {
    backgroundColor: colors.beat.active,
    borderColor: colors.accent[600],
  },
  beatDotAccent: {
    borderColor: colors.accent[500],
    borderWidth: 2,
  },
  beatDotAccentActive: {
    backgroundColor: colors.beat.accent,
    borderColor: colors.beat.accent,
  },

  // Selectors
  selectorsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[4],
    marginBottom: spacing[4],
  },

  // Play Button
  playButton: {
    paddingHorizontal: spacing[10],
    paddingVertical: spacing[3],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border.primary,
    marginBottom: spacing[3],
  },
  playButtonActive: {
    backgroundColor: colors.accent[500],
    borderColor: colors.accent[600],
  },
  playButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
  playButtonTextActive: {
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
