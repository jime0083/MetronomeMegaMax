/**
 * Responsive utility functions tests
 */

import {
  getLayoutMode,
  isMobileLayout,
  isTabletLayout,
  isDesktopLayout,
  shouldShowSidebar,
  shouldShowBothSidebars,
  shouldUseColumnsLayout,
  BREAKPOINTS,
  LayoutMode,
} from '../../../src/utils/responsiveUtils';

describe('responsiveUtils', () => {
  describe('BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(BREAKPOINTS.MOBILE).toBe(0);
      expect(BREAKPOINTS.TABLET).toBe(1120);
      expect(BREAKPOINTS.DESKTOP_SMALL).toBe(1280);
      expect(BREAKPOINTS.DESKTOP_LARGE).toBe(1440);
    });
  });

  describe('getLayoutMode', () => {
    it('should return mobile for widths below tablet breakpoint', () => {
      expect(getLayoutMode(0)).toBe('mobile');
      expect(getLayoutMode(320)).toBe('mobile');
      expect(getLayoutMode(768)).toBe('mobile');
      expect(getLayoutMode(1119)).toBe('mobile');
    });

    it('should return tablet for widths at or above tablet breakpoint but below desktop-small', () => {
      expect(getLayoutMode(1120)).toBe('tablet');
      expect(getLayoutMode(1200)).toBe('tablet');
      expect(getLayoutMode(1279)).toBe('tablet');
    });

    it('should return desktop-small for widths at or above desktop-small but below desktop-large', () => {
      expect(getLayoutMode(1280)).toBe('desktop-small');
      expect(getLayoutMode(1350)).toBe('desktop-small');
      expect(getLayoutMode(1439)).toBe('desktop-small');
    });

    it('should return desktop-large for widths at or above desktop-large', () => {
      expect(getLayoutMode(1440)).toBe('desktop-large');
      expect(getLayoutMode(1920)).toBe('desktop-large');
      expect(getLayoutMode(2560)).toBe('desktop-large');
    });
  });

  describe('isMobileLayout', () => {
    it('should return true for mobile layout', () => {
      expect(isMobileLayout('mobile')).toBe(true);
    });

    it('should return false for non-mobile layouts', () => {
      expect(isMobileLayout('tablet')).toBe(false);
      expect(isMobileLayout('desktop-small')).toBe(false);
      expect(isMobileLayout('desktop-large')).toBe(false);
    });
  });

  describe('isTabletLayout', () => {
    it('should return true for tablet layout', () => {
      expect(isTabletLayout('tablet')).toBe(true);
    });

    it('should return false for non-tablet layouts', () => {
      expect(isTabletLayout('mobile')).toBe(false);
      expect(isTabletLayout('desktop-small')).toBe(false);
      expect(isTabletLayout('desktop-large')).toBe(false);
    });
  });

  describe('isDesktopLayout', () => {
    it('should return true for desktop-small layout', () => {
      expect(isDesktopLayout('desktop-small')).toBe(true);
    });

    it('should return true for desktop-large layout', () => {
      expect(isDesktopLayout('desktop-large')).toBe(true);
    });

    it('should return false for non-desktop layouts', () => {
      expect(isDesktopLayout('mobile')).toBe(false);
      expect(isDesktopLayout('tablet')).toBe(false);
    });
  });

  describe('shouldShowSidebar', () => {
    it('should return true for desktop layouts', () => {
      expect(shouldShowSidebar('desktop-small')).toBe(true);
      expect(shouldShowSidebar('desktop-large')).toBe(true);
    });

    it('should return false for mobile and tablet', () => {
      expect(shouldShowSidebar('mobile')).toBe(false);
      expect(shouldShowSidebar('tablet')).toBe(false);
    });
  });

  describe('shouldShowBothSidebars', () => {
    it('should return true only for desktop-large', () => {
      expect(shouldShowBothSidebars('desktop-large')).toBe(true);
    });

    it('should return false for other layouts', () => {
      expect(shouldShowBothSidebars('mobile')).toBe(false);
      expect(shouldShowBothSidebars('tablet')).toBe(false);
      expect(shouldShowBothSidebars('desktop-small')).toBe(false);
    });
  });

  describe('shouldUseColumnsLayout', () => {
    it('should return true for non-mobile layouts', () => {
      expect(shouldUseColumnsLayout('tablet')).toBe(true);
      expect(shouldUseColumnsLayout('desktop-small')).toBe(true);
      expect(shouldUseColumnsLayout('desktop-large')).toBe(true);
    });

    it('should return false for mobile', () => {
      expect(shouldUseColumnsLayout('mobile')).toBe(false);
    });
  });
});
