# MetronomeMegaMax プロジェクトルール

## 最重要要件

> **メトロノームのテンポは常に正確に鳴らす**
> この要件は他のすべての機能より優先される。

### パフォーマンス優先順位

1. メトロノームの精度（±1ms以内）
2. アプリの軽量性
3. その他の機能

### 禁止事項

- メトロノームのタイミングに影響を与える可能性のある処理をメインスレッドで実行しない
- JavaScript の `setInterval` / `setTimeout` を音声タイミングに使用しない
- 広告読み込みでメトロノーム再生を妨げない

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React Native + React Native for Web |
| 言語 | TypeScript（strict mode必須） |
| 認証 | Firebase Authentication |
| データベース | Firebase Firestore |
| ストレージ | Firebase Storage |
| iOS決済 | App Store In-App Purchase |
| Web決済 | Stripe |

## オーディオ実装

### iOS
- AVAudioEngine / AVAudioPlayerNode を使用
- Look-ahead スケジューリングパターンを実装
- Swift ネイティブモジュールで実装

### Web
- Web Audio API の AudioContext を使用
- `audioContext.currentTime` ベースのスケジューリング
- Look-ahead パターン（25ms間隔でチェック、100ms先読み）

## ファイル構成

```
src/
├── components/     # 共通UIコンポーネント
├── screens/        # 画面コンポーネント
├── hooks/          # カスタムフック
├── services/       # Firebase, Stripe等の外部サービス
├── utils/          # ユーティリティ関数
├── i18n/           # 多言語対応
├── native/         # ネイティブモジュール（iOS）
└── types/          # TypeScript型定義
```

## 有料版機能

以下は有料版（月額200円）のみ：
- BPMプリセット保存（10個まで）
- タイマープリセット保存（10個まで）
- A-Bリピート
- ループポイント保存（3個まで）
- 再生速度変更
- バックグラウンド再生（iOS）
- 広告非表示

## 多言語対応

対応言語：日本語、英語、スペイン語
- i18n キーは英語ベースで命名
- 翻訳ファイルは `src/i18n/` に配置
