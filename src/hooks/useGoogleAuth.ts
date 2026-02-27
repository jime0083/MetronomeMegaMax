/**
 * Google Authentication Hook
 * Handles Google Sign-In for both Web and iOS platforms
 */

import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  signInWithPopup,
  GoogleAuthProvider,
  type UserCredential,
} from 'firebase/auth';
import {
  getFirebaseAuth,
  getGoogleClientIds,
  signInWithGoogleCredential,
} from '../services/firebase';

// Enable web browser redirect for OAuth
WebBrowser.maybeCompleteAuthSession();

/** Error key type for localization */
export type AuthErrorKey =
  | 'loginFailed'
  | 'loginCancelled'
  | 'invalidApiKey'
  | 'popupBlocked'
  | 'popupClosed'
  | 'unknownError';

interface UseGoogleAuthResult {
  /** Sign in with Google */
  signIn: () => Promise<void>;
  /** Whether sign-in is in progress */
  isLoading: boolean;
  /** Error key for localization (use with t('errors.{errorKey}')) */
  errorKey: AuthErrorKey | null;
}

/**
 * Map Firebase error codes to localization keys
 */
const mapErrorToKey = (error: unknown): AuthErrorKey => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // API key errors
    if (message.includes('api-key-not-valid') || message.includes('invalid-api-key')) {
      return 'invalidApiKey';
    }

    // Popup errors
    if (message.includes('popup-blocked')) {
      return 'popupBlocked';
    }
    if (message.includes('popup-closed') || message.includes('cancelled-popup-request')) {
      return 'popupClosed';
    }

    // Cancellation
    if (message.includes('cancel')) {
      return 'loginCancelled';
    }
  }

  return 'loginFailed';
};

/**
 * Hook for Google Authentication
 * Automatically handles platform differences (Web vs iOS)
 */
export const useGoogleAuth = (): UseGoogleAuthResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<AuthErrorKey | null>(null);

  const clientIds = getGoogleClientIds();

  // Configure Google Auth for iOS using expo-auth-session
  const [, response, promptAsync] = Google.useAuthRequest({
    iosClientId: clientIds.iosClientId,
    webClientId: clientIds.webClientId,
  });

  /**
   * Handle Web sign-in using Firebase signInWithPopup
   */
  const signInWeb = useCallback(async (): Promise<UserCredential> => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    return signInWithPopup(auth, provider);
  }, []);

  /**
   * Handle iOS sign-in using expo-auth-session
   */
  const signInIOS = useCallback(async (): Promise<void> => {
    const result = await promptAsync();

    if (result.type === 'success') {
      const { id_token: idToken } = result.params;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // Sign in to Firebase with the Google credential
      await signInWithGoogleCredential(idToken);
    } else if (result.type === 'cancel') {
      throw new Error('Sign-in cancelled');
    } else {
      throw new Error('Sign-in failed');
    }
  }, [promptAsync]);

  /**
   * Main sign-in function
   */
  const signIn = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorKey(null);

    try {
      if (Platform.OS === 'web') {
        await signInWeb();
      } else {
        await signInIOS();
      }
    } catch (err) {
      const key = mapErrorToKey(err);
      setErrorKey(key);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [signInWeb, signInIOS]);

  return {
    signIn,
    isLoading,
    errorKey,
  };
};
