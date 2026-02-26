/**
 * Ad Banner Component
 * Displays ads based on platform (iOS: AdMob, Web: AdSense)
 * Hides for premium users
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors, borderRadius, spacing } from '../../constants/theme';

type AdSize = 'banner' | 'sidebar' | 'leaderboard';

interface AdBannerProps {
  size?: AdSize;
  style?: object;
}

// Ad unit dimensions
const AD_SIZES: Record<AdSize, { width: number | string; height: number }> = {
  banner: { width: '100%', height: 50 },
  sidebar: { width: 160, height: 600 },
  leaderboard: { width: '100%', height: 90 },
};

/**
 * Web AdSense Component
 */
const WebAdBanner: React.FC<{ size: AdSize; style?: object }> = ({
  size,
  style,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const dimensions = AD_SIZES[size];

  useEffect(() => {
    // AdSense script initialization
    // Note: Actual AdSense code should be added after approval
    if (adRef.current && typeof window !== 'undefined') {
      // Placeholder for AdSense initialization
      // window.adsbygoogle = window.adsbygoogle || [];
      // window.adsbygoogle.push({});
    }
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          width: dimensions.width,
          height: dimensions.height,
        },
        style,
      ]}
    >
      {/* AdSense placeholder - replace with actual ad code after approval */}
      <View
        ref={adRef as unknown as React.RefObject<View>}
        style={styles.adPlaceholder}
      >
        {/* Ad will be rendered here */}
      </View>
    </View>
  );
};

/**
 * iOS AdMob Component
 * Note: Requires react-native-google-mobile-ads and native setup
 */
const IOSAdBanner: React.FC<{ size: AdSize; style?: object }> = ({
  size,
  style,
}) => {
  const dimensions = AD_SIZES[size];

  // Placeholder for AdMob banner
  // Actual implementation requires:
  // 1. Install react-native-google-mobile-ads
  // 2. Configure native iOS project
  // 3. Add AdMob app ID to Info.plist

  return (
    <View
      style={[
        styles.container,
        {
          width: dimensions.width,
          height: dimensions.height,
        },
        style,
      ]}
    >
      <View style={styles.adPlaceholder}>
        {/* AdMob banner will be rendered here */}
      </View>
    </View>
  );
};

/**
 * Main Ad Banner Component
 * Automatically selects platform-specific implementation
 * Returns null for premium users
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  size = 'banner',
  style,
}) => {
  const { isPremium } = useAuth();

  // Don't show ads for premium users
  if (isPremium) {
    return null;
  }

  if (Platform.OS === 'web') {
    return <WebAdBanner size={size} style={style} />;
  }

  if (Platform.OS === 'ios') {
    return <IOSAdBanner size={size} style={style} />;
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.border,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adPlaceholder: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
});
