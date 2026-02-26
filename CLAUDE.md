# MetronomeMegaMax

音楽練習アプリ - メトロノーム、タイマー、オーディオ再生機能を提供

## 作業ルール

### 中断なし実行
- 「Do you want to proceed?」のような確認で作業を中断しない
- 「Do you want to make this edit?」のような許可確認で作業を中断しない
- ファイル編集、ディレクトリ作成、パッケージインストール等は許可を求めずに実行する
- 一連のタスクが完了するまで自律的に作業を進める
- **すべての作業が完了した後に**、何をどのように実装したかを詳細に報告する

### 報告内容（作業完了時）
1. 実装した機能の概要
2. 作成・変更したファイル一覧
3. 技術的な判断の理由
4. 次のステップの提案

### Phase完了時の報告
- 各Phaseの作業が完了した時点で、一度作業を停止し以下を報告する
  1. 完了したPhaseの名前と概要
  2. 実装した機能のリスト
  3. 作成・変更したファイル一覧
  4. progress.txtおよびprogress-archive.txtの更新状況
  5. 次のPhaseに進む前に必要な手動作業（あれば）
- 報告後、ユーザーの確認を得てから次のPhaseに進む

## 最重要要件

> **メトロノームのテンポは常に正確に鳴らす（±1ms以内）**

この要件は他のすべての機能より優先される。

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React Native + React Native for Web |
| 言語 | TypeScript (strict mode) |
| 認証 | Firebase Authentication |
| DB | Firebase Firestore |
| ストレージ | Firebase Storage |
| iOS決済 | App Store IAP |
| Web決済 | Stripe |

## コマンド

```bash
# 開発
npm start              # Expo開発サーバー起動
npm run web            # Web版起動
npm run ios            # iOS版起動

# テスト
npm test               # 全テスト実行
npm run test:unit      # ユニットテスト
npm run test:coverage  # カバレッジレポート

# ビルド
npm run build:web      # Web版ビルド
npx tsc --noEmit       # 型チェック
```

## ディレクトリ構成

```
src/
├── components/     # 共通UIコンポーネント
├── screens/        # 画面コンポーネント
├── hooks/          # カスタムフック
├── services/       # Firebase, Stripe等
├── utils/          # ユーティリティ
├── i18n/           # 多言語（日/英/西）
├── native/         # iOSネイティブモジュール
└── types/          # 型定義
```

## 開発ルール

### UI/フロントエンド
- **UIコンポーネント作成時は必ず `/frontend-design` スキルを使用**
- 汎用的な「AIっぽい」デザインを避ける
- 独自性のある印象的なUIを目指す

### コーディング
- `any` 型禁止（`unknown` を使用）
- イミュータブルな操作
- ファイルサイズ: 200-400行（最大800行）
- `console.log` コミット禁止

### オーディオ実装
- iOS: AVAudioEngine + Look-ahead スケジューリング
- Web: Web Audio API + `audioContext.currentTime` ベース
- `setInterval` / `setTimeout` を音声タイミングに使用禁止

### テスト
- TDD: テストを先に書く
- カバレッジ 80%以上
- 完了前に `npx tsc --noEmit` 必須

### Git
- コミット形式: `<type>: <description>`
- Type: feat, fix, refactor, docs, test, chore

## タスク管理

| ファイル | 用途 |
|----------|------|
| progress.txt | 実装タスク（フェーズ別） |
| manual-work.txt | 外部サービス設定タスク |

## 詳細ルール

- `.claude/rules/project.md` - プロジェクト固有ルール
- `.claude/rules/coding-style.md` - コーディング規約
- `.claude/rules/security.md` - セキュリティ
- `.claude/rules/testing.md` - テスト
- `.claude/rules/git-workflow.md` - Git運用
