/**
 * Loop Points Service
 * Handles loop point CRUD operations in Firestore and audio file storage
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
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { getFirebaseFirestore, getFirebaseStorage } from '../firebase/config';
import type { LoopPoint } from '../../types';

const MAX_LOOP_POINTS = 3;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const COLLECTION_NAME = 'loopPoints';
const STORAGE_PATH = 'audio';

/**
 * Firestore loop point document structure
 */
interface LoopPointDocument {
  id: string;
  userId: string;
  name: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  startTime: number;
  endTime: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Upload progress callback
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * Convert Firestore document to app type
 */
const toAppLoopPoint = (doc: LoopPointDocument): LoopPoint => ({
  id: doc.id,
  name: doc.name,
  fileUrl: doc.fileUrl,
  fileName: doc.fileName,
  startTime: doc.startTime,
  endTime: doc.endTime,
  createdAt: doc.createdAt.toMillis(),
  updatedAt: doc.updatedAt.toMillis(),
});

/**
 * Validate file for upload
 */
export const validateAudioFile = (file: File): void => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav'];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only MP3 and WAV files are allowed.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
  }
};

/**
 * Upload audio file to Firebase Storage
 */
export const uploadAudioFile = async (
  userId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<{ url: string; path: string }> => {
  validateAudioFile(file);

  const storage = getFirebaseStorage();
  const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = `${STORAGE_PATH}/${userId}/${fileName}`;
  const storageRef = ref(storage, filePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        reject(new Error(`Upload failed: ${error.message}`));
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url, path: filePath });
        } catch (error) {
          reject(new Error('Failed to get download URL'));
        }
      }
    );
  });
};

/**
 * Delete audio file from Firebase Storage
 */
export const deleteAudioFile = async (filePath: string): Promise<void> => {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, filePath);

  try {
    await deleteObject(storageRef);
  } catch (error) {
    // File may not exist, ignore error
    console.warn('Failed to delete audio file:', error);
  }
};

/**
 * Get all loop points for a user
 */
export const getLoopPoints = async (userId: string): Promise<LoopPoint[]> => {
  const db = getFirebaseFirestore();
  const loopPointsRef = collection(db, COLLECTION_NAME);
  const q = query(
    loopPointsRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(MAX_LOOP_POINTS)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) =>
    toAppLoopPoint(docSnap.data() as LoopPointDocument)
  );
};

/**
 * Get a single loop point
 */
export const getLoopPoint = async (
  userId: string,
  loopPointId: string
): Promise<LoopPoint | null> => {
  const db = getFirebaseFirestore();
  const loopPointRef = doc(db, COLLECTION_NAME, loopPointId);
  const docSnap = await getDoc(loopPointRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data() as LoopPointDocument;

  // Verify ownership
  if (data.userId !== userId) {
    throw new Error('Unauthorized access to loop point');
  }

  return toAppLoopPoint(data);
};

/**
 * Save a loop point (with optional file upload)
 */
export interface SaveLoopPointOptions {
  userId: string;
  name: string;
  startTime: number;
  endTime: number;
  file?: File;
  existingFileUrl?: string;
  existingFileName?: string;
  existingId?: string;
  onProgress?: UploadProgressCallback;
}

export const saveLoopPoint = async (
  options: SaveLoopPointOptions
): Promise<LoopPoint> => {
  const {
    userId,
    name,
    startTime,
    endTime,
    file,
    existingFileUrl,
    existingFileName,
    existingId,
    onProgress,
  } = options;

  const db = getFirebaseFirestore();

  // Check loop point count if creating new
  if (!existingId) {
    const existingLoopPoints = await getLoopPoints(userId);
    if (existingLoopPoints.length >= MAX_LOOP_POINTS) {
      throw new Error(`Maximum ${MAX_LOOP_POINTS} loop points allowed`);
    }
  }

  let fileUrl = existingFileUrl ?? '';
  let fileName = existingFileName ?? '';
  let fileSize = 0;
  let mimeType = '';

  // Upload new file if provided
  if (file) {
    const uploadResult = await uploadAudioFile(userId, file, onProgress);
    fileUrl = uploadResult.url;
    fileName = file.name;
    fileSize = file.size;
    mimeType = file.type;
  }

  if (!fileUrl) {
    throw new Error('Audio file is required');
  }

  const now = Timestamp.now();
  const loopPointId = existingId || generateLoopPointId();
  const loopPointRef = doc(db, COLLECTION_NAME, loopPointId);

  let createdAt = now;
  if (existingId) {
    const existingDoc = await getDoc(loopPointRef);
    if (existingDoc.exists()) {
      const existingData = existingDoc.data() as LoopPointDocument;
      // Verify ownership
      if (existingData.userId !== userId) {
        throw new Error('Unauthorized access to loop point');
      }
      createdAt = existingData.createdAt;

      // Keep existing file info if not uploading new file
      if (!file) {
        fileSize = existingData.fileSize;
        mimeType = existingData.mimeType;
      }
    }
  }

  const loopPointDoc: LoopPointDocument = {
    id: loopPointId,
    userId,
    name,
    fileUrl,
    fileName,
    fileSize,
    mimeType,
    startTime,
    endTime,
    createdAt,
    updatedAt: now,
  };

  await setDoc(loopPointRef, loopPointDoc);

  return toAppLoopPoint(loopPointDoc);
};

/**
 * Delete a loop point
 */
export const deleteLoopPoint = async (
  userId: string,
  loopPointId: string
): Promise<void> => {
  const db = getFirebaseFirestore();
  const loopPointRef = doc(db, COLLECTION_NAME, loopPointId);

  // Get the document to delete the associated file
  const docSnap = await getDoc(loopPointRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as LoopPointDocument;

    // Verify ownership
    if (data.userId !== userId) {
      throw new Error('Unauthorized access to loop point');
    }

    // Delete the audio file from storage
    // Extract path from URL or use stored path
    const storage = getFirebaseStorage();
    const filePath = `${STORAGE_PATH}/${userId}/${data.fileName}`;
    try {
      await deleteAudioFile(filePath);
    } catch {
      // Continue even if file deletion fails
    }
  }

  await deleteDoc(loopPointRef);
};

/**
 * Generate a unique loop point ID
 */
export const generateLoopPointId = (): string => {
  return `loop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
