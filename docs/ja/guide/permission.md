# 権限システム

## 概要

Antdv Next Admin は完全な RBAC（ロールベースアクセス制御）権限システムを実装し、ルートレベルからボタンレベルまでの細かい粒度の権限制御をサポートしています。

## 権限検証方式

システムは3つの同等な権限検証方式を提供し、シーンに応じて柔軟に選択できます：

### 1. ディレクティブ方式（v-permission）

テンプレート内でカスタムディレクティブを使用して要素の表示を制御します：

```vue
<!-- 単一権限：いずれか1つを持っていれば可（OR ロジック） -->
<a-button v-permission="'user.create'">新規ユーザー</a-button>

<!-- 複数権限：いずれか1つを持っていれば可（OR ロジック） -->
<a-button v-permission="['user.edit', 'user.delete']">操作</a-button>

<!-- すべての権限：すべて持っている必要がある（AND ロジック） -->
<a-button v-permission.all="['user.edit', 'user.approve']">承認</a-button>
```

::: tip 説明
`v-permission` はデフォルトで **OR** ロジックを使用し、配列を渡す場合は1つの権限を満たせば十分です。`.all` 修飾子を使用して **AND** ロジックに切り替えます。
:::

### 2. コンポジション関数（usePermission）

`<script setup>` 内でコンポジション関数を使用してプログラマティックな権限検証を行います：

```vue
<script setup lang="ts">
import { usePermission } from '@/composables/usePermission'

const { can, canAll, hasRole } = usePermission()

// 単一権限のチェック
if (can('user.create')) {
  // 権限がある場合のロジック
}

// 複数権限のチェック（すべて満たす必要がある）
if (canAll(['user.edit', 'user.approve'])) {
  // 両方の権限を持っている
}

// ロールのチェック
if (hasRole('admin')) {
  // 管理者ロジック
}
</script>
```

### 3. コンポーネント方式（PermissionButton）

権限ボタンコンポーネントを使用して権限制御が必要なコンテンツをラップします：

```vue
<template>
  <PermissionButton permission="user.create">
    <a-button type="primary">新規ユーザー</a-button>
  </PermissionButton>
</template>
```

## ルートレベル権限

ルート `meta` フィールドを通じてページレベルの権限を設定します：

```typescript
{
  path: '/organization/user',
  meta: {
    title: 'menu.user',
    // 以下の権限のいずれか1つが必要
    requiredPermissions: ['system.user.view'],
    // または特定のロールを要求
    requiredRoles: ['admin'],
  },
}
```

ルートレベル権限は `permissionStore.generateRoutes()` でフィルタリングされ、権限を満たさないルートは注入されません。

## 権限データのソース

権限データはユーザーログイン後に取得されるユーザー情報から取得されます：

```typescript
// authStore の権限データ
const roles = ref<string[]>([])        // ユーザーロールリスト、例：['admin']
const permissions = ref<string[]>([])  // ユーザー権限リスト、例：['system.user.view', 'system.user.create']
```

Mock モードでは：
- **admin** アカウントはすべての権限を持っています
- **user** アカウントは限定された権限を持っています

## 権限命名規則

権限コードはドット区切りの階層命名を採用しています：

```
モジュール.リソース.操作
```

例：
- `system.user.view` — ユーザー表示
- `system.user.create` — ユーザー作成
- `system.user.edit` — ユーザー編集
- `system.user.delete` — ユーザー削除
- `system.role.view` — ロール表示
