import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { UserMenu } from '../auth';

interface HeaderProps {
  onLanguagePress?: () => void;
  onMenuPress?: () => void;
  language?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onLanguagePress,
  onMenuPress,
  language = 'JA',
}) => {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <View style={styles.headerMobile}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={onLanguagePress}
          accessibilityLabel="Change language"
        >
          <Text style={styles.languageText}>{language}</Text>
          <Text style={styles.chevron}>{'\u25BE'}</Text>
        </TouchableOpacity>

        <Text style={styles.logoMobile}>MMM</Text>

        <View style={styles.mobileRightActions}>
          <UserMenu compact />
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress}
            accessibilityLabel="Open menu"
          >
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.headerDesktop}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>METRONOME</Text>
        <Text style={styles.logoAccent}>MEGA</Text>
        <Text style={styles.logo}>MAX</Text>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onLanguagePress}
        >
          <Text style={styles.headerButtonText}>{language}</Text>
          <Text style={styles.chevronSmall}>{'\u25BE'}</Text>
        </TouchableOpacity>

        <UserMenu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Mobile header
  headerMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  languageText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 1,
  },
  chevron: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginLeft: spacing[1],
  },
  logoMobile: {
    color: colors.accent[500],
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.black,
    letterSpacing: 4,
  },
  mobileRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  menuButton: {
    padding: spacing[2],
    gap: 4,
  },
  menuLine: {
    width: 22,
    height: 2,
    backgroundColor: colors.text.primary,
    borderRadius: 1,
  },

  // Desktop header
  headerDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  logo: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 3,
  },
  logoAccent: {
    color: colors.accent[500],
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.black,
    letterSpacing: 3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
  },
  headerButtonText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  chevronSmall: {
    color: colors.text.tertiary,
    fontSize: 10,
    marginLeft: spacing[1],
  },
});
