/**
 * RevenueCat Service
 * Handles iOS in-app purchases using RevenueCat
 */

import { Platform } from 'react-native';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesOffering,
  LOG_LEVEL,
} from 'react-native-purchases';
import Constants from 'expo-constants';

/**
 * RevenueCat configuration
 */
interface RevenueCatConfig {
  apiKey: string;
  premiumEntitlementId: string;
  premiumProductId: string;
}

/**
 * Get RevenueCat configuration from app config
 */
const getConfig = (): RevenueCatConfig | null => {
  const extra = Constants.expoConfig?.extra;

  if (!extra?.revenueCat?.apiKey) {
    return null;
  }

  return {
    apiKey: extra.revenueCat.apiKey,
    premiumEntitlementId: extra.revenueCat.premiumEntitlementId || 'premium',
    premiumProductId: extra.revenueCat.premiumProductId || 'premium_monthly_200',
  };
};

let isInitialized = false;

/**
 * Initialize RevenueCat SDK
 * Should be called on app start (iOS only)
 */
export const initializeRevenueCat = async (userId?: string): Promise<void> => {
  // Only available on iOS
  if (Platform.OS !== 'ios') {
    return;
  }

  if (isInitialized) {
    return;
  }

  const config = getConfig();
  if (!config) {
    console.warn('RevenueCat API key not configured');
    return;
  }

  try {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    await Purchases.configure({
      apiKey: config.apiKey,
      appUserID: userId,
    });
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    throw error;
  }
};

/**
 * Set RevenueCat user ID (call after Firebase login)
 */
export const setRevenueCatUserId = async (userId: string): Promise<void> => {
  if (Platform.OS !== 'ios' || !isInitialized) {
    return;
  }

  try {
    await Purchases.logIn(userId);
  } catch (error) {
    console.error('Failed to set RevenueCat user ID:', error);
    throw error;
  }
};

/**
 * Clear RevenueCat user (call on logout)
 */
export const clearRevenueCatUser = async (): Promise<void> => {
  if (Platform.OS !== 'ios' || !isInitialized) {
    return;
  }

  try {
    await Purchases.logOut();
  } catch (error) {
    console.error('Failed to clear RevenueCat user:', error);
  }
};

/**
 * Get available offerings (subscription packages)
 */
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  if (Platform.OS !== 'ios' || !isInitialized) {
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error('Failed to get offerings:', error);
    throw error;
  }
};

/**
 * Purchase a package
 */
export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<CustomerInfo> => {
  if (Platform.OS !== 'ios') {
    throw new Error('iOS purchases not available on this platform');
  }

  if (!isInitialized) {
    throw new Error('RevenueCat not initialized');
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (error) {
    console.error('Purchase failed:', error);
    throw error;
  }
};

/**
 * Restore purchases (for users who reinstalled the app)
 */
export const restorePurchases = async (): Promise<CustomerInfo> => {
  if (Platform.OS !== 'ios') {
    throw new Error('iOS purchases not available on this platform');
  }

  if (!isInitialized) {
    throw new Error('RevenueCat not initialized');
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('Restore purchases failed:', error);
    throw error;
  }
};

/**
 * Get current customer info (subscription status)
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  if (Platform.OS !== 'ios' || !isInitialized) {
    return null;
  }

  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('Failed to get customer info:', error);
    throw error;
  }
};

/**
 * Check if user has premium entitlement
 */
export const checkPremiumStatus = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios' || !isInitialized) {
    return false;
  }

  try {
    const config = getConfig();
    if (!config) {
      return false;
    }

    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[config.premiumEntitlementId];
    return entitlement?.isActive ?? false;
  } catch (error) {
    console.error('Failed to check premium status:', error);
    return false;
  }
};

/**
 * Get premium entitlement expiration date
 */
export const getPremiumExpirationDate = async (): Promise<Date | null> => {
  if (Platform.OS !== 'ios' || !isInitialized) {
    return null;
  }

  try {
    const config = getConfig();
    if (!config) {
      return null;
    }

    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[config.premiumEntitlementId];

    if (entitlement?.expirationDate) {
      return new Date(entitlement.expirationDate);
    }

    return null;
  } catch (error) {
    console.error('Failed to get expiration date:', error);
    return null;
  }
};

/**
 * Add listener for customer info updates
 * Note: RevenueCat SDK may have different listener behavior across versions
 */
export const addCustomerInfoUpdateListener = (
  callback: (customerInfo: CustomerInfo) => void
): (() => void) => {
  if (Platform.OS !== 'ios' || !isInitialized) {
    return () => {};
  }

  // RevenueCat SDK's addCustomerInfoUpdateListener returns void in newer versions
  // The listener is automatically managed by the SDK
  Purchases.addCustomerInfoUpdateListener(callback);

  // Return a no-op cleanup function since SDK manages the listener
  return () => {
    // Listener cleanup is handled by SDK on logout/configure
  };
};
