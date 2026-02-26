/**
 * User Menu Component
 * Displays user avatar/login button in header
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { LoginModal } from './LoginModal';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../constants/theme';

interface UserMenuProps {
  compact?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ compact = false }) => {
  const { user, isPremium, isLoading, signOut } = useAuth();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginPress = useCallback(() => {
    setIsLoginModalVisible(true);
  }, []);

  const handleCloseLoginModal = useCallback(() => {
    setIsLoginModalVisible(false);
  }, []);

  const handleAvatarPress = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsMenuOpen(false);
    await signOut();
  }, [signOut]);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
      </View>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <>
        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            compact && styles.loginButtonCompact,
            pressed && styles.loginButtonPressed,
          ]}
          onPress={handleLoginPress}
        >
          <Text style={styles.loginButtonText}>
            {compact ? '\u2605' : 'ログイン'}
          </Text>
        </Pressable>

        <LoginModal
          visible={isLoginModalVisible}
          onClose={handleCloseLoginModal}
        />
      </>
    );
  }

  // Logged in
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.avatarButton,
          pressed && styles.avatarButtonPressed,
        ]}
        onPress={handleAvatarPress}
      >
        {user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {user.displayName?.[0] ?? user.email?.[0] ?? '?'}
            </Text>
          </View>
        )}

        {/* Premium badge */}
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>{'\u2605'}</Text>
          </View>
        )}
      </Pressable>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setIsMenuOpen(false)}
          />

          {/* Menu */}
          <View style={styles.menu}>
            {/* User info */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuUserName} numberOfLines={1}>
                {user.displayName ?? 'ユーザー'}
              </Text>
              <Text style={styles.menuUserEmail} numberOfLines={1}>
                {user.email}
              </Text>
              {isPremium && (
                <View style={styles.menuPremiumTag}>
                  <Text style={styles.menuPremiumTagText}>PREMIUM</Text>
                </View>
              )}
            </View>

            {/* Divider */}
            <View style={styles.menuDivider} />

            {/* Menu items */}
            {!isPremium && (
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={() => {
                  setIsMenuOpen(false);
                  setIsLoginModalVisible(true);
                }}
              >
                <Text style={styles.menuItemIcon}>{'\u2605'}</Text>
                <Text style={styles.menuItemText}>プレミアムにアップグレード</Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={handleSignOut}
            >
              <Text style={styles.menuItemIcon}>{'\u2192'}</Text>
              <Text style={styles.menuItemText}>ログアウト</Text>
            </Pressable>
          </View>
        </>
      )}

      <LoginModal
        visible={isLoginModalVisible}
        onClose={handleCloseLoginModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },

  // Loading
  loadingContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.text.tertiary,
  },

  // Login button
  loginButton: {
    backgroundColor: colors.accent[500],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.primary,
    ...shadows.sm,
  },
  loginButtonCompact: {
    paddingHorizontal: spacing[3],
  },
  loginButtonPressed: {
    backgroundColor: colors.accent[600],
    transform: [{ scale: 0.98 }],
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },

  // Avatar button
  avatarButton: {
    position: 'relative',
  },
  avatarButtonPressed: {
    opacity: 0.8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[500],
    borderWidth: 2,
    borderColor: colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },

  // Premium badge
  premiumBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent[500],
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadgeText: {
    fontSize: 10,
    color: '#ffffff',
  },

  // Menu backdrop
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...(Platform.OS === 'web'
      ? { position: 'fixed' as 'absolute', top: 0, right: 0, bottom: 0, left: 0 }
      : {}),
  },

  // Menu
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: spacing[2],
    minWidth: 220,
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border.primary,
    overflow: 'hidden',
    ...shadows.lg,
    zIndex: 100,
  },

  // Menu header
  menuHeader: {
    padding: spacing[4],
    backgroundColor: colors.background.tertiary,
  },
  menuUserName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  menuUserEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  menuPremiumTag: {
    marginTop: spacing[2],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    backgroundColor: colors.accent[500],
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  menuPremiumTagText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#ffffff',
    letterSpacing: 1,
  },

  // Menu divider
  menuDivider: {
    height: 1,
    backgroundColor: colors.border.light,
  },

  // Menu item
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
  },
  menuItemPressed: {
    backgroundColor: colors.background.tertiary,
  },
  menuItemIcon: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    width: 20,
    textAlign: 'center',
  },
  menuItemText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
});
