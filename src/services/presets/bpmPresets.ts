/**
 * BPM Presets Service
 * Handles BPM preset CRUD operations in Firestore
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
import type { BpmPreset, TimeSignature, AccentPattern } from '../../types';

const MAX_PRESETS = 10;
const COLLECTION_NAME = 'bpmPresets';

/**
 * Firestore BPM preset document structure
 */
interface BpmPresetDocument {
  id: string;
  userId: string;
  name: string;
  bpm: number;
  timeSignature: TimeSignature;
  accentPattern: AccentPattern;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Convert Firestore document to app type
 */
const toAppPreset = (doc: BpmPresetDocument): BpmPreset => ({
  id: doc.id,
  name: doc.name,
  bpm: doc.bpm,
  timeSignature: doc.timeSignature,
  accentPattern: doc.accentPattern,
  createdAt: doc.createdAt.toMillis(),
  updatedAt: doc.updatedAt.toMillis(),
});

/**
 * Get all BPM presets for a user
 */
export const getBpmPresets = async (userId: string): Promise<BpmPreset[]> => {
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
    toAppPreset(docSnap.data() as BpmPresetDocument)
  );
};

/**
 * Get a single BPM preset
 */
export const getBpmPreset = async (
  userId: string,
  presetId: string
): Promise<BpmPreset | null> => {
  const db = getFirebaseFirestore();
  const presetRef = doc(db, COLLECTION_NAME, presetId);
  const docSnap = await getDoc(presetRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data() as BpmPresetDocument;

  // Verify ownership
  if (data.userId !== userId) {
    throw new Error('Unauthorized access to preset');
  }

  return toAppPreset(data);
};

/**
 * Create or update a BPM preset
 */
export const saveBpmPreset = async (
  userId: string,
  preset: Omit<BpmPreset, 'createdAt' | 'updatedAt'>
): Promise<BpmPreset> => {
  const db = getFirebaseFirestore();

  // Check preset count if creating new
  if (!preset.id.includes('preset_')) {
    const existingPresets = await getBpmPresets(userId);
    if (existingPresets.length >= MAX_PRESETS) {
      throw new Error(`Maximum ${MAX_PRESETS} presets allowed`);
    }
  }

  const now = Timestamp.now();
  const presetRef = doc(db, COLLECTION_NAME, preset.id);
  const existingDoc = await getDoc(presetRef);

  let createdAt = now;
  if (existingDoc.exists()) {
    const existingData = existingDoc.data() as BpmPresetDocument;
    // Verify ownership
    if (existingData.userId !== userId) {
      throw new Error('Unauthorized access to preset');
    }
    createdAt = existingData.createdAt;
  }

  const presetDoc: BpmPresetDocument = {
    id: preset.id,
    userId,
    name: preset.name,
    bpm: preset.bpm,
    timeSignature: preset.timeSignature,
    accentPattern: preset.accentPattern,
    createdAt,
    updatedAt: now,
  };

  await setDoc(presetRef, presetDoc);

  return toAppPreset(presetDoc);
};

/**
 * Delete a BPM preset
 */
export const deleteBpmPreset = async (
  userId: string,
  presetId: string
): Promise<void> => {
  const db = getFirebaseFirestore();
  const presetRef = doc(db, COLLECTION_NAME, presetId);

  // Verify ownership before deletion
  const docSnap = await getDoc(presetRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as BpmPresetDocument;
    if (data.userId !== userId) {
      throw new Error('Unauthorized access to preset');
    }
  }

  await deleteDoc(presetRef);
};

/**
 * Generate a unique preset ID
 */
export const generatePresetId = (): string => {
  return `preset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
