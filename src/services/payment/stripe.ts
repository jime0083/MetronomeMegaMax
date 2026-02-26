/**
 * Stripe Service
 * Handles Web payments using Stripe
 */

import { Platform } from 'react-native';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import Constants from 'expo-constants';

/**
 * Stripe configuration
 */
interface StripeConfig {
  publishableKey: string;
}

/**
 * Get Stripe configuration from app config
 */
const getConfig = (): StripeConfig | null => {
  const extra = Constants.expoConfig?.extra;

  if (!extra?.stripe?.publishableKey) {
    return null;
  }

  return {
    publishableKey: extra.stripe.publishableKey,
  };
};

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe instance (lazy initialization)
 */
export const getStripe = (): Promise<Stripe | null> => {
  // Only available on Web
  if (Platform.OS !== 'web') {
    return Promise.resolve(null);
  }

  if (stripePromise) {
    return stripePromise;
  }

  const config = getConfig();
  if (!config) {
    console.warn('Stripe publishable key not configured');
    return Promise.resolve(null);
  }

  stripePromise = loadStripe(config.publishableKey);
  return stripePromise;
};

/**
 * Create a checkout session and redirect to Stripe Checkout
 * Note: This requires a backend API to create the session
 */
export interface CreateCheckoutOptions {
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Redirect to Stripe Checkout URL
 * Backend should provide the full checkout URL
 */
export const redirectToCheckoutUrl = (checkoutUrl: string): void => {
  if (Platform.OS !== 'web') {
    throw new Error('Stripe checkout only available on web');
  }

  if (typeof window !== 'undefined') {
    window.location.href = checkoutUrl;
  }
};

/**
 * Redirect to Stripe Customer Portal for subscription management
 * Backend should return the portal URL
 */
export const redirectToCustomerPortal = (portalUrl: string): void => {
  if (Platform.OS !== 'web') {
    throw new Error('Customer portal only available on web');
  }

  if (typeof window !== 'undefined') {
    window.location.href = portalUrl;
  }
};

/**
 * Subscription status from webhook/API
 */
export interface StripeSubscriptionStatus {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

/**
 * Check if subscription is active
 */
export const isSubscriptionActive = (
  subscription: StripeSubscriptionStatus | null
): boolean => {
  if (!subscription) {
    return false;
  }

  return (
    subscription.status === 'active' || subscription.status === 'trialing'
  );
};

/**
 * Get subscription expiration date
 */
export const getSubscriptionExpirationDate = (
  subscription: StripeSubscriptionStatus | null
): Date | null => {
  if (!subscription) {
    return null;
  }

  return new Date(subscription.currentPeriodEnd * 1000);
};
