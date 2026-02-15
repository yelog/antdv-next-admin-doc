# クイックスタート

## 環境準備

開始する前に、開発環境が以下の要件を満たしていることを確認してください：

| ツール | バージョン要件 | 説明 |
| --- | --- | --- |
| Node.js | >= 16 | LTS バージョンを推奨 |
| npm | >= 8 | または pnpm を使用（推奨） |
| Git | 最新版 | バージョン管理 |

::: tip 推奨
パッケージ管理ツールとして [pnpm](https://pnpm.io/) の使用を推奨します。インストール速度が速く、ディスク使用量が少なくなります。

```bash
npm install -g pnpm
```
:::

## コードの取得

```bash
git clone https://github.com/yelog/antdv-next-admin.git
cd antdv-next-admin
```

## 依存関係のインストール

```bash
# pnpm を使用（推奨）
pnpm install

# または npm を使用
npm install
```

## 開発サーバーの起動

```bash
# pnpm を使用
pnpm dev

# または npm を使用
npm run dev
```

起動が成功したら、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスします。

デモアカウントでログイン：
- **管理者**：`admin` / `123456`（全権限あり）
- **一般ユーザー**：`user` / `123456`（限定権限）

## ビルドとプレビュー

```bash
# 型チェック
pnpm type-check

# プロダクションビルド
pnpm build

# 型チェック + プロダクションビルド
pnpm build:check

# ビルド成果物のプレビュー
pnpm preview
```

## 環境変数

プロジェクトは `.env` ファイルで環境変数を管理します：

| ファイル | 説明 |
| --- | --- |
| `.env` | すべての環境で共通の変数 |
| `.env.development` | 開発環境変数 |
| `.env.production` | プロダクション環境変数 |

### 主要な変数

```bash
# アプリケーションタイトル
VITE_APP_TITLE=Antdv Next Admin

# API ベースパス
VITE_API_BASE_URL=/api

# Mock データを有効化（開発環境ではデフォルトで有効）
VITE_USE_MOCK=true
```

::: warning 注意
環境変数を変更した後は、開発サーバーを再起動する必要があります。
:::

## 次のステップ

- [プロジェクト構造](/guide/project-structure) を理解してコード構成に慣れる
- [ルーティングシステム](/guide/routing) を読んでページがどのように構成されているかを理解する
- [権限システム](/guide/permission) を確認して権限制御方法を習得する
- [Pro コンポーネント](/components/pro-table) を使用してビジネスページを迅速に開発する
