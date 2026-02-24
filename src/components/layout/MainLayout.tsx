import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { colors, spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import type { PanelType } from '@/types';

interface MainLayoutProps {
  metronomePanel: React.ReactNode;
  timerPanel: React.ReactNode;
  audioPanel: React.ReactNode;
  onLanguagePress?: () => void;
  onSubscriptionPress?: () => void;
  onLoginPress?: () => void;
  onMenuPress?: () => void;
  isLoggedIn?: boolean;
  language?: string;
}

const PANEL_INDICATORS: PanelType[] = ['metronome', 'timer', 'audio'];

export const MainLayout: React.FC<MainLayoutProps> = ({
  metronomePanel,
  timerPanel,
  audioPanel,
  onLanguagePress,
  onSubscriptionPress,
  onLoginPress,
  onMenuPress,
  isLoggedIn,
  language,
}) => {
  const { columnsLayout, isMobile, showSidebar, showBothSidebars, width } = useResponsive();
  const [activePanel, setActivePanel] = useState<PanelType>('metronome');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!columnsLayout) {
        const scrollX = event.nativeEvent.contentOffset.x;
        const panelWidth = width;
        const index = Math.round(scrollX / panelWidth);
        setActivePanel(PANEL_INDICATORS[index] || 'metronome');
      }
    },
    [columnsLayout, width]
  );

  const scrollToPanel = useCallback(
    (panel: PanelType) => {
      const index = PANEL_INDICATORS.indexOf(panel);
      scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
      setActivePanel(panel);
    },
    [width]
  );

  // Desktop layout - 3 columns
  if (columnsLayout) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          onLanguagePress={onLanguagePress}
          onSubscriptionPress={onSubscriptionPress}
          onLoginPress={onLoginPress}
          onMenuPress={onMenuPress}
          isLoggedIn={isLoggedIn}
          language={language}
        />

        <View style={styles.desktopContent}>
          {/* Left Ad Space */}
          {showBothSidebars && <View style={styles.adSidebar} />}

          {/* Main Panels */}
          <View style={styles.panelsContainer}>
            <View style={styles.panel}>{metronomePanel}</View>
            <View style={styles.panel}>{timerPanel}</View>
            <View style={styles.panel}>{audioPanel}</View>
          </View>

          {/* Right Ad Space */}
          {showSidebar && <View style={styles.adSidebar} />}
        </View>

        {/* Bottom Ad */}
        <View style={styles.adBannerBottom} />
      </SafeAreaView>
    );
  }

  // Mobile layout - Swipeable panels
  return (
    <SafeAreaView style={styles.container}>
      <Header
        onLanguagePress={onLanguagePress}
        onSubscriptionPress={onSubscriptionPress}
        onLoginPress={onLoginPress}
        onMenuPress={onMenuPress}
        isLoggedIn={isLoggedIn}
        language={language}
      />

      {/* Panel Indicators */}
      <View style={styles.indicators}>
        {PANEL_INDICATORS.map((panel) => (
          <View
            key={panel}
            style={[styles.indicator, activePanel === panel && styles.indicatorActive]}
          />
        ))}
      </View>

      {/* Swipeable Panels */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.mobileScrollView}
        contentContainerStyle={styles.mobileScrollContent}
      >
        <View style={[styles.mobilePanel, { width }]}>{metronomePanel}</View>
        <View style={[styles.mobilePanel, { width }]}>{timerPanel}</View>
        <View style={[styles.mobilePanel, { width }]}>{audioPanel}</View>
      </ScrollView>

      {/* Bottom Ad */}
      <View style={styles.adBannerBottomMobile} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },

  // Desktop styles
  desktopContent: {
    flex: 1,
    flexDirection: 'row',
    padding: spacing[6],
    gap: spacing[4],
  },
  panelsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing[4],
  },
  panel: {
    flex: 1,
  },
  adSidebar: {
    width: 160,
    backgroundColor: colors.surface.dark,
    borderRadius: 8,
    opacity: 0.5, // Placeholder visibility
  },
  adBannerBottom: {
    height: 90,
    backgroundColor: colors.surface.dark,
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
    borderRadius: 8,
    opacity: 0.5, // Placeholder visibility
  },

  // Mobile styles
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface.darkElevated,
  },
  indicatorActive: {
    backgroundColor: colors.accent[500],
    width: 24,
  },
  mobileScrollView: {
    flex: 1,
  },
  mobileScrollContent: {
    flexGrow: 1,
  },
  mobilePanel: {
    padding: spacing[4],
  },
  adBannerBottomMobile: {
    height: 50,
    backgroundColor: colors.surface.dark,
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    borderRadius: 8,
    opacity: 0.5, // Placeholder visibility
  },
});
