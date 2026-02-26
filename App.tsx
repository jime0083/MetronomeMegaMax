import React, { useState, useCallback, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth, SubscriptionProvider } from './src/contexts';
import {
  MainLayout,
  MetronomePanel,
  TimerPanel,
  AudioPlayerPanel,
} from './src/components';
import { useMetronome, useTimer, useAudioPlayer } from './src/hooks';
import type { TimeSignature, AccentPattern } from './src/types';

/**
 * Main app content (requires AuthContext)
 */
function AppContent() {
  // Auth state
  const { isPremium } = useAuth();

  // Metronome state
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [accentPattern, setAccentPattern] = useState<AccentPattern>('first');

  // Use metronome hook for Web Audio API
  const {
    isPlaying: isMetronomePlaying,
    currentBeat,
    toggle: toggleMetronome,
  } = useMetronome({
    bpm,
    timeSignature,
    accentPattern,
  });

  // Timer hook
  const timer = useTimer({
    onComplete: () => {
      // Timer completed - alarm plays automatically
    },
  });

  // Audio player hook
  const audioPlayer = useAudioPlayer();

  // File input ref for web
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Language state
  const [language] = useState('JA');

  // Metronome handlers
  const handleBpmChange = useCallback((newBpm: number) => {
    setBpm(newBpm);
  }, []);

  // File selection handler
  const handleSelectFile = useCallback(() => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
    // iOS file picker will be implemented with native module
  }, []);

  // Handle file input change (Web)
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        audioPlayer.loadFile(file);
      }
    },
    [audioPlayer]
  );

  return (
    <>
      <StatusBar style="light" />
      <MainLayout
        language={language}
        metronomePanel={
          <MetronomePanel
            bpm={bpm}
            timeSignature={timeSignature}
            accentPattern={accentPattern}
            isPlaying={isMetronomePlaying}
            currentBeat={currentBeat}
            onBpmChange={handleBpmChange}
            onTimeSignatureChange={setTimeSignature}
            onAccentPatternChange={setAccentPattern}
            onTogglePlay={toggleMetronome}
          />
        }
        timerPanel={
          <TimerPanel
            remainingSeconds={timer.remainingSeconds}
            totalSeconds={timer.totalSeconds}
            isRunning={timer.isRunning}
            isPaused={timer.isPaused}
            onAddTime={timer.addTime}
            onSetTime={timer.setTime}
            onStart={timer.start}
            onPause={timer.pause}
            onResume={timer.resume}
            onReset={timer.reset}
          />
        }
        audioPanel={
          <>
            <AudioPlayerPanel
              isPlaying={audioPlayer.isPlaying}
              currentTime={audioPlayer.currentTime}
              duration={audioPlayer.duration}
              fileName={audioPlayer.fileName ?? undefined}
              playbackSpeed={audioPlayer.playbackSpeed}
              isLooping={audioPlayer.isLooping}
              loopStart={audioPlayer.loopStart}
              loopEnd={audioPlayer.loopEnd}
              onPlay={audioPlayer.play}
              onPause={audioPlayer.pause}
              onSeek={audioPlayer.seek}
              onSkipBack={() => audioPlayer.skipBack(15)}
              onSkipForward={() => audioPlayer.skipForward(15)}
              onSelectFile={handleSelectFile}
              onSpeedChange={audioPlayer.setPlaybackSpeed}
              onToggleLoop={audioPlayer.toggleLoop}
              onSetLoopStart={audioPlayer.setLoopStart}
              onSetLoopEnd={audioPlayer.setLoopEnd}
              isPremium={isPremium}
            />
            {/* Hidden file input for Web */}
            {Platform.OS === 'web' && (
              <input
                ref={fileInputRef as React.RefObject<HTMLInputElement>}
                type="file"
                accept="audio/mpeg,audio/wav,audio/x-wav"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            )}
          </>
        }
      />
    </>
  );
}

/**
 * App entry point with providers
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <AppContent />
        </SubscriptionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
