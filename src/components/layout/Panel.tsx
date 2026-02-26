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
      {/* Title bar */}
      <View style={styles.titleBar}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Content area */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border.primary,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 400,
    ...shadows.sm,
  },

  titleBar: {
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: colors.border.primary,
    backgroundColor: colors.surface.primary,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  content: {
    flex: 1,
    padding: spacing[4],
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
