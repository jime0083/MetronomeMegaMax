# セキュリティルール

## 機密情報の管理

### 絶対禁止
- APIキー、シークレットをコードにハードコードしない
- Firebase設定ファイルをGitにコミットしない
- ユーザーの認証トークンをログに出力しない

### 環境変数の使用

```typescript
// Good
const apiKey = process.env.FIREBASE_API_KEY;

// Bad
const apiKey = 'AIzaSy...';
```

### .gitignore に含めるべきファイル
- `GoogleService-Info.plist`
- `.env` / `.env.local` / `.env.production`
- `firebase-config.json`

## 認証・認可

### Firebase Authentication
- 認証状態は常にサーバーサイドで検証
- クライアントサイドの認証状態のみに依存しない

### 有料版機能のアクセス制御
```typescript
// Good: サーバーサイドで課金状態を確認
const isPremium = await checkSubscriptionStatus(userId);
if (!isPremium) {
  throw new UnauthorizedError('Premium subscription required');
}

// Bad: クライアントサイドのみで制御
if (localState.isPremium) {
  // 機能を実行
}
```

## 入力検証

### ユーザー入力は必ず検証

```typescript
// BPM入力の例
const validateBpm = (value: unknown): number => {
  const bpm = Number(value);
  if (isNaN(bpm) || bpm < 20 || bpm > 300) {
    throw new ValidationError('BPM must be between 20 and 300');
  }
  return bpm;
};
```

### ファイルアップロード
- ファイルサイズ: 20MB以下
- MIMEタイプ: `audio/mpeg`, `audio/wav` のみ許可
- サーバーサイド（Firebase Storage Rules）でも検証

## Firebase セキュリティルール

### Firestore
- ユーザーは自分のデータのみアクセス可能
- 管理者権限の分離

### Storage
- ユーザーは自分のフォルダのみアクセス可能
- ファイルサイズ・MIMEタイプの制限

## 課金・決済

### iOS (App Store)
- レシート検証はサーバーサイドで実施
- クライアントサイドのレシートを信頼しない

### Web (Stripe)
- Webhook署名を必ず検証
- 決済完了はWebhookからのみ確定

## ログ出力

### 本番環境での禁止事項
- `console.log` の使用禁止
- ユーザーIDを含むログ出力
- 認証トークン・APIキーのログ出力

### 開発環境
- 適切なログレベルを使用（debug, info, warn, error）
- 本番ビルド時に自動削除される仕組みを導入

## HTTPS

- すべての通信はHTTPS必須
- HTTPへのフォールバック禁止
