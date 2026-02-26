/**
 * Expo app configuration with environment variable support
 * Firebase configuration is loaded from environment variables
 */

export default ({ config }) => {
  return {
    ...config,
    extra: {
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      },
      google: {
        iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      },
      stripe: {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      },
      revenueCat: {
        apiKey: process.env.REVENUECAT_API_KEY,
        premiumEntitlementId: 'premium',
        premiumProductId: 'premium_monthly_200',
      },
    },
  };
};
