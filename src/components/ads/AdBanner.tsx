import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

type AdType = 'bottom' | 'side' | 'mobile';

interface AdBannerProps {
  type: AdType;
}

const AD_CONFIG = {
  bottom: {
    width: 720,
    height: 90,
    slot: '2655010779',
  },
  side: {
    width: 160,
    height: 600,
    slot: '1860803850',
  },
  mobile: {
    width: 300,
    height: 90,
    slot: '4295395504',
  },
};

const AD_CLIENT = 'ca-pub-2574956124078440';

// Check if adsbygoogle script is loaded
const isAdsbyGoogleLoaded = (): boolean => {
  if (typeof window === 'undefined') return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (window as any).adsbygoogle !== 'undefined';
};

// Wait for adsbygoogle to be available
const waitForAdsbyGoogle = (maxWait = 10000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isAdsbyGoogleLoaded()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isAdsbyGoogleLoaded()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > maxWait) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};

export const AdBanner: React.FC<AdBannerProps> = ({ type }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (adInitialized.current) return;

    const config = AD_CONFIG[type];

    const initializeAd = async () => {
      // Wait for adsbygoogle script to load
      const loaded = await waitForAdsbyGoogle();
      if (!loaded) {
        return;
      }

      if (!containerRef.current || adInitialized.current) return;

      // Clear any existing content
      containerRef.current.innerHTML = '';

      // Create the ad element
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'inline-block';
      ins.style.width = `${config.width}px`;
      ins.style.height = `${config.height}px`;
      ins.setAttribute('data-ad-client', AD_CLIENT);
      ins.setAttribute('data-ad-slot', config.slot);

      containerRef.current.appendChild(ins);

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const adsbygoogle = (window as any).adsbygoogle;
          if (adsbygoogle && typeof adsbygoogle.push === 'function') {
            adsbygoogle.push({});
            adInitialized.current = true;
          }
        } catch (e) {
          // Ad blocked or error - silently fail
        }
      });
    };

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(initializeAd, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [type]);

  if (Platform.OS !== 'web') {
    return null;
  }

  const config = AD_CONFIG[type];

  return (
    <View
      style={[
        styles.container,
        {
          width: config.width,
          height: config.height,
        },
      ]}
    >
      <div
        ref={containerRef}
        style={{
          width: config.width,
          height: config.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: config.width,
          minHeight: config.height,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
