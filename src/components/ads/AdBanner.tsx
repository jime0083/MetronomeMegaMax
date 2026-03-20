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

export const AdBanner: React.FC<AdBannerProps> = ({ type }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (isAdLoaded.current) return;

    const config = AD_CONFIG[type];

    // Create ad element
    if (adRef.current && !isAdLoaded.current) {
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'inline-block';
      ins.style.width = `${config.width}px`;
      ins.style.height = `${config.height}px`;
      ins.setAttribute('data-ad-client', 'ca-pub-2574956124078440');
      ins.setAttribute('data-ad-slot', config.slot);

      adRef.current.appendChild(ins);

      // Push ad
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        // Ad blocked or error
      }

      isAdLoaded.current = true;
    }
  }, [type]);

  if (Platform.OS !== 'web') {
    // For native, return placeholder or nothing
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
        ref={adRef}
        style={{
          width: config.width,
          height: config.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
