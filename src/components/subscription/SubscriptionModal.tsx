/**
 * Subscription Modal Component
 * Displays premium subscription options with platform-specific purchase flows
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
  Animated,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../constants/theme';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginRequired?: () => void;
}

// Premium features with icons
const PREMIUM_FEATURES = [
  {
    icon: '\u266B',
    title: 'BPMプリセット',
    description: 'お気に入りのテンポを10個まで保存',
  },
  {
    icon: '\u23F1',
    title: 'タイマープリセット',
    description: '練習時間を10個まで保存',
  },
  {
    icon: '\u21BA',
    title: 'A-Bリピート',
    description: '特定の区間を繰り返し練習',
  },
  {
    icon: '\u23E9',
    title: '再生速度変更',
    description: '0.5x〜2.0xまで自由に調整',
  },
  {
    icon: '\u2709',
    title: '広告非表示',
    description: '集中して練習に取り組める',
  },
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  visible,
  onClose,
  onLoginRequired,
}) => {
  const { user } = useAuth();
  const { offerings, purchase, restore, isLoading, error } = useSubscription();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Animation values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(50)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const featureAnimations = useRef(
    PREMIUM_FEATURES.map(() => new Animated.Value(0))
  ).current;

  // Animate modal in/out
  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(modalTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Stagger feature animations
      featureAnimations.forEach((anim, index) => {
        Animated.sequence([
          Animated.delay(200 + index * 60),
          Animated.spring(anim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      // Reset animations
      backdropOpacity.setValue(0);
      modalTranslateY.setValue(50);
      modalOpacity.setValue(0);
      featureAnimations.forEach((anim) => anim.setValue(0));
    }
  }, [visible, backdropOpacity, modalTranslateY, modalOpacity, featureAnimations]);

  const handlePurchase = useCallback(async () => {
    if (!user) {
      onLoginRequired?.();
      return;
    }

    setIsPurchasing(true);
    try {
      const pkg = offerings?.availablePackages?.[0];
      await purchase(pkg);
      onClose();
    } catch {
      // Error is displayed via context
    } finally {
      setIsPurchasing(false);
    }
  }, [user, offerings, purchase, onClose, onLoginRequired]);

  const handleRestore = useCallback(async () => {
    if (!user) {
      onLoginRequired?.();
      return;
    }

    setIsRestoring(true);
    try {
      await restore();
      onClose();
    } catch {
      // Error is displayed via context
    } finally {
      setIsRestoring(false);
    }
  }, [user, restore, onClose, onLoginRequired]);

  const handleBackdropPress = useCallback(() => {
    if (!isPurchasing && !isRestoring) {
      onClose();
    }
  }, [isPurchasing, isRestoring, onClose]);

  // Get price from offerings (iOS) or show default (Web)
  const getPrice = () => {
    if (Platform.OS === 'ios' && offerings?.availablePackages?.[0]) {
      return offerings.availablePackages[0].product.priceString;
    }
    return '¥200';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleBackdropPress}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable
          style={styles.backdropPressable}
          onPress={handleBackdropPress}
        >
          <Pressable
            style={styles.modalPressable}
            onPress={(e) => e.stopPropagation()}
          >
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: modalOpacity,
                  transform: [{ translateY: modalTranslateY }],
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

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.crownContainer}>
                    <Text style={styles.crownIcon}>{'\u2605'}</Text>
                    <View style={styles.crownGlow} />
                  </View>
                  <Text style={styles.title}>PREMIUM</Text>
                  <Text style={styles.subtitle}>
                    練習をもっと効率的に
                  </Text>
                </View>

                {/* Decorative line */}
                <View style={styles.decorativeLine}>
                  <View style={styles.lineSegment} />
                  <View style={styles.lineDiamond} />
                  <View style={styles.lineSegment} />
                </View>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  {PREMIUM_FEATURES.map((feature, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.featureCard,
                        {
                          opacity: featureAnimations[index],
                          transform: [
                            {
                              translateY: featureAnimations[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <View style={styles.featureIconContainer}>
                        <Text style={styles.featureIcon}>{feature.icon}</Text>
                      </View>
                      <View style={styles.featureTextContainer}>
                        <Text style={styles.featureTitle}>{feature.title}</Text>
                        <Text style={styles.featureDescription}>
                          {feature.description}
                        </Text>
                      </View>
                    </Animated.View>
                  ))}
                </View>

                {/* Price section */}
                <View style={styles.priceSection}>
                  <View style={styles.priceBox}>
                    <Text style={styles.priceLabel}>月額</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.price}>{getPrice()}</Text>
                      <Text style={styles.pricePeriod}>/月</Text>
                    </View>
                    <Text style={styles.priceNote}>いつでもキャンセル可能</Text>
                  </View>
                </View>

                {/* Action buttons */}
                <View style={styles.actionsContainer}>
                  {/* Purchase button */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.purchaseButton,
                      pressed && styles.purchaseButtonPressed,
                      (isPurchasing || isLoading) && styles.buttonDisabled,
                    ]}
                    onPress={handlePurchase}
                    disabled={isPurchasing || isLoading}
                  >
                    {isPurchasing ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.purchaseButtonText}>
                        {user ? 'プレミアムに登録' : 'ログインして登録'}
                      </Text>
                    )}
                  </Pressable>

                  {/* Restore button (iOS only) */}
                  {Platform.OS === 'ios' && (
                    <Pressable
                      style={({ pressed }) => [
                        styles.restoreButton,
                        pressed && styles.restoreButtonPressed,
                        isRestoring && styles.buttonDisabled,
                      ]}
                      onPress={handleRestore}
                      disabled={isRestoring || isLoading}
                    >
                      {isRestoring ? (
                        <ActivityIndicator
                          color={colors.text.secondary}
                          size="small"
                        />
                      ) : (
                        <Text style={styles.restoreButtonText}>
                          購入を復元
                        </Text>
                      )}
                    </Pressable>
                  )}
                </View>

                {/* Error message */}
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                {/* Terms */}
                <Text style={styles.terms}>
                  登録することで、利用規約とプライバシーポリシーに同意したものとみなされます。
                  {Platform.OS === 'ios'
                    ? 'サブスクリプションは現在の期間終了の24時間前までにキャンセルしない限り自動更新されます。'
                    : 'サブスクリプションはいつでもキャンセルできます。'}
                </Text>
              </ScrollView>
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
    maxWidth: 420,
    maxHeight: '90%',
  },
  modalContainer: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius['2xl'],
    borderWidth: 3,
    borderColor: colors.border.primary,
    overflow: 'hidden',
    ...shadows.lg,
  },
  scrollContent: {
    padding: spacing[6],
    paddingTop: spacing[8],
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
    zIndex: 10,
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
  crownContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  crownIcon: {
    fontSize: 48,
    color: colors.accent[500],
    textShadowColor: colors.accent[300],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  crownGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent[500],
    opacity: 0.15,
    transform: [{ scale: 1.2 }],
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.text.primary,
    letterSpacing: 6,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },

  // Decorative line
  decorativeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    gap: spacing[2],
  },
  lineSegment: {
    width: 60,
    height: 2,
    backgroundColor: colors.border.light,
  },
  lineDiamond: {
    width: 10,
    height: 10,
    backgroundColor: colors.accent[500],
    transform: [{ rotate: '45deg' }],
  },

  // Features
  featuresContainer: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface.primary,
    borderWidth: 2,
    borderColor: colors.accent[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    color: colors.accent[500],
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },

  // Price section
  priceSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  priceBox: {
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderWidth: 2,
    borderColor: colors.accent[500],
    borderRadius: borderRadius.xl,
    backgroundColor: colors.accent[50],
  },
  priceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[1],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.accent[600],
  },
  pricePeriod: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginLeft: spacing[1],
  },
  priceNote: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing[2],
  },

  // Actions
  actionsContainer: {
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  purchaseButton: {
    backgroundColor: colors.accent[500],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...shadows.md,
  },
  purchaseButtonPressed: {
    backgroundColor: colors.accent[600],
    transform: [{ scale: 0.98 }],
  },
  purchaseButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#ffffff',
  },
  restoreButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  restoreButtonPressed: {
    opacity: 0.7,
  },
  restoreButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.6,
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
