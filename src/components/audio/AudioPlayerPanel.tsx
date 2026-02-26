import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Panel } from '@/components/layout/Panel';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import type { PlaybackSpeed } from '@/types';
import { PLAYBACK_SPEEDS } from '@/constants';

interface AudioPlayerPanelProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  fileName?: string;
  playbackSpeed: PlaybackSpeed;
  isLooping: boolean;
  loopStart: number | null;
  loopEnd: number | null;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onSelectFile: () => void;
  onSpeedChange?: (speed: PlaybackSpeed) => void;
  onToggleLoop?: () => void;
  onSetLoopStart?: () => void;
  onSetLoopEnd?: () => void;
  onSaveLoopPoint?: () => void;
  onUpload?: () => void;
  isPremium?: boolean;
}

export const AudioPlayerPanel: React.FC<AudioPlayerPanelProps> = ({
  isPlaying,
  currentTime,
  duration,
  fileName,
  playbackSpeed,
  isLooping,
  loopStart,
  loopEnd,
  onPlay,
  onPause,
  onSeek,
  onSkipBack,
  onSkipForward,
  onSelectFile,
  onSpeedChange,
  onToggleLoop,
  onSetLoopStart,
  onSetLoopEnd,
  onSaveLoopPoint,
  onUpload,
  isPremium = false,
}) => {
  // Format time to MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const currentTimeFormatted = useMemo(() => formatTime(currentTime), [currentTime, formatTime]);
  const durationFormatted = useMemo(() => formatTime(duration), [duration, formatTime]);

  // Progress percentage
  const progressPercent = useMemo(() => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  // Loop markers percentages
  const loopStartPercent = useMemo(() => {
    if (loopStart === null || duration === 0) return null;
    return (loopStart / duration) * 100;
  }, [loopStart, duration]);

  const loopEndPercent = useMemo(() => {
    if (loopEnd === null || duration === 0) return null;
    return (loopEnd / duration) * 100;
  }, [loopEnd, duration]);

  const hasFile = !!fileName;

  return (
    <Panel title="AUDIO">
      {/* File Info */}
      <View style={styles.fileInfoContainer}>
        {fileName ? (
          <Text style={styles.fileName} numberOfLines={1}>
            {fileName}
          </Text>
        ) : (
          <Text style={styles.noFileText}>No file selected</Text>
        )}
      </View>

      {/* Playback Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.skipButton, !hasFile && styles.buttonDisabled]}
          onPress={onSkipBack}
          disabled={!hasFile}
          accessibilityLabel="Skip back 15 seconds"
        >
          <Text style={[styles.skipButtonText, !hasFile && styles.disabledText]}>-15</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, !hasFile && styles.playButtonDisabled]}
          onPress={isPlaying ? onPause : onPlay}
          disabled={!hasFile}
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        >
          <Text style={[styles.playButtonIcon, !hasFile && styles.disabledText]}>
            {isPlaying ? '❚❚' : '▶'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.skipButton, !hasFile && styles.buttonDisabled]}
          onPress={onSkipForward}
          disabled={!hasFile}
          accessibilityLabel="Skip forward 15 seconds"
        >
          <Text style={[styles.skipButtonText, !hasFile && styles.disabledText]}>+15</Text>
        </TouchableOpacity>
      </View>

      {/* Seek Bar */}
      <View style={styles.seekBarContainer}>
        <View style={styles.seekBarTrack}>
          {/* Loop region highlight */}
          {isPremium && loopStartPercent !== null && loopEndPercent !== null && (
            <View
              style={[
                styles.loopRegion,
                {
                  left: `${loopStartPercent}%`,
                  width: `${loopEndPercent - loopStartPercent}%`,
                },
              ]}
            />
          )}

          {/* Progress */}
          <View style={[styles.seekBarProgress, { width: `${progressPercent}%` }]} />

          {/* Loop markers */}
          {isPremium && loopStartPercent !== null && (
            <View style={[styles.loopMarker, { left: `${loopStartPercent}%` }]}>
              <Text style={styles.loopMarkerText}>A</Text>
            </View>
          )}
          {isPremium && loopEndPercent !== null && (
            <View style={[styles.loopMarker, { left: `${loopEndPercent}%` }]}>
              <Text style={styles.loopMarkerText}>B</Text>
            </View>
          )}

          {/* Playhead */}
          <View style={[styles.playhead, { left: `${progressPercent}%` }]} />
        </View>

        {/* Time display */}
        <View style={styles.timeDisplay}>
          <Text style={styles.timeText}>{currentTimeFormatted}</Text>
          <Text style={styles.timeText}>{durationFormatted}</Text>
        </View>
      </View>

      {/* A-B Loop Controls (Premium) */}
      {isPremium && hasFile && (
        <View style={styles.loopControlsContainer}>
          <View style={styles.loopInputContainer}>
            <Text style={styles.loopInputLabel}>A</Text>
            <View style={styles.loopInput}>
              <Text style={styles.loopInputText}>
                {loopStart !== null ? formatTime(loopStart) : '00:00'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loopToggleButton, isLooping && styles.loopToggleButtonActive]}
            onPress={onToggleLoop}
            disabled={loopStart === null || loopEnd === null}
          >
            <Text style={[styles.loopToggleText, isLooping && styles.loopToggleTextActive]}>
              LOOP
            </Text>
          </TouchableOpacity>

          <View style={styles.loopInputContainer}>
            <Text style={styles.loopInputLabel}>B</Text>
            <View style={styles.loopInput}>
              <Text style={styles.loopInputText}>
                {loopEnd !== null ? formatTime(loopEnd) : '00:00'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Speed Control (Premium) */}
      {isPremium && hasFile && (
        <View style={styles.speedControlContainer}>
          <Text style={styles.speedLabel}>SPEED</Text>
          <TouchableOpacity style={styles.speedSelector}>
            <Text style={styles.speedSelectorText}>{playbackSpeed}x</Text>
            <Text style={styles.speedChevron}>▾</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* File Selection */}
      <View style={styles.fileActionsContainer}>
        <TouchableOpacity style={styles.selectFileButton} onPress={onSelectFile}>
          <Text style={styles.selectFileButtonText}>SELECT FILE</Text>
        </TouchableOpacity>

        {isPremium && hasFile && (
          <TouchableOpacity style={styles.uploadButton} onPress={onUpload}>
            <Text style={styles.uploadButtonText}>UPLOAD</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Save Loop Point (Premium) */}
      {isPremium && hasFile && (
        <TouchableOpacity style={styles.saveButton} onPress={onSaveLoopPoint}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      )}
    </Panel>
  );
};

const styles = StyleSheet.create({
  // File Info
  fileInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    marginTop: spacing[2],
  },
  fileName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    maxWidth: 200,
  },
  noFileText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontStyle: 'italic',
  },

  // Playback Controls
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  skipButton: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
  buttonDisabled: {
    borderColor: colors.border.light,
  },
  skipButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.mono,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
  playButtonDisabled: {
    borderColor: colors.border.light,
  },
  playButtonIcon: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    marginLeft: 2,
  },
  disabledText: {
    color: colors.text.disabled,
  },

  // Seek Bar
  seekBarContainer: {
    width: '100%',
    marginBottom: spacing[4],
    paddingHorizontal: spacing[2],
  },
  seekBarTrack: {
    height: 8,
    backgroundColor: colors.surface.border,
    borderRadius: 4,
    position: 'relative',
    overflow: 'visible',
  },
  seekBarProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: colors.accent[500],
    borderRadius: 4,
  },
  loopRegion: {
    position: 'absolute',
    top: -2,
    height: 12,
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    borderRadius: 2,
  },
  loopMarker: {
    position: 'absolute',
    top: -12,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  loopMarkerText: {
    color: colors.surface.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.black,
  },
  playhead: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.surface.primary,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[2],
  },
  timeText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.mono,
  },

  // Loop Controls
  loopControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  loopInputContainer: {
    alignItems: 'center',
  },
  loopInputLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[1],
  },
  loopInput: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.primary,
    minWidth: 70,
    alignItems: 'center',
  },
  loopInputText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.mono,
  },
  loopToggleButton: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border.primary,
    backgroundColor: colors.surface.primary,
  },
  loopToggleButtonActive: {
    borderColor: colors.accent[500],
    backgroundColor: colors.accent[500],
  },
  loopToggleText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
  loopToggleTextActive: {
    color: colors.surface.primary,
  },

  // Speed Control
  speedControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  speedLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  speedSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
  speedSelectorText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.mono,
  },
  speedChevron: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    marginLeft: spacing[2],
  },

  // File Actions
  fileActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  selectFileButton: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
  selectFileButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  uploadButton: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    backgroundColor: colors.accent[500],
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.accent[600],
  },
  uploadButtonText: {
    color: colors.surface.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },

  // Save Button
  saveButton: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
});
