# テストルール

## TDD（テスト駆動開発）

### 基本サイクル

```
RED     → 失敗するテストを書く
GREEN   → テストを通す最小限のコードを書く
REFACTOR → コードを改善（テストは通したまま）
REPEAT  → 次の機能へ
```

### 実践

1. 新機能実装時は**必ずテストを先に書く**
2. テストが失敗することを確認してから実装
3. 実装後、テストが通ることを確認

## カバレッジ要件

| 種類 | 最低カバレッジ |
|------|---------------|
| ユニットテスト | 80% |
| 統合テスト | 主要フロー |
| E2Eテスト | クリティカルパス |

## テスト構成

```
__tests__/
├── unit/           # ユニットテスト
│   ├── hooks/
│   ├── utils/
│   └── services/
├── integration/    # 統合テスト
│   ├── auth/
│   └── payment/
└── e2e/           # E2Eテスト
    └── flows/
```

## ユニットテスト

### 対象
- ユーティリティ関数
- カスタムフック
- ビジネスロジック
- 状態管理

### 例

```typescript
// utils/bpmUtils.test.ts
describe('calculateInterval', () => {
  it('should return correct interval for 60 BPM', () => {
    expect(calculateInterval(60)).toBe(1000);
  });

  it('should return correct interval for 120 BPM', () => {
    expect(calculateInterval(120)).toBe(500);
  });

  it('should throw error for invalid BPM', () => {
    expect(() => calculateInterval(0)).toThrow();
    expect(() => calculateInterval(-1)).toThrow();
  });
});
```

## 統合テスト

### 対象
- Firebase認証フロー
- 課金フロー
- データ同期

### 例

```typescript
// integration/auth/googleSignIn.test.ts
describe('Google Sign-In Flow', () => {
  it('should successfully sign in with Google', async () => {
    // モックの設定
    mockGoogleSignIn.mockResolvedValueOnce({ user: mockUser });

    // テスト実行
    const result = await signInWithGoogle();

    // 検証
    expect(result.user.uid).toBe(mockUser.uid);
    expect(firestore.collection).toHaveBeenCalledWith('users');
  });
});
```

## E2Eテスト

### 対象
- ユーザー登録〜課金までのフロー
- メトロノーム操作フロー
- プリセット保存〜読み込みフロー

### ツール
- Playwright（Web）
- Detox（iOS）

## メトロノーム精度テスト

### 特別な要件

メトロノームの精度は最重要要件のため、専用のテストを実施：

```typescript
describe('Metronome Accuracy', () => {
  it('should maintain ±1ms accuracy over 100 beats', async () => {
    const bpm = 120;
    const expectedInterval = 500; // ms
    const beats: number[] = [];

    // 100ビートを記録
    metronome.onBeat((timestamp) => beats.push(timestamp));
    metronome.start(bpm);
    await wait(50000); // 100ビート分
    metronome.stop();

    // 各ビート間隔を検証
    for (let i = 1; i < beats.length; i++) {
      const interval = beats[i] - beats[i - 1];
      expect(Math.abs(interval - expectedInterval)).toBeLessThanOrEqual(1);
    }
  });
});
```

## モック・スタブ

### Firebase モック

```typescript
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));
```

### ネイティブモジュール モック

```typescript
jest.mock('react-native', () => ({
  NativeModules: {
    MetronomeModule: {
      start: jest.fn(),
      stop: jest.fn(),
      setBpm: jest.fn(),
    },
  },
}));
```

## CI/CD でのテスト実行

```yaml
# GitHub Actions 例
- name: Run Tests
  run: |
    npm run test:unit
    npm run test:integration
    npm run test:coverage

- name: Check Coverage
  run: |
    npm run coverage:check -- --threshold 80
```
