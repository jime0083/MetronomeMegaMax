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

interface HeaderProps {
  onLanguagePress?: () => void;
  onSubscriptionPress?: () => void;
  onLoginPress?: () => void;
  onMenuPress?: () => void;
  isLoggedIn?: boolean;
  language?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onLanguagePress,
  onSubscriptionPress,
  onLoginPress,
  onMenuPress,
  isLoggedIn = false,
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
          <Text style={styles.chevron}>▾</Text>
        </TouchableOpacity>

        <Text style={styles.logoMobile}>MMM</Text>

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
          <Text style={styles.chevronSmall}>▾</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={onSubscriptionPress}
        >
          <Text style={styles.headerButtonText}>Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.headerButton, styles.loginButton]}
          onPress={onLoginPress}
        >
          <Text style={styles.loginButtonText}>
            {isLoggedIn ? 'Account' : 'Login'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: colors.background.dark,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.dark,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface.dark,
    borderRadius: borderRadius.md,
  },
  languageText: {
    color: colors.text.dark.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 1,
  },
  chevron: {
    color: colors.text.dark.secondary,
    fontSize: typography.fontSize.xs,
    marginLeft: spacing[1],
  },
  logoMobile: {
    color: colors.accent[500],
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.black,
    letterSpacing: 4,
  },
  menuButton: {
    padding: spacing[2],
    gap: 4,
  },
  menuLine: {
    width: 22,
    height: 2,
    backgroundColor: colors.text.dark.primary,
    borderRadius: 1,
  },

  // Desktop header
  headerDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    backgroundColor: colors.background.dark,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.dark,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  logo: {
    color: colors.text.dark.primary,
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
    color: colors.text.dark.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  chevronSmall: {
    color: colors.text.dark.tertiary,
    fontSize: 10,
    marginLeft: spacing[1],
  },
  loginButton: {
    backgroundColor: colors.accent[500],
    paddingHorizontal: spacing[5],
  },
  loginButtonText: {
    color: colors.background.dark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
