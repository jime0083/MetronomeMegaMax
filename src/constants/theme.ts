// Color palette - Clean, light theme for a professional music app
export const colors = {
  // Primary palette - Deep blue for accents
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

  // Accent - Warm orange for pendulum and highlights
  accent: {
    50: '#fff5e6',
    100: '#ffe4bf',
    200: '#ffd194',
    300: '#ffbd69',
    400: '#ffac47',
    500: '#ff9800', // Main orange accent
    600: '#f08c00',
    700: '#cc7600',
    800: '#a86000',
    900: '#804a00',
  },

  // Background colors - Light theme
  background: {
    primary: '#f5f5f5', // Main background
    secondary: '#ffffff', // Cards/panels
    tertiary: '#ebebeb', // Subtle sections
  },

  // Surface colors (cards, panels)
  surface: {
    primary: '#ffffff',
    elevated: '#fafafa',
    border: '#e0e0e0',
  },

  // Text colors
  text: {
    primary: '#1a1a1a', // Main text
    secondary: '#666666', // Secondary text
    tertiary: '#999999', // Hints, placeholders
    disabled: '#cccccc',
  },

  // Border colors
  border: {
    primary: '#333333', // Main borders
    secondary: '#999999', // Secondary borders
    light: '#e0e0e0', // Light borders
  },

  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Beat indicator colors
  beat: {
    inactive: '#e0e0e0',
    active: '#ff9800',
    accent: '#ff6b35',
  },

  // Transparent overlays
  overlay: {
    dark: 'rgba(0, 0, 0, 0.6)',
    medium: 'rgba(0, 0, 0, 0.4)',
    light: 'rgba(0, 0, 0, 0.2)',
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
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
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
