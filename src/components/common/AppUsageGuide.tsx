import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const metronomeImage = require('../../../assets/2.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const timerImage = require('../../../assets/1.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const audioImage = require('../../../assets/6.png');

// AdSense審査対策のため、現時点では常時表示
// 審査通過後は SHOW_BY_DEFAULT を false にして
// ボタンで表示/非表示を切り替える形式に変更予定
const SHOW_BY_DEFAULT = true;

interface FeatureSection {
  id: string;
  title: string;
  image: ReturnType<typeof require>;
  description: string;
  steps: string[];
}

const FEATURES: FeatureSection[] = [
  {
    id: 'metronome',
    title: 'メトロノーム',
    image: metronomeImage,
    description:
      '高精度なデジタルメトロノームで、正確なリズム感を身につけましょう。±1ミリ秒以内の精度で安定したテンポを刻みます。',
    steps: [
      'BPMを設定：+/-ボタンまたはプリセットから選択（20〜300 BPM対応）',
      '拍子を選択：2/4、3/4、4/4、6/8などの拍子記号に対応',
      'アクセント設定：強拍の位置をカスタマイズ可能',
      'STARTで再生開始：視覚的なビートインジケーターで現在位置を確認',
    ],
  },
  {
    id: 'timer',
    title: 'タイマー',
    image: timerImage,
    description:
      '練習時間を管理するためのタイマー機能です。集中して練習するための時間管理に最適です。',
    steps: [
      '時間を設定：+30秒、+1分、+5分などのボタンで簡単設定',
      'STARTでカウントダウン開始',
      'PAUSE/RESUMEで一時停止・再開',
      'RESETで設定時間にリセット（残り10秒で色が変化してお知らせ）',
    ],
  },
  {
    id: 'audio',
    title: '音源再生',
    image: audioImage,
    description:
      'お手本の音源を聴きながら練習できます。MP3/WAVファイルに対応し、特定区間のリピート再生も可能です。',
    steps: [
      'SELECT FILEから音声ファイルを選択（MP3/WAV、最大20MB）',
      '再生ボタンで再生・一時停止、±15秒でスキップ',
      'シークバーで再生位置を自由に移動',
      'A-Bリピート機能で特定区間を繰り返し再生（有料版）',
    ],
  },
];

interface PracticeMethod {
  title: string;
  description: string;
}

const PRACTICE_METHODS: PracticeMethod[] = [
  {
    title: '1. ゆっくり始めて徐々に速く',
    description:
      '新しい曲やフレーズを練習するときは、まず遅いテンポ（目標の50-60%程度）から始めましょう。完璧に弾けるようになったら、少しずつテンポを上げていきます。これにより、正確な指の動きと音楽的な表現を両立できます。',
  },
  {
    title: '2. ポモドーロ・テクニックを活用',
    description:
      '25分間集中して練習し、5分間休憩するサイクルを繰り返します。タイマー機能を使って時間を管理することで、集中力を維持しながら効率的に練習できます。長時間の練習よりも、短く集中した練習の方が上達が早いことが多いです。',
  },
  {
    title: '3. お手本と一緒に練習',
    description:
      '音源再生機能を使って、プロの演奏やお手本の音源を聴きながら練習しましょう。まずは聴くことから始め、次にメトロノームに合わせて練習し、最後に音源と一緒に演奏します。この3ステップで着実に上達できます。',
  },
  {
    title: '4. 難しい部分を集中的に',
    description:
      '曲全体を通して練習するだけでなく、苦手な部分を取り出して集中的に練習しましょう。A-Bリピート機能を使えば、難しいフレーズを何度も繰り返し聴いて練習できます。部分練習と全体練習をバランスよく行うことが大切です。',
  },
  {
    title: '5. 毎日の短い練習を習慣に',
    description:
      '週に1回長時間練習するよりも、毎日15-30分の短い練習を続ける方が効果的です。タイマーを使って練習時間を決め、毎日同じ時間に練習する習慣をつけましょう。継続は力なりです。',
  },
];

export const AppUsageGuide: React.FC = () => {
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
        accessibilityRole="button"
      >
        <Text style={styles.toggleButtonText}>
          {isExpanded ? '使い方を閉じる' : 'このアプリの使い方'}
        </Text>
      </TouchableOpacity>

      {/* Content */}
      {isExpanded && (
        <View style={styles.content}>
          {/* App Overview */}
          <View style={styles.overviewSection}>
            <Text style={styles.overviewTitle}>MetronomeMegaMax について</Text>
            <Text style={styles.overviewText}>
              MetronomeMegaMax
              は、楽器練習をサポートするオールインワンアプリです。高精度メトロノーム、練習タイマー、音源再生の3つの機能を1つのアプリにまとめました。プロの演奏家から趣味で楽器を楽しむ方まで、あらゆるレベルの音楽家の練習をサポートします。
            </Text>
          </View>

          {/* Feature Sections */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionHeader}>各機能の使い方</Text>

            {FEATURES.map((feature) => (
              <View key={feature.id} style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <View style={styles.featureBadge}>
                    <Text style={styles.featureBadgeText}>{feature.title}</Text>
                  </View>
                </View>

                <View style={styles.featureImageContainer}>
                  <Image
                    source={feature.image}
                    style={styles.featureImage}
                    resizeMode="contain"
                  />
                </View>

                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>

                <View style={styles.stepsContainer}>
                  {feature.steps.map((step, index) => (
                    <View key={index} style={styles.stepRow}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Practice Methods Section */}
          <View style={styles.practiceSection}>
            <View style={styles.practiceSectionHeader}>
              <Text style={styles.practiceSectionTitle}>
                このアプリを使っての効率の良い練習法
              </Text>
              <Text style={styles.practiceSectionSubtitle}>
                音楽の上達には正しい練習方法が欠かせません。このアプリの機能を活用して、効率的に練習しましょう。
              </Text>
            </View>

            {PRACTICE_METHODS.map((method, index) => (
              <View key={index} style={styles.practiceCard}>
                <Text style={styles.practiceTitle}>{method.title}</Text>
                <Text style={styles.practiceDescription}>
                  {method.description}
                </Text>
              </View>
            ))}

            {/* Closing Message */}
            <View style={styles.closingMessage}>
              <Text style={styles.closingText}>
                MetronomeMegaMax
                を活用して、楽しみながら効率的に練習しましょう。継続的な練習が上達への一番の近道です。
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    marginHorizontal: spacing[4],
    marginVertical: spacing[4],
    borderWidth: 2,
    borderColor: colors.border.primary,
  },

  // Toggle Button
  toggleButton: {
    alignSelf: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[8],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border.primary,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
  },
  toggleButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },

  // Content
  content: {
    marginTop: spacing[6],
  },

  // Overview Section
  overviewSection: {
    marginBottom: spacing[8],
    paddingBottom: spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  overviewTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  overviewText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    textAlign: 'center',
  },

  // Features Container
  featuresContainer: {
    marginBottom: spacing[8],
  },
  sectionHeader: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[4],
    paddingBottom: spacing[2],
    borderBottomWidth: 2,
    borderBottomColor: colors.accent[500],
  },

  // Feature Card
  featureCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  featureHeader: {
    marginBottom: spacing[3],
  },
  featureBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
  },
  featureBadgeText: {
    color: colors.surface.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  featureImageContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.md,
    padding: spacing[2],
  },
  featureImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
  },
  featureDescription: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
    marginBottom: spacing[4],
  },

  // Steps
  stepsContainer: {
    gap: spacing[2],
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent[500],
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    color: colors.surface.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  stepText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },

  // Practice Section
  practiceSection: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  practiceSectionHeader: {
    marginBottom: spacing[5],
  },
  practiceSectionTitle: {
    color: colors.primary[900],
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
  },
  practiceSectionSubtitle: {
    color: colors.primary[700],
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },

  // Practice Card
  practiceCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    marginBottom: spacing[3],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  practiceTitle: {
    color: colors.primary[800],
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
  },
  practiceDescription: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },

  // Closing Message
  closingMessage: {
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.primary[200],
  },
  closingText: {
    color: colors.primary[700],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
});
