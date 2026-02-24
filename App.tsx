import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  MainLayout,
  MetronomePanel,
  TimerPanel,
  AudioPlayerPanel,
} from './src/components';
import type { TimeSignature, AccentPattern, PlaybackSpeed } from './src/types';

export default function App() {
  // Metronome state
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [accentPattern, setAccentPattern] = useState<AccentPattern>('first');
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTotal, setTimerTotal] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Audio state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioFileName, setAudioFileName] = useState<string | undefined>(undefined);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [isLooping, setIsLooping] = useState(false);
  const [loopStart, setLoopStart] = useState<number | null>(null);
  const [loopEnd, setLoopEnd] = useState<number | null>(null);

  // Language state
  const [language, setLanguage] = useState('JA');

  // Metronome handlers
  const handleBpmChange = useCallback((newBpm: number) => {
    setBpm(newBpm);
  }, []);

  const handleToggleMetronome = useCallback(() => {
    setIsMetronomePlaying((prev) => !prev);
    if (!isMetronomePlaying) {
      setCurrentBeat(0);
    }
  }, [isMetronomePlaying]);

  // Timer handlers
  const handleAddTime = useCallback((seconds: number) => {
    setTimerSeconds((prev) => prev + seconds);
    setTimerTotal((prev) => prev + seconds);
  }, []);

  const handleTimerStart = useCallback(() => {
    if (timerSeconds > 0) {
      setIsTimerRunning(true);
      setIsTimerPaused(false);
    }
  }, [timerSeconds]);

  const handleTimerPause = useCallback(() => {
    setIsTimerRunning(false);
    setIsTimerPaused(true);
  }, []);

  const handleTimerResume = useCallback(() => {
    setIsTimerRunning(true);
    setIsTimerPaused(false);
  }, []);

  const handleTimerReset = useCallback(() => {
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setTimerSeconds(0);
    setTimerTotal(0);
  }, []);

  // Audio handlers
  const handleAudioPlay = useCallback(() => {
    setIsAudioPlaying(true);
  }, []);

  const handleAudioPause = useCallback(() => {
    setIsAudioPlaying(false);
  }, []);

  const handleAudioSeek = useCallback((time: number) => {
    setAudioCurrentTime(time);
  }, []);

  const handleSelectFile = useCallback(() => {
    // File picker will be implemented later
    setAudioFileName('sample-track.mp3');
    setAudioDuration(180); // 3 minutes for demo
  }, []);

  const handleSetLoopStart = useCallback(() => {
    setLoopStart(audioCurrentTime);
  }, [audioCurrentTime]);

  const handleSetLoopEnd = useCallback(() => {
    setLoopEnd(audioCurrentTime);
  }, [audioCurrentTime]);

  return (
    <SafeAreaProvider>
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
            onTogglePlay={handleToggleMetronome}
          />
        }
        timerPanel={
          <TimerPanel
            remainingSeconds={timerSeconds}
            totalSeconds={timerTotal}
            isRunning={isTimerRunning}
            isPaused={isTimerPaused}
            onAddTime={handleAddTime}
            onStart={handleTimerStart}
            onPause={handleTimerPause}
            onResume={handleTimerResume}
            onReset={handleTimerReset}
          />
        }
        audioPanel={
          <AudioPlayerPanel
            isPlaying={isAudioPlaying}
            currentTime={audioCurrentTime}
            duration={audioDuration}
            fileName={audioFileName}
            playbackSpeed={playbackSpeed}
            isLooping={isLooping}
            loopStart={loopStart}
            loopEnd={loopEnd}
            onPlay={handleAudioPlay}
            onPause={handleAudioPause}
            onSeek={handleAudioSeek}
            onSkipBack={() => handleAudioSeek(Math.max(0, audioCurrentTime - 15))}
            onSkipForward={() => handleAudioSeek(Math.min(audioDuration, audioCurrentTime + 15))}
            onSelectFile={handleSelectFile}
            onSpeedChange={setPlaybackSpeed}
            onToggleLoop={() => setIsLooping((prev) => !prev)}
            onSetLoopStart={handleSetLoopStart}
            onSetLoopEnd={handleSetLoopEnd}
            isPremium={true} // For demo purposes
          />
        }
      />
    </SafeAreaProvider>
  );
}
