/**
 * Firebase Authentication Service
 * Handles user authentication with Google Sign-In
 */

import {
  User,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  UserCredential,
  Unsubscribe,
} from 'firebase/auth';
import { getFirebaseAuth } from './config';

export type { User };

/**
 * Subscribe to authentication state changes
 */
export const subscribeToAuthState = (
  callback: (user: User | null) => void
): Unsubscribe => {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};

/**
 * Sign in with Google credential (ID token)
 * Used after obtaining ID token from Google Sign-In
 */
export const signInWithGoogleCredential = async (
  idToken: string
): Promise<UserCredential> => {
  const auth = getFirebaseAuth();
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * Get user display information
 */
export interface UserDisplayInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const getUserDisplayInfo = (user: User): UserDisplayInfo => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};
