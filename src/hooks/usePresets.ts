/**
 * Presets Hook
 * Manages BPM and Timer presets with cloud sync
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getBpmPresets,
  saveBpmPreset,
  deleteBpmPreset,
  generatePresetId,
  getTimerPresets,
  saveTimerPreset,
  deleteTimerPreset,
  generateTimerPresetId,
} from '../services/presets';
import type { BpmPreset, TimerPreset, TimeSignature, AccentPattern } from '../types';

/**
 * BPM Presets Hook
 */
interface UseBpmPresetsResult {
  presets: BpmPreset[];
  isLoading: boolean;
  error: string | null;
  savePreset: (data: {
    name: string;
    bpm: number;
    timeSignature: TimeSignature;
    accentPattern: AccentPattern;
  }) => Promise<BpmPreset>;
  updatePreset: (
    id: string,
    data: {
      name: string;
      bpm: number;
      timeSignature: TimeSignature;
      accentPattern: AccentPattern;
    }
  ) => Promise<BpmPreset>;
  deletePreset: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  canSave: boolean;
}

export const useBpmPresets = (): UseBpmPresetsResult => {
  const { user, isPremium } = useAuth();
  const [presets, setPresets] = useState<BpmPreset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(() => isPremium && presets.length < 10, [isPremium, presets.length]);

  const loadPresets = useCallback(async () => {
    if (!user?.uid) {
      setPresets([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const loadedPresets = await getBpmPresets(user.uid);
      setPresets(loadedPresets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load presets');
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  const savePreset = useCallback(
    async (data: {
      name: string;
      bpm: number;
      timeSignature: TimeSignature;
      accentPattern: AccentPattern;
    }): Promise<BpmPreset> => {
      if (!user?.uid) {
        throw new Error('Not logged in');
      }

      if (!isPremium) {
        throw new Error('Premium subscription required');
      }

      const preset = await saveBpmPreset(user.uid, {
        id: generatePresetId(),
        ...data,
      });

      setPresets((prev) => [preset, ...prev].slice(0, 10));
      return preset;
    },
    [user?.uid, isPremium]
  );

  const updatePreset = useCallback(
    async (
      id: string,
      data: {
        name: string;
        bpm: number;
        timeSignature: TimeSignature;
        accentPattern: AccentPattern;
      }
    ): Promise<BpmPreset> => {
      if (!user?.uid) {
        throw new Error('Not logged in');
      }

      const preset = await saveBpmPreset(user.uid, { id, ...data });

      setPresets((prev) =>
        prev.map((p) => (p.id === id ? preset : p))
      );
      return preset;
    },
    [user?.uid]
  );

  const deletePreset = useCallback(
    async (id: string): Promise<void> => {
      if (!user?.uid) {
        throw new Error('Not logged in');
      }

      await deleteBpmPreset(user.uid, id);
      setPresets((prev) => prev.filter((p) => p.id !== id));
    },
    [user?.uid]
  );

  return {
    presets,
    isLoading,
    error,
    savePreset,
    updatePreset,
    deletePreset,
    refresh: loadPresets,
    canSave,
  };
};

/**
 * Timer Presets Hook
 */
interface UseTimerPresetsResult {
  presets: TimerPreset[];
  isLoading: boolean;
  error: string | null;
  savePreset: (data: { name: string; durationSeconds: number }) => Promise<TimerPreset>;
  updatePreset: (
    id: string,
    data: { name: string; durationSeconds: number }
  ) => Promise<TimerPreset>;
  deletePreset: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  canSave: boolean;
}

export const useTimerPresets = (): UseTimerPresetsResult => {
  const { user, isPremium } = useAuth();
  const [presets, setPresets] = useState<TimerPreset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(() => isPremium && presets.length < 10, [isPremium, presets.length]);

  const loadPresets = useCallback(async () => {
    if (!user?.uid) {
      setPresets([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const loadedPresets = await getTimerPresets(user.uid);
      setPresets(loadedPresets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load presets');
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  const savePreset = useCallback(
    async (data: { name: string; durationSeconds: number }): Promise<TimerPreset> => {
      if (!user?.uid) {
        throw new Error('Not logged in');
      }

      if (!isPremium) {
        throw new Error('Premium subscription required');
      }

      const preset = await saveTimerPreset(user.uid, {
        id: generateTimerPresetId(),
        ...data,
      });

      setPresets((prev) => [preset, ...prev].slice(0, 10));
      return preset;
    },
    [user?.uid, isPremium]
  );

  const updatePreset = useCallback(
    async (
      id: string,
      data: { name: string; durationSeconds: number }
    ): Promise<TimerPreset> => {
      if (!user?.uid) {
        throw new Error('Not logged in');
      }

      const preset = await saveTimerPreset(user.uid, { id, ...data });

      setPresets((prev) =>
        prev.map((p) => (p.id === id ? preset : p))
      );
      return preset;
    },
    [user?.uid]
  );

  const deletePreset = useCallback(
    async (id: string): Promise<void> => {
      if (!user?.uid) {
        throw new Error('Not logged in');
      }

      await deleteTimerPreset(user.uid, id);
      setPresets((prev) => prev.filter((p) => p.id !== id));
    },
    [user?.uid]
  );

  return {
    presets,
    isLoading,
    error,
    savePreset,
    updatePreset,
    deletePreset,
    refresh: loadPresets,
    canSave,
  };
};
