import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';

interface PanelProps {
  title: string;
  children: ReactNode;
  style?: object;
}

export const Panel: React.FC<PanelProps> = ({ title, children, style }) => {
  return (
    <View style={[styles.panel, style]}>
      {/* Decorative corner accents */}
      <View style={[styles.cornerAccent, styles.cornerTopLeft]} />
      <View style={[styles.cornerAccent, styles.cornerTopRight]} />
      <View style={[styles.cornerAccent, styles.cornerBottomLeft]} />
      <View style={[styles.cornerAccent, styles.cornerBottomRight]} />

      {/* Title bar with subtle gradient effect */}
      <View style={styles.titleBar}>
        <View style={styles.titleIndicator} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Content area */}
      <View style={styles.content}>{children}</View>

      {/* Bottom decorative line */}
      <View style={styles.bottomLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: colors.surface.dark,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.surface.darkElevated,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 400,
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(10px)',
    }),
    ...shadows.md,
  },

  // Corner accents for that premium instrument feel
  cornerAccent: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: colors.accent[600],
  },
  cornerTopLeft: {
    top: 8,
    left: 8,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTopRight: {
    top: 8,
    right: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBottomLeft: {
    bottom: 8,
    left: 8,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBottomRight: {
    bottom: 8,
    right: 8,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },

  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 190, 37, 0.1)',
  },
  titleIndicator: {
    width: 4,
    height: 16,
    backgroundColor: colors.accent[500],
    borderRadius: 2,
    marginRight: spacing[3],
  },
  title: {
    color: colors.text.dark.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  content: {
    flex: 1,
    padding: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: spacing[6],
    right: spacing[6],
    height: 2,
    backgroundColor: colors.accent[500],
    opacity: 0.2,
    borderRadius: 1,
  },
});
