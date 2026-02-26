/**
 * Payment Services
 * Central export for payment-related functionality
 */

// RevenueCat (iOS)
export {
  initializeRevenueCat,
  setRevenueCatUserId,
  clearRevenueCatUser,
  getOfferings,
  purchasePackage,
  restorePurchases,
  getCustomerInfo,
  checkPremiumStatus as checkRevenueCatPremiumStatus,
  getPremiumExpirationDate as getRevenueCatExpirationDate,
  addCustomerInfoUpdateListener,
} from './revenueCat';

// Stripe (Web)
export {
  getStripe,
  redirectToCheckoutUrl,
  redirectToCustomerPortal,
  isSubscriptionActive,
  getSubscriptionExpirationDate,
  type StripeSubscriptionStatus,
  type CreateCheckoutOptions,
} from './stripe';
