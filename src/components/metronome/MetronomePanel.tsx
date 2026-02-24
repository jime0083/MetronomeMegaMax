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
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import type { TimeSignature, AccentPattern } from '@/types';
import { MIN_BPM, MAX_BPM, TIME_SIGNATURES } from '@/constants';

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
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Parse time signature to get beats per measure
  const beatsPerMeasure = parseInt(timeSignature.split('/')[0], 10);

  // Pendulum animation
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
            duration: duration / 2,
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

  // Glow pulse animation when playing
  useEffect(() => {
    if (isPlaying) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: (60 / bpm) * 1000 - 100,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isPlaying, bpm, glowAnim]);

  const handleBpmIncrement = useCallback(() => {
    if (bpm < MAX_BPM) onBpmChange(bpm + 1);
  }, [bpm, onBpmChange]);

  const handleBpmDecrement = useCallback(() => {
    if (bpm > MIN_BPM) onBpmChange(bpm - 1);
  }, [bpm, onBpmChange]);

  const pendulumRotation = pendulumAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-30deg', '0deg', '30deg'],
  });

  const isAccentBeat = (beat: number): boolean => {
    if (accentPattern === 'first') return beat === 0;
    if (accentPattern === 'first-third') return beat === 0 || beat === 2;
    if (accentPattern === 'second-fourth') return beat === 1 || beat === 3;
    return false;
  };

  return (
    <Panel title="METRONOME">
      {/* Pendulum Container */}
      <View style={styles.pendulumContainer}>
        <View style={styles.pendulumPivot}>
          <View style={styles.pivotDot} />
        </View>
        <Animated.View
          style={[
            styles.pendulumArm,
            {
              transform: [
                { rotate: pendulumRotation },
              ],
            },
          ]}
        >
          <View style={styles.pendulumRod} />
          <Animated.View
            style={[
              styles.pendulumWeight,
              isPlaying && {
                shadowOpacity: glowAnim,
              },
            ]}
          />
        </Animated.View>

        {/* Scale marks */}
        <View style={styles.scaleContainer}>
          {[-3, -2, -1, 0, 1, 2, 3].map((mark) => (
            <View
              key={mark}
              style={[
                styles.scaleMark,
                mark === 0 && styles.scaleMarkCenter,
              ]}
            />
          ))}
        </View>
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
          <Animated.View
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
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>TIME</Text>
          <TouchableOpacity style={styles.selector}>
            <Text style={styles.selectorValue}>{timeSignature}</Text>
            <Text style={styles.selectorChevron}>▾</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>ACCENT</Text>
          <TouchableOpacity style={styles.selector}>
            <Text style={styles.selectorValue}>
              {accentPattern === 'first' ? '1' :
               accentPattern === 'first-third' ? '1・3' : '2・4'}
            </Text>
            <Text style={styles.selectorChevron}>▾</Text>
          </TouchableOpacity>
        </View>
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
  // Pendulum
  pendulumContainer: {
    height: 180,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: spacing[4],
    position: 'relative',
  },
  pendulumPivot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pivotDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent[500],
  },
  pendulumArm: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
    transformOrigin: 'top center',
  },
  pendulumRod: {
    width: 3,
    height: 120,
    backgroundColor: colors.text.dark.tertiary,
    borderRadius: 1.5,
  },
  pendulumWeight: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent[500],
    marginTop: -4,
    ...shadows.glow,
  },
  scaleContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    gap: spacing[4],
  },
  scaleMark: {
    width: 2,
    height: 8,
    backgroundColor: colors.text.dark.tertiary,
    borderRadius: 1,
  },
  scaleMarkCenter: {
    height: 14,
    backgroundColor: colors.accent[500],
  },

  // BPM Controls
  bpmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  bpmButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.text.dark.tertiary,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }),
  },
  bpmButtonText: {
    color: colors.text.dark.primary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.medium,
    marginTop: -2,
  },
  bpmDisplay: {
    alignItems: 'center',
    minWidth: 140,
  },
  bpmValue: {
    color: colors.accent[500],
    fontSize: typography.fontSize['7xl'],
    fontWeight: typography.fontWeight.black,
    fontFamily: typography.fontFamily.mono,
    letterSpacing: -2,
    lineHeight: typography.fontSize['7xl'] * 1.1,
    textShadowColor: colors.accent[500],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  bpmLabel: {
    color: colors.text.dark.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 4,
    marginTop: spacing[1],
  },

  // Beat Indicators
  beatIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  beatDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.beat.inactive,
    borderWidth: 2,
    borderColor: colors.surface.darkElevated,
  },
  beatDotActive: {
    backgroundColor: colors.beat.active,
    shadowColor: colors.beat.active,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  beatDotAccent: {
    borderColor: colors.beat.accent,
    borderWidth: 2,
  },
  beatDotAccentActive: {
    backgroundColor: colors.beat.accent,
    shadowColor: colors.beat.accent,
  },

  // Selectors
  selectorsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  selectorContainer: {
    alignItems: 'center',
  },
  selectorLabel: {
    color: colors.text.dark.tertiary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginBottom: spacing[2],
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface.darkElevated,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.text.dark.tertiary,
    minWidth: 100,
    justifyContent: 'center',
  },
  selectorValue: {
    color: colors.text.dark.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.mono,
  },
  selectorChevron: {
    color: colors.text.dark.tertiary,
    fontSize: typography.fontSize.xs,
    marginLeft: spacing[2],
  },

  // Play Button
  playButton: {
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[4],
    backgroundColor: colors.accent[500],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    shadowColor: colors.accent[500],
    marginBottom: spacing[3],
  },
  playButtonActive: {
    backgroundColor: colors.surface.darkElevated,
    borderWidth: 2,
    borderColor: colors.accent[500],
  },
  playButtonText: {
    color: colors.background.dark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
    letterSpacing: 4,
  },
  playButtonTextActive: {
    color: colors.accent[500],
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
