import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

interface UsageStep {
  title: string;
  description: string;
}

interface UsageGuideProps {
  title: string;
  image: ImageSourcePropType;
  steps: UsageStep[];
  tips?: string[];
}

// AdSense審査対策のため、現時点では常時表示
// 審査通過後は showByDefault を false にして
// ボタンで表示/非表示を切り替える形式に変更予定
const SHOW_BY_DEFAULT = true;

export const UsageGuide: React.FC<UsageGuideProps> = ({
  title,
  image,
  steps,
  tips,
}) => {
  const [isExpanded, setIsExpanded] = useState(SHOW_BY_DEFAULT);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      {/* Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleExpanded}
        accessibilityLabel={isExpanded ? '使い方を閉じる' : '使い方を開く'}
      >
        <Text style={styles.toggleButtonText}>
          {isExpanded ? '使い方を閉じる' : '使い方はこちら'}
        </Text>
        <Text style={styles.toggleIcon}>{isExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Content */}
      {isExpanded && (
        <View style={styles.content}>
          {/* Header */}
          <Text style={styles.title}>{title}</Text>

          {/* Image */}
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.image} resizeMode="cover" />
          </View>

          {/* Steps */}
          <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Tips */}
          {tips && tips.length > 0 && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>ヒント</Text>
              {tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: spacing[4],
  },

  // Toggle Button
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.surface.elevated,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignSelf: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  toggleButtonText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  toggleIcon: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    marginLeft: spacing[2],
  },

  // Content
  content: {
    marginTop: spacing[4],
  },

  // Title
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing[4],
  },

  // Image
  imageContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.lg,
  },

  // Steps
  stepsContainer: {
    gap: spacing[3],
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent[500],
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    color: colors.surface.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[1],
  },
  stepDescription: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },

  // Tips
  tipsContainer: {
    marginTop: spacing[4],
    padding: spacing[3],
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[500],
  },
  tipsTitle: {
    color: colors.primary[700],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[1],
  },
  tipBullet: {
    color: colors.primary[500],
    fontSize: typography.fontSize.sm,
    marginRight: spacing[2],
  },
  tipText: {
    color: colors.primary[800],
    fontSize: typography.fontSize.sm,
    flex: 1,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
});
