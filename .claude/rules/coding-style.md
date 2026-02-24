# コーディングスタイルルール

## UI/フロントエンドデザイン

**重要:** UIコンポーネントやページを作成・修正する際は、必ず `/frontend-design` スキルを使用すること。

### 使用タイミング
- 新規コンポーネント作成時
- 画面（Screen）作成時
- スタイリング・デザイン調整時
- レイアウト変更時

### デザイン原則
- 汎用的な「AIっぽい」デザインを避ける
- 独自性のある印象的なUIを目指す
- タイポグラフィ、カラー、モーション、空間構成に注意
- 文脈に適したデザイン選択

## TypeScript

### 基本設定
- `strict: true` 必須
- `any` 型の使用禁止（`unknown` を使用）
- 明示的な型定義を推奨

### 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `MetronomePanel` |
| 関数 | camelCase | `calculateBpm` |
| 定数 | UPPER_SNAKE_CASE | `MAX_BPM` |
| 型/インターフェース | PascalCase | `BpmPreset` |
| ファイル名（コンポーネント） | PascalCase | `MetronomePanel.tsx` |
| ファイル名（その他） | camelCase | `audioUtils.ts` |

## React / React Native

### コンポーネント設計

```typescript
// 関数コンポーネントを使用
const MetronomePanel: React.FC<MetronomePanelProps> = ({ bpm, onBpmChange }) => {
  // hooks は最上部に
  const [isPlaying, setIsPlaying] = useState(false);

  // イベントハンドラは useCallback で
  const handleStart = useCallback(() => {
    setIsPlaying(true);
  }, []);

  return (
    // JSX
  );
};
```

### State管理
- ローカル状態: `useState`
- 複雑な状態: `useReducer`
- グローバル状態: Context API
- サーバー状態: React Query / SWR（必要に応じて）

## ファイル構成

### ファイルサイズ
- 1ファイル 200〜400行を目安
- 最大800行まで
- 超える場合は分割を検討

### インポート順序

```typescript
// 1. React / React Native
import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';

// 2. 外部ライブラリ
import { useTranslation } from 'react-i18next';

// 3. 内部モジュール（絶対パス）
import { Button } from '@/components/Button';
import { useBpm } from '@/hooks/useBpm';

// 4. 型定義
import type { BpmPreset } from '@/types';

// 5. スタイル / 定数
import { styles } from './styles';
```

## イミュータビリティ

### 配列操作
```typescript
// Good
const newArray = [...oldArray, newItem];
const filtered = array.filter(item => item.id !== id);

// Bad
oldArray.push(newItem);
```

### オブジェクト操作
```typescript
// Good
const newObj = { ...oldObj, key: newValue };

// Bad
oldObj.key = newValue;
```

## エラーハンドリング

```typescript
// try-catch を使用
try {
  await someAsyncOperation();
} catch (error) {
  if (error instanceof SpecificError) {
    // 特定のエラー処理
  }
  // エラーをログに記録（本番では console.log 禁止）
  logger.error('Operation failed', error);
}
```

## コメント

- 自明なコードにはコメント不要
- 複雑なロジックには「なぜ」を説明
- TODO/FIXME は Issue 番号を含める

```typescript
// Good: なぜこの処理が必要かを説明
// Web Audio API のバックグラウンド制限を回避するため、
// 100ms 先までの音をプリスケジュールする
const LOOK_AHEAD_TIME = 0.1;

// Bad: コードの内容をそのまま説明
// bpm に 60 を掛ける
const interval = 60 / bpm;
```
