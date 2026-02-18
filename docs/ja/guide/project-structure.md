# プロジェクト構造

## ディレクトリ概要

```
antdv-next-admin/
├── mock/                          # Mock データ
│   ├── data/                      # データソース（faker.js で生成）
│   │   ├── auth.data.ts
│   │   ├── user.data.ts
│   │   ├── role.data.ts
│   │   └── ...
│   └── handlers/                  # リクエストハンドラー
│       ├── auth.mock.ts
│       ├── user.mock.ts
│       └── ...
├── public/                        # 静的リソース
│   └── logo.svg
├── src/
│   ├── api/                       # API インターフェースモジュール
│   │   ├── auth.ts                # 認証インターフェース
│   │   ├── user.ts                # ユーザー管理インターフェース
│   │   ├── role.ts                # ロール管理インターフェース
│   │   └── ...
│   ├── assets/                    # プロジェクトリソース
│   │   └── styles/
│   │       └── variables.css      # CSS デザイン変数（100+）
│   ├── components/                # 共通コンポーネント
│   │   ├── Icon/                  # アイコンコンポーネント
│   │   ├── IconPicker/            # アイコンピッカー
│   │   ├── Layout/                # レイアウトコンポーネント
│   │   ├── Permission/            # 権限コンポーネント
│   │   │   └── PermissionButton.vue
│   │   └── Pro/                   # Pro コンポーネント
│   │       ├── ProTable/          # 高度なテーブル
│   │       ├── ProForm/           # 高度なフォーム
│   │       └── ProModal/          # 高度なモーダル
│   ├── composables/               # コンポーザブル関数
│   │   ├── usePermission.ts       # 権限検証
│   │   └── ...
│   ├── directives/                # カスタムディレクティブ
│   │   └── permission.ts          # v-permission ディレクティブ
│   ├── locales/                   # 国際化
│   │   ├── index.ts               # i18n 設定
│   │   ├── zh-CN.ts               # 中国語
│   │   └── en-US.ts               # 英語
│   ├── router/                    # ルーター
│   │   ├── index.ts               # ルーターインスタンス
│   │   ├── routes.ts              # ルート設定
│   │   └── guards.ts              # ルートガード
│   ├── stores/                    # 状態管理（Pinia）
│   │   ├── auth.ts                # 認証状態
│   │   ├── permission.ts          # 権限状態
│   │   ├── theme.ts               # テーマ状態
│   │   ├── layout.ts              # レイアウト状態
│   │   ├── tabs.ts                # タブ状態
│   │   └── settings.ts            # ユーザー設定
│   ├── types/                     # 型定義
│   │   ├── api.ts                 # API 型
│   │   ├── auth.ts                # 認証型
│   │   ├── router.ts              # ルーター型
│   │   ├── layout.ts              # レイアウト型
│   │   └── pro.ts                 # Pro コンポーネント型
│   ├── utils/                     # ユーティリティ関数
│   │   ├── request.ts             # Axios リクエストラッパー
│   │   └── ...
│   ├── views/                     # ページビュー
│   │   ├── dashboard/             # ダッシュボード
│   │   ├── login/                 # ログインページ
│   │   ├── organization/          # 組織管理
│   │   ├── system/                # システム管理
│   │   ├── examples/              # サンプルページ
│   │   └── error/                 # エラーページ
│   ├── App.vue                    # ルートコンポーネント
│   └── main.ts                    # アプリケーションエントリー
├── .env                           # 共通環境変数
├── .env.development               # 開発環境変数
├── .env.production                # プロダクション環境変数
├── index.html                     # HTML エントリー
├── package.json
├── tsconfig.json                  # TypeScript 設定
└── vite.config.ts                 # Vite 設定
```

## 主要ディレクトリの説明

### `src/api/`

ビジネスドメインごとに整理された API インターフェースモジュール。各ファイルは1つの機能モジュールに対応し、`@/utils/request.ts` でラップされた Axios インスタンスを使用してリクエストを送信します。

### `src/components/Pro/`

コア Pro コンポーネント、設定駆動型の高度なビジネスコンポーネント。詳細は [ProTable](/components/pro-table)、[ProForm](/components/pro-form)、[ProModal](/components/pro-modal) のドキュメントを参照してください。

### `src/stores/`

すべての Store は Pinia **Setup Store** 構文（`defineStore('name', () => { ... })`）を使用し、Options Store ではありません。Store の初期化はルートガードによってトリガーされ、コンポーネントから直接トリガーされることはありません。

### `src/router/routes.ts`

ルート設定は3層構造：
- **staticRoutes** — 認証不要（ログイン、エラーページ）
- **basicRoutes** — 認証必要（ダッシュボード、個人センター）
- **asyncRoutes** — 権限必要（システム管理、組織管理など）

### `src/types/`

TypeScript 型定義の一元管理。`pro.ts` にはすべての Pro コンポーネントのインターフェース定義が含まれており、Pro コンポーネント開発の重要な参考資料です。

### `mock/`

Mock データシステムは2層アーキテクチャを採用：`data/` にデータ生成ロジック（faker.js を使用）、`handlers/` にリクエスト処理ロジックを格納します。

## パスエイリアス

プロジェクトは `@/` パスエイリアスを設定し、`src/` ディレクトリを指しています：

```typescript
// import { useAuthStore } from '../stores/auth' と同等
import { useAuthStore } from '@/stores/auth'
```

このエイリアスは `vite.config.ts` と `tsconfig.json` の両方で設定されています。
