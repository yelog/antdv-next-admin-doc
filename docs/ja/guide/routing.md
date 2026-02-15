# ルーティングシステム

## 概要

Antdv Next Admin は Vue Router 4 を採用し、ルーティング設定は権限要件に応じて3つの階層に分類され、ルートガードと連携して動的ルート注入と権限フィルタリングを実現します。

## ルート分類

### 静的ルート（staticRoutes）

認証不要でアクセス可能なページ：

```typescript
// ログインページ、404、403、500などのエラーページ
const staticRoutes = [
  { path: '/login', component: Login },
  { path: '/404', component: NotFound },
  { path: '/403', component: Forbidden },
  { path: '/500', component: ServerError },
]
```

### 基本ルート（basicRoutes）

認証が必要だが特定の権限は不要なページ：

```typescript
// ダッシュボード、プロフィール、アバウトページなど
const basicRoutes = [
  {
    path: '/dashboard',
    meta: { title: 'menu.dashboard', icon: 'DashboardOutlined', affix: true },
  },
  {
    path: '/profile',
    meta: { title: 'menu.profile', hidden: true },
  },
]
```

### 非同期ルート（asyncRoutes）

特定の権限が必要なページで、ユーザーログイン後に権限に基づいて動的に注入されます：

```typescript
const asyncRoutes = [
  {
    path: '/organization',
    meta: { title: 'menu.organization', icon: 'TeamOutlined' },
    children: [
      {
        path: 'user',
        meta: {
          title: 'menu.user',
          requiredPermissions: ['system.user.view'],
        },
      },
      {
        path: 'role',
        meta: {
          title: 'menu.role',
          requiredPermissions: ['system.role.view'],
        },
      },
    ],
  },
]
```

## ルート Meta フィールド

| フィールド | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `title` | `string` | — | ページタイトル（i18n key） |
| `icon` | `string` | — | メニューアイコンコンポーネント名 |
| `requiresAuth` | `boolean` | `true` | 認証が必要か |
| `requiredPermissions` | `string[]` | — | 必要な権限コード |
| `requiredRoles` | `string[]` | — | 必要なロールコード |
| `hidden` | `boolean` | `false` | メニューで非表示にするか |
| `affix` | `boolean` | `false` | タブを固定するか（閉じられない） |
| `order` | `number` | — | メニューの並び順 |
| `externalLink` | `string` | — | 外部リンクアドレス |

## 動的ルート生成フロー

```
ユーザーログイン
  ↓
ルートガード（guards.ts）が最初のナビゲーションを傍受
  ↓
permissionStore.generateRoutes()を呼び出し
  ↓
ユーザーの roles/permissions に基づいて asyncRoutes をフィルタリング
  ↓
router.addRoute()でフィルタリングされたルートを動的に注入
  ↓
同時にサイドバーメニューツリーを生成
  ↓
ナビゲーション続行
```

::: warning 注意
非同期ルートの変更は再ログインが必要です。ルート生成はログイン後の最初のナビゲーションで一度だけ実行されるためです。
:::

## 新しいページの追加

### 1. ビューコンポーネントの作成

`src/views/` 配下に対応するページコンポーネントを作成します：

```
src/views/my-module/index.vue
```

```vue
<script setup lang="ts">
// ページロジック
</script>

<template>
  <div>
    <!-- ページコンテンツ -->
  </div>
</template>
```

### 2. ルート設定の追加

`src/router/routes.ts` にルートを追加し、権限要件に応じて適切な階層に配置します：

```typescript
// asyncRoutes に追加
{
  path: '/my-module',
  meta: {
    title: 'menu.myModule',
    icon: 'AppstoreOutlined',
    requiredPermissions: ['my-module.view'],
  },
  component: () => import('@/views/my-module/index.vue'),
}
```

### 3. 国際化の追加

`src/locales/zh-CN.ts` と `en-US.ts` に対応するメニュー翻訳を追加します：

```typescript
// zh-CN.ts
menu: {
  myModule: '我的模块',
}

// en-US.ts
menu: {
  myModule: 'My Module',
}
```

ルートガードが動的ルート注入を自動的に処理するため、手動で `addRoute` を呼び出す必要はありません。
