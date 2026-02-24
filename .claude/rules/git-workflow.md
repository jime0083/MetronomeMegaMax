# Git ワークフロールール

## コミットメッセージ形式

```
<type>: <description>

[optional body]

[optional footer]
```

### Type（種類）

| Type | 用途 |
|------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `refactor` | リファクタリング（機能変更なし） |
| `docs` | ドキュメントのみ |
| `test` | テストの追加・修正 |
| `chore` | ビルド、設定変更など |
| `style` | コードスタイル（フォーマットなど） |
| `perf` | パフォーマンス改善 |

### 例

```
feat: Add metronome start/stop functionality

- Implement AVAudioEngine for iOS
- Add Web Audio API support
- Create native bridge for React Native

Closes #123
```

## ブランチ戦略

```
main
  └── develop
        ├── feature/metronome-core
        ├── feature/timer-ui
        ├── fix/bpm-accuracy
        └── release/1.0.0
```

### ブランチ命名規則

| パターン | 用途 |
|----------|------|
| `feature/<name>` | 新機能開発 |
| `fix/<name>` | バグ修正 |
| `release/<version>` | リリース準備 |
| `hotfix/<name>` | 緊急修正 |

## プルリクエスト

### タイトル形式
```
[Type] Short description
```

例: `[feat] Add metronome core functionality`

### 本文テンプレート

```markdown
## Summary
- 変更内容の概要（1-3行）

## Changes
- 具体的な変更点

## Test Plan
- [ ] テスト項目1
- [ ] テスト項目2

## Screenshots (if applicable)
```

### レビュー要件

- コードレビュー: 最低1人の承認
- CI/CDパス: 必須
- テストカバレッジ: 80%以上維持

## 禁止事項

### main/developへの直接プッシュ禁止
- 必ずプルリクエスト経由

### Force Push 禁止
- `git push --force` は原則禁止
- 例外: 自分のfeatureブランチでのリベース後のみ

### コミットしてはいけないファイル
- `.env` / `.env.*`
- `GoogleService-Info.plist`
- `node_modules/`
- ビルド成果物

## 推奨ワークフロー

### 新機能開発

```bash
# 1. developから分岐
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. 実装・コミット
git add .
git commit -m "feat: Add new feature"

# 3. プッシュ・PR作成
git push -u origin feature/new-feature
# PRを作成

# 4. レビュー後マージ
# GitHub上でマージ

# 5. ローカルのクリーンアップ
git checkout develop
git pull origin develop
git branch -d feature/new-feature
```

### コンフリクト解決

```bash
# developの最新を取り込む
git checkout feature/my-feature
git fetch origin
git rebase origin/develop

# コンフリクト解決後
git add .
git rebase --continue
git push --force-with-lease
```

## リリースフロー

```bash
# 1. リリースブランチ作成
git checkout develop
git checkout -b release/1.0.0

# 2. バージョン番号更新
# package.json, app.json などを更新

# 3. 最終テスト・修正

# 4. mainにマージ
git checkout main
git merge release/1.0.0
git tag v1.0.0
git push origin main --tags

# 5. developにマージバック
git checkout develop
git merge release/1.0.0
git push origin develop
```
