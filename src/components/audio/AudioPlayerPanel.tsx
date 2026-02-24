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

  const handleSeekBarPress = useCallback(
    (event: { nativeEvent: { locationX: number } }, width: number) => {
      const percent = event.nativeEvent.locationX / width;
      onSeek(percent * duration);
    },
    [duration, onSeek]
  );

  const hasFile = !!fileName;

  return (
    <Panel title="AUDIO">
      {/* File Info */}
      <View style={styles.fileInfoContainer}>
        {fileName ? (
          <>
            <View style={styles.fileIcon}>
              <Text style={styles.fileIconText}>♪</Text>
            </View>
            <Text style={styles.fileName} numberOfLines={1}>
              {fileName}
            </Text>
          </>
        ) : (
          <Text style={styles.noFileText}>No file selected</Text>
        )}
      </View>

      {/* Waveform Visualization (simplified) */}
      <View style={styles.waveformContainer}>
        {Array.from({ length: 40 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              {
                height: 10 + Math.sin(index * 0.3) * 20 + Math.random() * 15,
                opacity: hasFile ? (index * 2.5 < progressPercent ? 1 : 0.3) : 0.15,
                backgroundColor:
                  index * 2.5 < progressPercent ? colors.accent[500] : colors.surface.darkElevated,
              },
            ]}
          />
        ))}
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
            <View style={[styles.loopMarker, styles.loopMarkerStart, { left: `${loopStartPercent}%` }]}>
              <Text style={styles.loopMarkerText}>A</Text>
            </View>
          )}
          {isPremium && loopEndPercent !== null && (
            <View style={[styles.loopMarker, styles.loopMarkerEnd, { left: `${loopEndPercent}%` }]}>
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

      {/* Playback Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.skipButton}
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
          <Text style={styles.playButtonIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkipForward}
          disabled={!hasFile}
          accessibilityLabel="Skip forward 15 seconds"
        >
          <Text style={[styles.skipButtonText, !hasFile && styles.disabledText]}>+15</Text>
        </TouchableOpacity>
      </View>

      {/* A-B Loop Controls (Premium) */}
      {isPremium && hasFile && (
        <View style={styles.loopControlsContainer}>
          <TouchableOpacity
            style={[styles.loopPointButton, loopStart !== null && styles.loopPointButtonActive]}
            onPress={onSetLoopStart}
          >
            <Text style={styles.loopPointButtonText}>A</Text>
            {loopStart !== null && (
              <Text style={styles.loopPointTime}>{formatTime(loopStart)}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loopToggleButton, isLooping && styles.loopToggleButtonActive]}
            onPress={onToggleLoop}
            disabled={loopStart === null || loopEnd === null}
          >
            <Text style={[styles.loopToggleText, isLooping && styles.loopToggleTextActive]}>
              LOOP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loopPointButton, loopEnd !== null && styles.loopPointButtonActive]}
            onPress={onSetLoopEnd}
          >
            <Text style={styles.loopPointButtonText}>B</Text>
            {loopEnd !== null && <Text style={styles.loopPointTime}>{formatTime(loopEnd)}</Text>}
          </TouchableOpacity>
        </View>
      )}

      {/* Speed Control (Premium) */}
      {isPremium && hasFile && (
        <View style={styles.speedControlContainer}>
          <Text style={styles.speedLabel}>SPEED</Text>
          <View style={styles.speedOptions}>
            {PLAYBACK_SPEEDS.map((speed) => (
              <TouchableOpacity
                key={speed}
                style={[styles.speedOption, playbackSpeed === speed && styles.speedOptionActive]}
                onPress={() => onSpeedChange?.(speed)}
              >
                <Text
                  style={[
                    styles.speedOptionText,
                    playbackSpeed === speed && styles.speedOptionTextActive,
                  ]}
                >
                  {speed}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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

      {isPremium && (
        <Text style={styles.fileSizeNote}>Max file size: 20MB (mp3, wav)</Text>
      )}

      {/* Save Loop Point (Premium) */}
      {isPremium && loopStart !== null && loopEnd !== null && (
        <TouchableOpacity style={styles.saveButton} onPress={onSaveLoopPoint}>
          <Text style={styles.saveButtonText}>SAVE LOOP</Text>
        </TouchableOpacity>
      )}
    </Panel>
  );
};

const styles = StyleSheet.create({
  // File Info
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  fileIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIconText: {
    color: colors.background.dark,
    fontSize: typography.fontSize.lg,
  },
  fileName: {
    color: colors.text.dark.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    maxWidth: 200,
  },
  noFileText: {
    color: colors.text.dark.tertiary,
    fontSize: typography.fontSize.sm,
    fontStyle: 'italic',
  },

  // Waveform
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 2,
    marginBottom: spacing[4],
  },
  waveformBar: {
    width: 4,
    borderRadius: 2,
  },

  // Seek Bar
  seekBarContainer: {
    width: '100%',
    marginBottom: spacing[6],
  },
  seekBarTrack: {
    height: 6,
    backgroundColor: colors.surface.darkElevated,
    borderRadius: 3,
    position: 'relative',
    overflow: 'visible',
  },
  seekBarProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: colors.accent[500],
    borderRadius: 3,
  },
  loopRegion: {
    position: 'absolute',
    top: -2,
    height: 10,
    backgroundColor: 'rgba(255, 190, 37, 0.2)',
    borderRadius: 2,
  },
  loopMarker: {
    position: 'absolute',
    top: -14,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -9,
  },
  loopMarkerStart: {},
  loopMarkerEnd: {},
  loopMarkerText: {
    color: colors.background.dark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.black,
  },
  playhead: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.text.dark.primary,
    marginLeft: -7,
    borderWidth: 2,
    borderColor: colors.accent[500],
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[2],
  },
  timeText: {
    color: colors.text.dark.secondary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.mono,
  },

  // Playback Controls
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  skipButton: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.darkElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.text.dark.tertiary,
  },
  skipButtonText: {
    color: colors.text.dark.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.mono,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow,
  },
  playButtonDisabled: {
    backgroundColor: colors.surface.darkElevated,
    shadowOpacity: 0,
  },
  playButtonIcon: {
    color: colors.background.dark,
    fontSize: typography.fontSize['2xl'],
    marginLeft: 3,
  },
  disabledText: {
    color: colors.text.dark.disabled,
  },

  // Loop Controls
  loopControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  loopPointButton: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface.darkElevated,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.text.dark.tertiary,
    minWidth: 60,
  },
  loopPointButtonActive: {
    borderColor: colors.accent[500],
    backgroundColor: 'rgba(255, 190, 37, 0.1)',
  },
  loopPointButtonText: {
    color: colors.text.dark.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
  },
  loopPointTime: {
    color: colors.text.dark.secondary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.mono,
    marginTop: spacing[1],
  },
  loopToggleButton: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.text.dark.tertiary,
  },
  loopToggleButtonActive: {
    borderColor: colors.accent[500],
    backgroundColor: colors.accent[500],
  },
  loopToggleText: {
    color: colors.text.dark.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.black,
    letterSpacing: 2,
  },
  loopToggleTextActive: {
    color: colors.background.dark,
  },

  // Speed Control
  speedControlContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  speedLabel: {
    color: colors.text.dark.tertiary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginBottom: spacing[2],
  },
  speedOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[1],
  },
  speedOption: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface.darkElevated,
  },
  speedOptionActive: {
    backgroundColor: colors.accent[500],
  },
  speedOptionText: {
    color: colors.text.dark.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.mono,
  },
  speedOptionTextActive: {
    color: colors.background.dark,
  },

  // File Actions
  fileActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  selectFileButton: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    backgroundColor: colors.surface.darkElevated,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.text.dark.tertiary,
  },
  selectFileButtonText: {
    color: colors.text.dark.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  uploadButton: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    backgroundColor: colors.accent[500],
    borderRadius: borderRadius.lg,
  },
  uploadButtonText: {
    color: colors.background.dark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  fileSizeNote: {
    color: colors.text.dark.tertiary,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    marginBottom: spacing[4],
  },

  // Save Button
  saveButton: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent[500],
    alignSelf: 'center',
  },
  saveButtonText: {
    color: colors.accent[500],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
});
