// Color palette - Deep, rich tones for a professional music app
export const colors = {
  // Primary palette - Deep midnight blue with warm accents
  primary: {
    50: '#e8f0ff',
    100: '#c5d9ff',
    200: '#9ebfff',
    300: '#74a5ff',
    400: '#5490ff',
    500: '#3b7bff',
    600: '#3570e8',
    700: '#2d62cc',
    800: '#2554b0',
    900: '#1a3d80',
  },

  // Accent - Warm amber/gold for highlights
  accent: {
    50: '#fff8e6',
    100: '#ffecbf',
    200: '#ffdf94',
    300: '#ffd269',
    400: '#ffc847',
    500: '#ffbe25',
    600: '#f0a800',
    700: '#cc8f00',
    800: '#a87600',
    900: '#805a00',
  },

  // Background colors
  background: {
    dark: '#0a0a12',
    darkSecondary: '#12121f',
    darkTertiary: '#1a1a2e',
    light: '#f8f9fc',
    lightSecondary: '#ffffff',
    lightTertiary: '#eef1f6',
  },

  // Surface colors (cards, panels)
  surface: {
    dark: '#16162a',
    darkElevated: '#1e1e38',
    light: '#ffffff',
    lightElevated: '#f5f7fa',
  },

  // Text colors
  text: {
    dark: {
      primary: '#ffffff',
      secondary: '#a0a0b8',
      tertiary: '#6b6b80',
      disabled: '#454560',
    },
    light: {
      primary: '#1a1a2e',
      secondary: '#5a5a72',
      tertiary: '#8a8a9e',
      disabled: '#b5b5c5',
    },
  },

  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Beat indicator colors
  beat: {
    inactive: '#2a2a45',
    active: '#ffbe25',
    accent: '#ff6b35',
  },

  // Transparent overlays
  overlay: {
    dark: 'rgba(10, 10, 18, 0.8)',
    medium: 'rgba(10, 10, 18, 0.5)',
    light: 'rgba(10, 10, 18, 0.3)',
  },
} as const;

// Typography
export const typography = {
  fontFamily: {
    display: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SF Mono", "Fira Code", "Consolas", monospace',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
    '8xl': 96,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '900' as const,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Spacing scale
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#ffbe25',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;

// Animation durations
export const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;
