/**
 * Subscription Context
 * Manages subscription state across platforms (iOS: RevenueCat, Web: Stripe)
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
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';
import {
  initializeRevenueCat,
  setRevenueCatUserId,
  clearRevenueCatUser,
  getOfferings,
  purchasePackage,
  restorePurchases,
  checkRevenueCatPremiumStatus,
  getRevenueCatExpirationDate,
  addCustomerInfoUpdateListener,
} from '../services/payment';
import {
  updatePremiumStatus,
  getUserDocument,
} from '../services/firebase';
import type { Subscription, SubscriptionStatus } from '../types';
import type { PurchasesPackage, PurchasesOffering } from 'react-native-purchases';

/**
 * Subscription context state
 */
interface SubscriptionContextState {
  /** Current subscription info */
  subscription: Subscription | null;
  /** Whether subscription data is loading */
  isLoading: boolean;
  /** Available packages for purchase (iOS only) */
  offerings: PurchasesOffering | null;
  /** Purchase premium subscription */
  purchase: (pkg?: PurchasesPackage) => Promise<void>;
  /** Restore previous purchases (iOS only) */
  restore: () => Promise<void>;
  /** Open subscription management */
  openManageSubscription: () => void;
  /** Refresh subscription status */
  refresh: () => Promise<void>;
  /** Error message */
  error: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextState | undefined>(
  undefined
);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const { user, isPremium, refreshUser } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize RevenueCat (iOS only)
   */
  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'ios') {
        try {
          await initializeRevenueCat(user?.uid);

          // Fetch offerings
          const currentOfferings = await getOfferings();
          setOfferings(currentOfferings);
        } catch (err) {
          console.error('Failed to initialize RevenueCat:', err);
        }
      }
      setIsLoading(false);
    };

    init();
  }, [user?.uid]);

  /**
   * Sync RevenueCat user with Firebase user
   */
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    if (user?.uid) {
      setRevenueCatUserId(user.uid).catch(console.error);
    } else {
      clearRevenueCatUser().catch(console.error);
    }
  }, [user?.uid]);

  /**
   * Listen for subscription changes (iOS)
   */
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    const removeListener = addCustomerInfoUpdateListener(async (customerInfo) => {
      // Check premium status from RevenueCat
      const premiumActive = await checkRevenueCatPremiumStatus();
      const expirationDate = await getRevenueCatExpirationDate();

      // Update Firestore if user is logged in
      if (user?.uid) {
        try {
          await updatePremiumStatus(
            user.uid,
            premiumActive,
            expirationDate,
            premiumActive ? 'ios' : null
          );
          await refreshUser();
        } catch (err) {
          console.error('Failed to sync subscription to Firestore:', err);
        }
      }

      // Update local state
      setSubscription({
        status: premiumActive ? 'active' : 'none',
        platform: 'ios',
        expiresAt: expirationDate?.getTime() ?? null,
        productId: null,
      });
    });

    return removeListener;
  }, [user?.uid, refreshUser]);

  /**
   * Load subscription status
   */
  useEffect(() => {
    const loadSubscription = async () => {
      if (!user?.uid) {
        setSubscription(null);
        return;
      }

      try {
        // Load from Firestore
        const userDoc = await getUserDocument(user.uid);

        if (userDoc) {
          const status: SubscriptionStatus = userDoc.isPremium
            ? 'active'
            : 'none';

          setSubscription({
            status,
            platform: userDoc.platformSubscription ?? 'ios',
            expiresAt: userDoc.premiumExpiresAt?.toMillis() ?? null,
            productId: null,
          });
        }
      } catch (err) {
        console.error('Failed to load subscription:', err);
      }
    };

    loadSubscription();
  }, [user?.uid, isPremium]);

  /**
   * Purchase premium subscription
   */
  const purchase = useCallback(
    async (pkg?: PurchasesPackage): Promise<void> => {
      setError(null);
      setIsLoading(true);

      try {
        if (Platform.OS === 'ios') {
          // iOS: Use RevenueCat
          if (!pkg && offerings?.availablePackages?.[0]) {
            pkg = offerings.availablePackages[0];
          }

          if (!pkg) {
            throw new Error('No package available for purchase');
          }

          await purchasePackage(pkg);
          // Subscription update will be handled by the listener
        } else {
          // Web: Stripe - requires backend integration
          // This would typically call your backend to create a checkout session
          throw new Error(
            'Web purchase requires Stripe Checkout integration with backend'
          );
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Purchase failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [offerings]
  );

  /**
   * Restore previous purchases (iOS only)
   */
  const restore = useCallback(async (): Promise<void> => {
    if (Platform.OS !== 'ios') {
      setError('Restore only available on iOS');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await restorePurchases();
      // Subscription update will be handled by the listener
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Restore failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Open subscription management
   */
  const openManageSubscription = useCallback((): void => {
    if (Platform.OS === 'ios') {
      // Open App Store subscription settings
      // This requires linking to the App Store
      const url = 'https://apps.apple.com/account/subscriptions';
      // Linking.openURL(url) - would need to import Linking
    } else {
      // Web: Would redirect to Stripe Customer Portal
      // This requires backend to generate the portal URL
    }
  }, []);

  /**
   * Refresh subscription status
   */
  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (Platform.OS === 'ios') {
        const premiumActive = await checkRevenueCatPremiumStatus();
        const expirationDate = await getRevenueCatExpirationDate();

        setSubscription({
          status: premiumActive ? 'active' : 'none',
          platform: 'ios',
          expiresAt: expirationDate?.getTime() ?? null,
          productId: null,
        });
      }

      // Also refresh from Firestore
      await refreshUser();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Refresh failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const value = useMemo<SubscriptionContextState>(
    () => ({
      subscription,
      isLoading,
      offerings,
      purchase,
      restore,
      openManageSubscription,
      refresh,
      error,
    }),
    [
      subscription,
      isLoading,
      offerings,
      purchase,
      restore,
      openManageSubscription,
      refresh,
      error,
    ]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

/**
 * Hook to access subscription context
 */
export const useSubscription = (): SubscriptionContextState => {
  const context = useContext(SubscriptionContext);

  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionProvider'
    );
  }

  return context;
};
