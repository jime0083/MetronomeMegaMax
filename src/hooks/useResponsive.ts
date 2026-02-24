import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';
import { BREAKPOINTS } from '@/constants';

export type LayoutMode = 'mobile' | 'tablet' | 'desktop-small' | 'desktop-large';

interface ResponsiveState {
  width: number;
  height: number;
  layoutMode: LayoutMode;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  showSidebar: boolean;
  showBothSidebars: boolean;
  columnsLayout: boolean;
}

const getLayoutMode = (width: number): LayoutMode => {
  if (width >= BREAKPOINTS.DESKTOP_LARGE) return 'desktop-large';
  if (width >= BREAKPOINTS.DESKTOP_SMALL) return 'desktop-small';
  if (width >= BREAKPOINTS.TABLET) return 'tablet';
  return 'mobile';
};

export const useResponsive = (): ResponsiveState => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription.remove();
  }, []);

  const { width, height } = dimensions;
  const layoutMode = Platform.OS === 'web' ? getLayoutMode(width) : 'mobile';

  return {
    width,
    height,
    layoutMode,
    isMobile: layoutMode === 'mobile',
    isTablet: layoutMode === 'tablet',
    isDesktop: layoutMode === 'desktop-small' || layoutMode === 'desktop-large',
    showSidebar: layoutMode === 'desktop-small' || layoutMode === 'desktop-large',
    showBothSidebars: layoutMode === 'desktop-large',
    columnsLayout: layoutMode !== 'mobile',
  };
};
