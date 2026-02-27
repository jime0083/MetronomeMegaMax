/**
 * Login Modal Component
 * Displays Google Sign-In with premium benefits
 */

import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
  Animated,
} from 'react-native';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { useTranslation } from '../../hooks/useTranslation';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../constants/theme';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

// Premium benefits for display
const PREMIUM_BENEFITS = [
  { icon: '\u266A', text: 'BPMプリセット保存（10個）' },
  { icon: '\u23F1', text: 'タイマープリセット保存（10個）' },
  { icon: '\u21BA', text: 'A-Bリピート機能' },
  { icon: '\u23EF', text: '再生速度変更（0.5x〜2x）' },
  { icon: '\u2709', text: '広告非表示' },
];

export const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  onClose,
  onLoginSuccess,
}) => {
  const { signIn, isLoading, errorKey } = useGoogleAuth();
  const { t } = useTranslation();

  // Animation values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.9)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const benefitAnimations = useRef(
    PREMIUM_BENEFITS.map(() => new Animated.Value(0))
  ).current;

  // Animate modal in/out
  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Stagger benefit animations
      const staggerDelay = 80;
      benefitAnimations.forEach((anim, index) => {
        Animated.sequence([
          Animated.delay(300 + index * staggerDelay),
          Animated.spring(anim, {
            toValue: 1,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      // Reset animations
      backdropOpacity.setValue(0);
      modalScale.setValue(0.9);
      modalOpacity.setValue(0);
      benefitAnimations.forEach((anim) => anim.setValue(0));
    }
  }, [visible, backdropOpacity, modalScale, modalOpacity, benefitAnimations]);

  const handleSignIn = useCallback(async () => {
    try {
      await signIn();
      onLoginSuccess?.();
      onClose();
    } catch {
      // Error is handled by the hook
    }
  }, [signIn, onLoginSuccess, onClose]);

  const handleBackdropPress = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleBackdropPress}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: backdropOpacity },
        ]}
      >
        <Pressable style={styles.backdropPressable} onPress={handleBackdropPress}>
          {/* Modal container */}
          <Pressable
            style={styles.modalPressable}
            onPress={(e) => e.stopPropagation()}
          >
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: modalOpacity,
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              {/* Close button */}
              <Pressable
                style={styles.closeButton}
                onPress={handleBackdropPress}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Text style={styles.closeButtonText}>{'\u2715'}</Text>
              </Pressable>

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{'\u2605'}</Text>
                </View>
                <Text style={styles.title}>PREMIUM</Text>
                <Text style={styles.subtitle}>
                  ログインして全機能をアンロック
                </Text>
              </View>

              {/* Benefits list */}
              <View style={styles.benefitsContainer}>
                {PREMIUM_BENEFITS.map((benefit, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.benefitRow,
                      {
                        opacity: benefitAnimations[index],
                        transform: [
                          {
                            translateX: benefitAnimations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [-20, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <View style={styles.benefitIconContainer}>
                      <Text style={styles.benefitIcon}>{benefit.icon}</Text>
                    </View>
                    <Text style={styles.benefitText}>{benefit.text}</Text>
                  </Animated.View>
                ))}
              </View>

              {/* Price tag */}
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>月額</Text>
                <Text style={styles.price}>¥200</Text>
                <Text style={styles.pricePeriod}>/月</Text>
              </View>

              {/* Google Sign-In button */}
              <Pressable
                style={({ pressed }) => [
                  styles.googleButton,
                  pressed && styles.googleButtonPressed,
                  isLoading && styles.googleButtonDisabled,
                ]}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                <View style={styles.googleButtonContent}>
                  {/* Google icon */}
                  <View style={styles.googleIconContainer}>
                    <Text style={styles.googleIcon}>G</Text>
                  </View>
                  <Text style={styles.googleButtonText}>
                    {isLoading ? '処理中...' : 'Googleでログイン'}
                  </Text>
                </View>
              </Pressable>

              {/* Error message */}
              {errorKey && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{t(`errors.${errorKey}`)}</Text>
                </View>
              )}

              {/* Terms */}
              <Text style={styles.terms}>
                ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます
              </Text>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay.dark,
  },
  backdropPressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  modalPressable: {
    width: '100%',
    maxWidth: 400,
  },
  modalContainer: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    borderWidth: 3,
    borderColor: colors.border.primary,
    padding: spacing[6],
    position: 'relative',
    ...shadows.lg,
  },

  // Close button
  closeButton: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.bold,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
    ...shadows.glow,
  },
  icon: {
    fontSize: 32,
    color: '#ffffff',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.text.primary,
    letterSpacing: 4,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Benefits
  benefitsContainer: {
    marginBottom: spacing[6],
    gap: spacing[3],
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  benefitIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    borderWidth: 2,
    borderColor: colors.primary[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitIcon: {
    fontSize: typography.fontSize.lg,
    color: colors.primary[600],
  },
  benefitText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },

  // Price
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing[6],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.light,
  },
  priceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginRight: spacing[2],
  },
  price: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.accent[500],
  },
  pricePeriod: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing[1],
  },

  // Google button
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    marginBottom: spacing[4],
    ...shadows.sm,
  },
  googleButtonPressed: {
    backgroundColor: colors.background.tertiary,
    transform: [{ scale: 0.98 }],
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: '#4285f4',
  },
  googleButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },

  // Error
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: borderRadius.md,
    padding: spacing[3],
    marginBottom: spacing[4],
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    textAlign: 'center',
  },

  // Terms
  terms: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: typography.fontSize.xs * typography.lineHeight.relaxed,
  },
});
