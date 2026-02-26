/**
 * Firebase Firestore Service
 * Handles Firestore database operations
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  DocumentData,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './config';

/**
 * User document in Firestore
 */
export interface UserDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isPremium: boolean;
  premiumExpiresAt: Timestamp | null;
  platformSubscription: 'ios' | 'web' | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Create or update user document
 */
export const createUserDocument = async (
  uid: string,
  data: Omit<UserDocument, 'uid' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  const db = getFirebaseFirestore();
  const userRef = doc(db, 'users', uid);
  const now = Timestamp.now();

  const existingDoc = await getDoc(userRef);

  if (existingDoc.exists()) {
    await updateDoc(userRef, {
      ...data,
      updatedAt: now,
    });
  } else {
    await setDoc(userRef, {
      uid,
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }
};

/**
 * Get user document
 */
export const getUserDocument = async (
  uid: string
): Promise<UserDocument | null> => {
  const db = getFirebaseFirestore();
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserDocument;
  }

  return null;
};

/**
 * Update user premium status
 */
export const updatePremiumStatus = async (
  uid: string,
  isPremium: boolean,
  expiresAt: Date | null,
  platform: 'ios' | 'web' | null
): Promise<void> => {
  const db = getFirebaseFirestore();
  const userRef = doc(db, 'users', uid);

  await updateDoc(userRef, {
    isPremium,
    premiumExpiresAt: expiresAt ? Timestamp.fromDate(expiresAt) : null,
    platformSubscription: platform,
    updatedAt: Timestamp.now(),
  });
};

/**
 * Generic query function for collections
 */
export const queryCollection = async <T extends DocumentData>(
  collectionPath: string,
  constraints: QueryConstraint[]
): Promise<T[]> => {
  const db = getFirebaseFirestore();
  const collectionRef = collection(db, collectionPath);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docSnap) => docSnap.data() as T);
};

export { where, orderBy, limit, Timestamp };
