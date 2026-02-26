/**
 * Authentication Context
 * Manages user authentication state and premium status
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  subscribeToAuthState,
  signOut as firebaseSignOut,
  getUserDocument,
  createUserDocument,
  type User as FirebaseUser,
  type UserDocument,
  Timestamp,
} from '../services/firebase';
import type { User } from '../types';

/**
 * Auth context state
 */
interface AuthContextState {
  /** Current user (null if not authenticated) */
  user: User | null;
  /** Whether authentication state is being loaded */
  isLoading: boolean;
  /** Whether user has premium subscription */
  isPremium: boolean;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Refresh user data from Firestore */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Convert Firebase user and Firestore document to app User type
 */
const toAppUser = (
  firebaseUser: FirebaseUser,
  userDoc: UserDocument | null
): User => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    isPremium: userDoc?.isPremium ?? false,
    premiumExpiresAt: userDoc?.premiumExpiresAt
      ? userDoc.premiumExpiresAt.toMillis()
      : null,
  };
};

/**
 * Check if premium subscription is valid
 */
const checkPremiumStatus = (userDoc: UserDocument | null): boolean => {
  if (!userDoc?.isPremium) {
    return false;
  }

  // If no expiration date, premium is valid
  if (!userDoc.premiumExpiresAt) {
    return true;
  }

  // Check if subscription has expired
  const now = Timestamp.now().toMillis();
  return userDoc.premiumExpiresAt.toMillis() > now;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  /**
   * Load or create user document in Firestore
   */
  const loadUserDocument = useCallback(
    async (fbUser: FirebaseUser): Promise<UserDocument | null> => {
      let userDoc = await getUserDocument(fbUser.uid);

      // Create user document if it doesn't exist
      if (!userDoc) {
        await createUserDocument(fbUser.uid, {
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          isPremium: false,
          premiumExpiresAt: null,
          platformSubscription: null,
        });
        userDoc = await getUserDocument(fbUser.uid);
      }

      return userDoc;
    },
    []
  );

  /**
   * Subscribe to Firebase auth state changes
   */
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          const userDoc = await loadUserDocument(fbUser);
          const appUser = toAppUser(fbUser, userDoc);
          setUser(appUser);
          setIsPremium(checkPremiumStatus(userDoc));
        } catch (error) {
          // Failed to load user document, use basic info
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            isPremium: false,
            premiumExpiresAt: null,
          });
          setIsPremium(false);
        }
      } else {
        setUser(null);
        setIsPremium(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [loadUserDocument]);

  /**
   * Sign out handler
   */
  const signOut = useCallback(async () => {
    await firebaseSignOut();
    setUser(null);
    setIsPremium(false);
  }, []);

  /**
   * Refresh user data from Firestore
   */
  const refreshUser = useCallback(async () => {
    if (!firebaseUser) {
      return;
    }

    const userDoc = await getUserDocument(firebaseUser.uid);
    const appUser = toAppUser(firebaseUser, userDoc);
    setUser(appUser);
    setIsPremium(checkPremiumStatus(userDoc));
  }, [firebaseUser]);

  const value = useMemo<AuthContextState>(
    () => ({
      user,
      isLoading,
      isPremium,
      signOut,
      refreshUser,
    }),
    [user, isLoading, isPremium, signOut, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access auth context
 */
export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
