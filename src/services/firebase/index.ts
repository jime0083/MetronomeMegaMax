/**
 * Firebase Services
 * Central export for all Firebase-related functionality
 */

// Configuration and initialization
export {
  initializeFirebase,
  getFirebaseAuth,
  getFirebaseFirestore,
  getFirebaseStorage,
  getGoogleClientIds,
} from './config';

// Authentication
export {
  subscribeToAuthState,
  getCurrentUser,
  signInWithGoogleCredential,
  signOut,
  isAuthenticated,
  getUserDisplayInfo,
  type User,
  type UserDisplayInfo,
} from './auth';

// Firestore
export {
  createUserDocument,
  getUserDocument,
  updatePremiumStatus,
  queryCollection,
  where,
  orderBy,
  limit,
  Timestamp,
  type UserDocument,
} from './firestore';
