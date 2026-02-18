# レイアウトシステム

このドキュメントでは、Antdv Next Admin のレイアウトシステムについて説明します。垂直/水平レイアウト、サイドバー設定、レスポンシブ対応などが含まれます。

## 目次

- [レイアウトの概要](#レイアウトの概要)
- [レイアウトモード](#レイアウトモード)
- [サイドバー設定](#サイドバー設定)
- [レスポンシブ対応](#レスポンシブ対応)
- [レイアウトコンポーネント](#レイアウトコンポーネント)
- [カスタムレイアウト](#カスタムレイアウト)

---

## レイアウトの概要

プロジェクトでは2つの主要なレイアウトモードを提供しています：

- **垂直レイアウト** - サイドバーが左側、コンテンツが右側（デフォルト）
- **水平レイアウト** - メニューが上部、コンテンツが下

---

## レイアウトモード

### 垂直レイアウト

```
+-----------------------------------+
|  Logo    |        Header          |
|----------+------------------------|
|          |                        |
| Sidebar  |       Content          |
|          |                        |
+----------+------------------------+
```

特徴：
- サイドバーの幅が固定（デフォルト 210px）
- 折りたたみに対応（collapsed）
- 管理システムに適している

### 水平レイアウト

```
+-----------------------------------+
|  Logo  |  Menu  |     Header      |
+--------+--------------------------+
|                                   |
|           Content                 |
|                                   |
+-----------------------------------+
```

特徴：
- メニューが上部に配置
- より現代的なデザイン
- ページ数が少ないシステムに適している

### レイアウトの切り替え

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// 切换布局模式
layoutStore.setLayoutMode('horizontal')  // 或 'vertical'
```

---

## サイドバー設定

### サイドバーテーマ

ライトテーマとダークテーマの2種類をサポート：

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// 设置侧边栏主题
themeStore.setSidebarTheme('dark')   // 深色
themeStore.setSidebarTheme('light')  // 浅色
```

### サイドバーの折りたたみ

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// 切换折叠状态
layoutStore.toggleSidebar()

// 直接设置
layoutStore.setSidebarCollapsed(true)
```

### 折りたたみアニメーション

サイドバーの折りたたみ時にスムーズなトランジションアニメーション：

```scss
.sidebar {
  width: 210px;
  transition: width 0.3s ease;
  
  &.collapsed {
    width: 80px;
  }
}
```

---

## レスポンシブ対応

### ブレークポイント設定

プロジェクトでは以下のレスポンシブブレークポイントを設定：

| ブレークポイント | 幅 | 説明 |
|------|------|------|
| xs | < 576px | 超小型画面（スマートフォン） |
| sm | >= 576px | 小型画面（大型スマートフォン） |
| md | >= 768px | 中型画面（タブレット） |
| lg | >= 992px | 大型画面（小型デスクトップ） |
| xl | >= 1200px | 超大型画面（デスクトップ） |
| xxl | >= 1600px | 超大型画面（大型デスクトップ） |

### モバイル対応

モバイルでは：

1. サイドバーがドロワー式（Drawer）に変更
2. タブバーが横スクロール可能に
3. テーブルが横スクロールをサポート

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// 检测是否为移动端
const isMobile = computed(() => layoutStore.isMobile)

// 打开侧边栏抽屉（移动端）
layoutStore.openSidebarDrawer()
```

### レスポンシブユーティリティ

コンポーネントでレスポンシブを使用：

```vue
<template>
  <div>
    <!-- 只在桌面端显示 -->
    <Sidebar v-if="!isMobile" />
    
    <!-- 移动端抽屉 -->
    <a-drawer v-else v-model:open="drawerVisible">
      <Sidebar />
    </a-drawer>
  </div>
</template>

<script setup>
import { useLayoutStore } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const layoutStore = useLayoutStore()
const { isMobile } = storeToRefs(layoutStore)
</script>
```

---

## レイアウトコンポーネント

### AdminLayout

メインレイアウトコンポーネント、`src/components/Layout/` に配置。

```vue
<template>
  <AdminLayout>
    <router-view />
  </AdminLayout>
</template>
```

### レイアウト構造

```
components/Layout/
├── AdminLayout.vue        # 布局主文件
├── Sidebar.vue            # 侧边栏
├── Header.vue             # 顶部栏
├── TabBar.vue             # 标签栏
├── Breadcrumb.vue         # 面包屑
└── SettingsDrawer.vue     # 偏好设置抽屉
```

### スロット

AdminLayout は以下のスロットを提供：

```vue
<AdminLayout>
  <!-- 默认插槽：页面内容 -->
  <router-view />
  
  <!-- 自定义头部 -->
  <template #header>
    <CustomHeader />
  </template>
  
  <!-- 自定义侧边栏底部 -->
  <template #sidebar-footer>
    <UserProfile />
  </template>
</AdminLayout>
```

---

## カスタムレイアウト

### 新しいレイアウトの作成

1. `src/components/Layout/` に新しいレイアウトファイルを作成

```
components/Layout/
└── CustomLayout.vue
```

2. レイアウトコンポーネントを作成

```vue
<!-- src/components/Layout/CustomLayout.vue -->
<template>
  <div class="custom-layout">
    <header>Custom Header</header>
    <main>
      <slot />
    </main>
    <footer>Custom Footer</footer>
  </div>
</template>
```

3. ルートで使用

```typescript
{
  path: '/custom-page',
  component: () => import('@/components/Layout/CustomLayout.vue'),
  children: [
    {
      path: '',
      component: () => import('@/views/custom-page/index.vue'),
    },
  ],
}
```

### ミックスレイアウト

異なるルートで異なるレイアウトを使用可能：

```typescript
// 后台管理布局
{
  path: '/admin',
  component: () => import('@/components/Layout/AdminLayout.vue'),
  children: [
    { path: 'dashboard', component: Dashboard },
    { path: 'users', component: Users },
  ],
}

// 登录页布局
{
  path: '/login',
  component: () => import('@/views/login/index.vue'),
}
```

---

## CSS 変数

レイアウト関連の CSS 変数：

```css
:root {
  /* 侧边栏 */
  --sidebar-width: 210px;
  --sidebar-collapsed-width: 80px;
  --sidebar-bg: #001529;
  
  /* 头部 */
  --header-height: 64px;
  --header-bg: #fff;
  
  /* 标签栏 */
  --tabs-height: 44px;
  
  /* 内容区 */
  --content-padding: 24px;
}
```

---

## ベストプラクティス

### 1. コンテンツエリアの最小高さ

コンテンツエリアが残りのスペースを確実に埋めるように：

```scss
.content {
  min-height: calc(100vh - var(--header-height) - var(--tabs-height));
}
```

### 2. ヘッダーの固定

ヘッダーを固定し、コンテンツをスクロール可能に：

```scss
.layout {
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
  
  .content {
    margin-top: var(--header-height);
    overflow-y: auto;
  }
}
```

### 3. モバイル最適化

モバイルではサイドバーを非表示にし、ドロワーを使用：

```vue
<template>
  <div class="layout">
    <!-- 桌面端：显示侧边栏 -->
    <Sidebar v-if="!isMobile" />
    
    <!-- 移动端：抽屉 -->
    <a-drawer
      v-else
      v-model:open="drawerVisible"
      placement="left"
      :closable="false"
    >
      <Sidebar />
    </a-drawer>
    
    <div class="content">
      <Header />
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>
```

---

## 次のステップ

- [マルチタブシステム](/guide/tabs) でタブ管理を学ぶ
- [実例と実践](/guide/examples) で完全なケースを確認
- [テーマシステム](/guide/theme) でテーマカスタマイズを確認
