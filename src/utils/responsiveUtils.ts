/**
 * Responsive utility functions
 * Pure functions extracted for testing
 */

export type LayoutMode = 'mobile' | 'tablet' | 'desktop-small' | 'desktop-large';

// Breakpoints in pixels
export const BREAKPOINTS = {
  MOBILE: 0,
  TABLET: 1120,
  DESKTOP_SMALL: 1280,
  DESKTOP_LARGE: 1440,
} as const;

/**
 * Get layout mode based on screen width
 */
export const getLayoutMode = (width: number): LayoutMode => {
  if (width >= BREAKPOINTS.DESKTOP_LARGE) return 'desktop-large';
  if (width >= BREAKPOINTS.DESKTOP_SMALL) return 'desktop-small';
  if (width >= BREAKPOINTS.TABLET) return 'tablet';
  return 'mobile';
};

/**
 * Check if layout mode is mobile
 */
export const isMobileLayout = (layoutMode: LayoutMode): boolean => {
  return layoutMode === 'mobile';
};

/**
 * Check if layout mode is tablet
 */
export const isTabletLayout = (layoutMode: LayoutMode): boolean => {
  return layoutMode === 'tablet';
};

/**
 * Check if layout mode is desktop (small or large)
 */
export const isDesktopLayout = (layoutMode: LayoutMode): boolean => {
  return layoutMode === 'desktop-small' || layoutMode === 'desktop-large';
};

/**
 * Check if sidebar should be shown
 */
export const shouldShowSidebar = (layoutMode: LayoutMode): boolean => {
  return layoutMode === 'desktop-small' || layoutMode === 'desktop-large';
};

/**
 * Check if both sidebars should be shown
 */
export const shouldShowBothSidebars = (layoutMode: LayoutMode): boolean => {
  return layoutMode === 'desktop-large';
};

/**
 * Check if columns layout should be used
 */
export const shouldUseColumnsLayout = (layoutMode: LayoutMode): boolean => {
  return layoutMode !== 'mobile';
};
