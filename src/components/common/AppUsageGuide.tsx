import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const metronomeImage = require('../../../assets/2.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const timerImage = require('../../../assets/1.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const audioImage = require('../../../assets/6.png');

interface UsageSection {
  title: string;
  image: ReturnType<typeof require>;
  steps: { title: string; description: string }[];
}

const USAGE_SECTIONS: UsageSection[] = [
  {
    title: 'メトロノームの使い方',
    image: metronomeImage,
    steps: [
      {
        title: 'BPMを設定する',
        description: '中央の数字がテンポ（BPM）です。+/-ボタンで1ずつ調整できます。長押しで10ずつ変更できます。20〜300 BPMの範囲で設定可能です。',
      },
      {
        title: '拍子を選択する',
        description: 'TIMEボタンから2/4、3/4、4/4、6/8など様々な拍子を選択できます。演奏する曲に合わせて設定してください。',
      },
      {
        title: 'アクセントを設定する',
        description: 'ACCENTボタンで強拍の位置を変更できます。1拍目のみ、1・3拍目、2・4拍目から選択可能です。',
      },
      {
        title: '再生する',
        description: 'STARTボタンを押すとメトロノームが開始します。上部のドットインジケーターが現在のビートを視覚的に示します。±1ミリ秒以内の高精度で正確なリズムを刻みます。',
      },
    ],
  },
  {
    title: 'タイマーの使い方',
    image: timerImage,
    steps: [
      {
        title: '練習時間を設定する',
        description: '+30s、+1m、+5m、+10m、+30m などのボタンをタップして練習時間を追加します。最大24時間まで設定可能です。',
      },
      {
        title: 'タイマーを開始する',
        description: 'STARTボタンを押すとカウントダウンが始まります。残り時間が画面中央に時・分・秒で表示されます。',
      },
      {
        title: '一時停止・再開する',
        description: '練習中に休憩を取りたい時はPAUSEボタンで一時停止できます。RESUMEボタンで再開できます。',
      },
      {
        title: 'リセットする',
        description: 'RESETボタンで設定した時間に戻せます。残り10秒になると数字がオレンジ色に変わり、終了をお知らせします。',
      },
    ],
  },
  {
    title: 'オーディオプレーヤーの使い方',
    image: audioImage,
    steps: [
      {
        title: 'ファイルを選択する',
        description: 'SELECT FILEボタンからMP3またはWAVファイルを選択します。最大20MBまでのファイルに対応しています。',
      },
      {
        title: '再生・一時停止する',
        description: '中央の再生ボタンで音源を再生・一時停止できます。-15/+15ボタンで15秒ずつスキップできます。',
      },
      {
        title: 'シークバーで移動する',
        description: 'シークバーをドラッグして再生位置を自由に変更できます。現在の再生時間と総時間が表示されます。',
      },
      {
        title: 'A-Bリピートを使う（有料版）',
        description: '特定の区間を繰り返し再生できます。Aボタンで開始点、Bボタンで終了点を設定し、LOOPボタンでリピート再生。難しいフレーズの練習に最適です。',
      },
    ],
  },
];

const TIPS = [
  '練習は遅いテンポから始めて、徐々に速くしていくのが効果的です',
  'ポモドーロテクニック（25分練習 + 5分休憩）を試してみてください',
  'お手本の演奏を聴きながらメトロノームに合わせて練習できます',
  '有料版ではプリセット保存、A-Bリピート、再生速度変更などの機能が使えます',
];

// AdSense審査対策のため、現時点では常時表示
// 審査通過後は SHOW_BY_DEFAULT を false にして
// ボタンで表示/非表示を切り替える形式に変更予定
const SHOW_BY_DEFAULT = true;

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
      >
        <Text style={styles.toggleButtonText}>
          {isExpanded ? '使い方を閉じる' : '使い方はこちら'}
        </Text>
        <Text style={styles.toggleIcon}>{isExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Content */}
      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.mainTitle}>MetronomeMegaMax の使い方</Text>
          <Text style={styles.mainDescription}>
            音楽練習のためのオールインワンアプリ。高精度メトロノーム、練習タイマー、オーディオプレーヤーを1つのアプリで使用できます。
          </Text>

          {/* Usage Sections */}
          {USAGE_SECTIONS.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>

              {/* Image */}
              <View style={styles.imageContainer}>
                <Image source={section.image} style={styles.image} resizeMode="cover" />
              </View>

              {/* Steps */}
              <View style={styles.stepsContainer}>
                {section.steps.map((step, stepIndex) => (
                  <View key={stepIndex} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDescription}>{step.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>練習のヒント</Text>
            {TIPS.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 2,
    borderColor: colors.border.primary,
  },

  // Toggle Button
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    backgroundColor: colors.accent[500],
    borderRadius: borderRadius.md,
    alignSelf: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  toggleButtonText: {
    color: colors.surface.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  toggleIcon: {
    color: colors.surface.primary,
    fontSize: typography.fontSize.sm,
    marginLeft: spacing[2],
  },

  // Content
  content: {
    marginTop: spacing[4],
  },

  // Main Title
  mainTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  mainDescription: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },

  // Section
  section: {
    marginBottom: spacing[6],
    paddingBottom: spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionTitle: {
    color: colors.accent[500],
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
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
    height: 200,
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
    padding: spacing[4],
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  tipsTitle: {
    color: colors.primary[700],
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[3],
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  tipBullet: {
    color: colors.primary[500],
    fontSize: typography.fontSize.base,
    marginRight: spacing[2],
  },
  tipText: {
    color: colors.primary[800],
    fontSize: typography.fontSize.sm,
    flex: 1,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
});
