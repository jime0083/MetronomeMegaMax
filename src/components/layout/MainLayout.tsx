import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import type { PanelType } from '@/types';

interface MainLayoutProps {
  metronomePanel: React.ReactNode;
  timerPanel: React.ReactNode;
  audioPanel: React.ReactNode;
  onLanguagePress?: () => void;
  onMenuPress?: () => void;
  language?: string;
}

const PANEL_INDICATORS: PanelType[] = ['metronome', 'timer', 'audio'];

export const MainLayout: React.FC<MainLayoutProps> = ({
  metronomePanel,
  timerPanel,
  audioPanel,
  onLanguagePress,
  onMenuPress,
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

  const goToPreviousPanel = useCallback(() => {
    const currentIndex = PANEL_INDICATORS.indexOf(activePanel);
    if (currentIndex > 0) {
      scrollToPanel(PANEL_INDICATORS[currentIndex - 1]);
    }
  }, [activePanel, scrollToPanel]);

  const goToNextPanel = useCallback(() => {
    const currentIndex = PANEL_INDICATORS.indexOf(activePanel);
    if (currentIndex < PANEL_INDICATORS.length - 1) {
      scrollToPanel(PANEL_INDICATORS[currentIndex + 1]);
    }
  }, [activePanel, scrollToPanel]);

  // Desktop layout - 3 columns
  if (columnsLayout) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          onLanguagePress={onLanguagePress}
          onMenuPress={onMenuPress}
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

  // Mobile layout - Swipeable panels with navigation arrows
  const currentIndex = PANEL_INDICATORS.indexOf(activePanel);
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < PANEL_INDICATORS.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onLanguagePress={onLanguagePress}
        onMenuPress={onMenuPress}
        language={language}
      />

      {/* Panel Navigation */}
      <View style={styles.panelNavigation}>
        {/* Left Arrow */}
        <TouchableOpacity
          style={[styles.navArrow, !canGoBack && styles.navArrowDisabled]}
          onPress={goToPreviousPanel}
          disabled={!canGoBack}
          accessibilityLabel="Previous panel"
        >
          <Text style={[styles.navArrowText, !canGoBack && styles.navArrowTextDisabled]}>
            {'<'}
          </Text>
        </TouchableOpacity>

        {/* Panel Indicators */}
        <View style={styles.indicators}>
          {PANEL_INDICATORS.map((panel) => (
            <TouchableOpacity
              key={panel}
              style={[styles.indicator, activePanel === panel && styles.indicatorActive]}
              onPress={() => scrollToPanel(panel)}
              accessibilityLabel={`Go to ${panel} panel`}
            />
          ))}
        </View>

        {/* Right Arrow */}
        <TouchableOpacity
          style={[styles.navArrow, !canGoForward && styles.navArrowDisabled]}
          onPress={goToNextPanel}
          disabled={!canGoForward}
          accessibilityLabel="Next panel"
        >
          <Text style={[styles.navArrowText, !canGoForward && styles.navArrowTextDisabled]}>
            {'>'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: colors.background.primary,
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
    backgroundColor: colors.surface.border,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    opacity: 0.5,
  },
  adBannerBottom: {
    height: 90,
    backgroundColor: colors.surface.border,
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    opacity: 0.5,
  },

  // Mobile styles
  panelNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  navArrow: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.primary,
    borderWidth: 2,
    borderColor: colors.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowDisabled: {
    borderColor: colors.border.light,
    backgroundColor: colors.background.tertiary,
  },
  navArrowText: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginTop: -2,
  },
  navArrowTextDisabled: {
    color: colors.text.disabled,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surface.border,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  indicatorActive: {
    backgroundColor: colors.accent[500],
    borderColor: colors.accent[600],
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
    backgroundColor: colors.surface.border,
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    opacity: 0.5,
  },
});
