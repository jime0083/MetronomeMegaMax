/**
 * Timer Presets Service
 * Handles timer preset CRUD operations in Firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../firebase/config';
import type { TimerPreset } from '../../types';

const MAX_PRESETS = 10;
const COLLECTION_NAME = 'timerPresets';

/**
 * Firestore timer preset document structure
 */
interface TimerPresetDocument {
  id: string;
  userId: string;
  name: string;
  durationSeconds: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Convert Firestore document to app type
 */
const toAppPreset = (doc: TimerPresetDocument): TimerPreset => ({
  id: doc.id,
  name: doc.name,
  durationSeconds: doc.durationSeconds,
  createdAt: doc.createdAt.toMillis(),
  updatedAt: doc.updatedAt.toMillis(),
});

/**
 * Get all timer presets for a user
 */
export const getTimerPresets = async (userId: string): Promise<TimerPreset[]> => {
  const db = getFirebaseFirestore();
  const presetsRef = collection(db, COLLECTION_NAME);
  const q = query(
    presetsRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(MAX_PRESETS)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) =>
    toAppPreset(docSnap.data() as TimerPresetDocument)
  );
};

/**
 * Get a single timer preset
 */
export const getTimerPreset = async (
  userId: string,
  presetId: string
): Promise<TimerPreset | null> => {
  const db = getFirebaseFirestore();
  const presetRef = doc(db, COLLECTION_NAME, presetId);
  const docSnap = await getDoc(presetRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data() as TimerPresetDocument;

  // Verify ownership
  if (data.userId !== userId) {
    throw new Error('Unauthorized access to preset');
  }

  return toAppPreset(data);
};

/**
 * Create or update a timer preset
 */
export const saveTimerPreset = async (
  userId: string,
  preset: Omit<TimerPreset, 'createdAt' | 'updatedAt'>
): Promise<TimerPreset> => {
  const db = getFirebaseFirestore();

  // Check preset count if creating new
  if (!preset.id.includes('preset_')) {
    const existingPresets = await getTimerPresets(userId);
    if (existingPresets.length >= MAX_PRESETS) {
      throw new Error(`Maximum ${MAX_PRESETS} presets allowed`);
    }
  }

  const now = Timestamp.now();
  const presetRef = doc(db, COLLECTION_NAME, preset.id);
  const existingDoc = await getDoc(presetRef);

  let createdAt = now;
  if (existingDoc.exists()) {
    const existingData = existingDoc.data() as TimerPresetDocument;
    // Verify ownership
    if (existingData.userId !== userId) {
      throw new Error('Unauthorized access to preset');
    }
    createdAt = existingData.createdAt;
  }

  const presetDoc: TimerPresetDocument = {
    id: preset.id,
    userId,
    name: preset.name,
    durationSeconds: preset.durationSeconds,
    createdAt,
    updatedAt: now,
  };

  await setDoc(presetRef, presetDoc);

  return toAppPreset(presetDoc);
};

/**
 * Delete a timer preset
 */
export const deleteTimerPreset = async (
  userId: string,
  presetId: string
): Promise<void> => {
  const db = getFirebaseFirestore();
  const presetRef = doc(db, COLLECTION_NAME, presetId);

  // Verify ownership before deletion
  const docSnap = await getDoc(presetRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as TimerPresetDocument;
    if (data.userId !== userId) {
      throw new Error('Unauthorized access to preset');
    }
  }

  await deleteDoc(presetRef);
};

/**
 * Generate a unique preset ID
 */
export const generateTimerPresetId = (): string => {
  return `preset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Format duration for display
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
