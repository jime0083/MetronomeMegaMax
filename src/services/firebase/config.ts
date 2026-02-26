/**
 * Firebase Configuration
 * Loads configuration from Expo Constants (environment variables)
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import Constants from 'expo-constants';

/**
 * Firebase configuration interface
 */
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/**
 * Get Firebase configuration from environment variables
 */
const getFirebaseConfig = (): FirebaseConfig => {
  const extra = Constants.expoConfig?.extra;

  if (!extra?.firebase) {
    throw new Error(
      'Firebase configuration not found. Please set environment variables.'
    );
  }

  const { firebase } = extra;

  // Validate required fields
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  for (const field of requiredFields) {
    if (!firebase[field]) {
      throw new Error(`Firebase ${field} is not configured`);
    }
  }

  return {
    apiKey: firebase.apiKey,
    authDomain: firebase.authDomain,
    projectId: firebase.projectId,
    storageBucket: firebase.storageBucket,
    messagingSenderId: firebase.messagingSenderId,
    appId: firebase.appId,
  };
};

/**
 * Initialize Firebase app (singleton pattern)
 */
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;

export const initializeFirebase = (): FirebaseApp => {
  if (app) {
    return app;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    return app;
  }

  const config = getFirebaseConfig();
  app = initializeApp(config);
  return app;
};

export const getFirebaseAuth = (): Auth => {
  if (auth) {
    return auth;
  }

  const firebaseApp = initializeFirebase();
  auth = getAuth(firebaseApp);
  return auth;
};

export const getFirebaseFirestore = (): Firestore => {
  if (firestore) {
    return firestore;
  }

  const firebaseApp = initializeFirebase();
  firestore = getFirestore(firebaseApp);
  return firestore;
};

export const getFirebaseStorage = (): FirebaseStorage => {
  if (storage) {
    return storage;
  }

  const firebaseApp = initializeFirebase();
  storage = getStorage(firebaseApp);
  return storage;
};

/**
 * Get Google OAuth client IDs from configuration
 */
export const getGoogleClientIds = (): {
  iosClientId?: string;
  webClientId?: string;
} => {
  const extra = Constants.expoConfig?.extra;
  return {
    iosClientId: extra?.google?.iosClientId,
    webClientId: extra?.google?.webClientId,
  };
};
