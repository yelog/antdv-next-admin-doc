# マルチタブシステム

このドキュメントでは、Antdv Next Admin のマルチタブシステムについて詳しく説明します。KeepAlive キャッシュ、タブバー操作、右クリックメニューなどの機能が含まれます。

## 目次

- [タブの概要](#タブの概要)
- [基本設定](#基本設定)
- [KeepAlive キャッシュ](#keepalive-キャッシュ)
- [タブバー操作](#タブバー操作)
- [右クリックメニュー](#右クリックメニュー)
- [固定タブ](#固定タブ)
- [プログラム的な操作](#プログラム的な操作)

---

## タブの概要

マルチタブシステムは、管理システムのコア・インタラクションモードであり、ユーザーが複数のページを同時に開いて素早く切り替えることができます。

### 特徴

- ✅ **KeepAlive キャッシュ** - ページ切り替え時に状態を保持
- ✅ **右クリックメニュー** - 更新、閉じる、他を閉じる、すべて閉じる
- ✅ **固定タブ** - 重要なページをタブバーに常駐
- ✅ **ドラッグ並べ替え** - タブのドラッグで順序を調整
- ✅ **キャッシュ制御** - きめ細かいページキャッシュ管理

---

## 基本設定

### ルート設定

ルートの `meta` でタブ関連のプロパティを設定します：

```typescript
{
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    title: '仪表盘',
    keepAlive: true,    // 启用缓存
    affix: true,        // 固定标签（不可关闭）
  },
}
```

### 設定項目の説明

| プロパティ | 型 | デフォルト | 説明 |
|------|------|--------|------|
| keepAlive | boolean | false | ページをキャッシュするか |
| affix | boolean | false | 固定するか（閉じられない） |
| title | string | - | タブの表示タイトル |

---

## KeepAlive キャッシュ

### 原理

Vue の `<KeepAlive>` コンポーネントは、動的コンポーネントの状態をキャッシュし、再レンダリングを回避します。

### キャッシュの設定

`src/layouts/AdminLayout/index.vue` で：

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedViews">
      <component :is="Component" :key="route.path" />
    </keep-alive>
  </router-view>
</template>
```

### Tabs Store を使用したキャッシュ管理

```typescript
import { useTabsStore } from '@/stores/tabs'

const tabsStore = useTabsStore()

// 添加缓存页面
tabsStore.addCachedView('Dashboard')

// 移除缓存
tabsStore.removeCachedView('Dashboard')

// 清空缓存
tabsStore.clearCachedViews()
```

### ページの更新（キャッシュをクリアして再読み込み）

```typescript
// 刷新当前页面
tabsStore.refreshTab(route.path)

// 实现原理：
// 1. 从 cachedViews 中移除
// 2. nextTick 后重新添加
// 3. 触发重新渲染
```

---

## タブバー操作

### タブバーコンポーネント

タブバーは通常、レイアウトの上部に配置され、開いているすべてのタブを表示します。

```vue
<template>
  <div class="tabs-bar">
    <a-tag
      v-for="tab in tabsStore.tabList"
      :key="tab.path"
      :class="{ active: tab.path === activePath }"
      :closable="!tab.affix"
      @click="handleClick(tab)"
      @close="handleClose(tab)"
      @contextmenu.prevent="showContextMenu($event, tab)"
    >
      {{ tab.title }}
    </a-tag>
  </div>
</template>

<script setup>
import { useTabsStore } from '@/stores/tabs'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

const activePath = computed(() => route.path)

// 点击标签切换
const handleClick = (tab) => {
  router.push(tab.path)
}

// 关闭标签
const handleClose = (tab) => {
  tabsStore.closeTab(tab.path)
  // 如果关闭的是当前标签，需要路由到上一个标签
  if (tab.path === route.path) {
    const lastTab = tabsStore.tabList[tabsStore.tabList.length - 1]
    router.push(lastTab?.path || '/')
  }
}
</script>
```

---

## 右クリックメニュー

### 右クリックメニューの表示

```vue
<template>
  <div>
    <!-- 标签栏 -->
    <div class="tabs-bar">
      <a-tag
        v-for="tab in tabsStore.tabList"
        :key="tab.path"
        @contextmenu.prevent="showContextMenu($event, tab)"
      >
        {{ tab.title }}
      </a-tag>
    </div>
    
    <!-- 右键菜单 -->
    <ul
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{
        left: contextMenu.x + 'px',
        top: contextMenu.y + 'px',
      }"
    >
      <li @click="handleRefresh">刷新</li>
      <li @click="handleCloseCurrent">关闭</li>
      <li @click="handleCloseOthers">关闭其他</li>
      <li @click="handleCloseAll">关闭全部</li>
    </ul>
  </div>
</template>

<script setup>
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  targetTab: null,
})

const showContextMenu = (e, tab) => {
  contextMenu.visible = true
  contextMenu.x = e.clientX
  contextMenu.y = e.clientY
  contextMenu.targetTab = tab
}

// 关闭菜单
onClickOutside(refContextMenu, () => {
  contextMenu.visible = false
})

// 菜单操作
const handleRefresh = () => {
  tabsStore.refreshTab(contextMenu.targetTab.path)
  contextMenu.visible = false
}

const handleCloseCurrent = () => {
  tabsStore.closeTab(contextMenu.targetTab.path)
  contextMenu.visible = false
}

const handleCloseOthers = () => {
  tabsStore.closeOthers(contextMenu.targetTab.path)
  contextMenu.visible = false
}

const handleCloseAll = () => {
  tabsStore.closeAll()
  router.push('/')
  contextMenu.visible = false
}
</script>
```

---

## 固定タブ

固定タブ（Affix）は閉じることができないタブで、通常はホームページやダッシュボードなどの重要なページに使用されます。

### 固定タブの設定

```typescript
{
  path: '/dashboard',
  name: 'Dashboard',
  meta: {
    title: '仪表盘',
    affix: true,  // 固定标签
  },
}
```

### 表示効果

- 固定タブは最も左側に表示
- 閉じるボタンがない
- ページ更新後も存在し続ける

---

## プログラム的な操作

### Tabs Store API

```typescript
import { useTabsStore } from '@/stores/tabs'

const tabsStore = useTabsStore()

// 添加标签
tabsStore.addTab({
  path: '/user/detail/123',
  title: '用户详情 - 张三',
  name: 'UserDetail',
  keepAlive: true,
  affix: false,
})

// 关闭指定标签
tabsStore.closeTab('/user/detail/123')

// 关闭其他标签（保留当前）
tabsStore.closeOthers('/user/detail/123')

// 关闭所有标签（保留固定标签）
tabsStore.closeAll()

// 刷新标签
tabsStore.refreshTab('/user/detail/123')

// 设置激活标签
tabsStore.setActiveTab('/user/detail/123')
```

### ルート監視による自動タブ追加

```typescript
// 在布局组件中
watch(
  () => route.path,
  () => {
    if (route.meta.title) {
      tabsStore.addTab({
        path: route.path,
        title: route.meta.title,
        name: route.name,
        keepAlive: route.meta.keepAlive,
        affix: route.meta.affix,
      })
    }
  },
  { immediate: true }
)
```

---

## ベストプラクティス

### 1. KeepAlive の適切な使用

すべてのページでキャッシュが必要なわけではありません：

```typescript
// ✅ 需要缓存：数据不常变的列表页
{
  path: '/user/list',
  meta: { keepAlive: true },
}

// ✅ 需要缓存：表单填写中切换页面
{
  path: '/user/create',
  meta: { keepAlive: true },
}

// ❌ 不需要缓存：详情页（数据经常变）
{
  path: '/user/detail/:id',
  meta: { keepAlive: false },
}
```

### 2. メモリ管理

不要なキャッシュを定期的にクリア：

```typescript
// 设置最大缓存数量
const MAX_CACHE_SIZE = 10

watch(
  () => tabsStore.cachedViews.length,
  (length) => {
    if (length > MAX_CACHE_SIZE) {
      // 移除最早的缓存
      const oldest = tabsStore.cachedViews[0]
      tabsStore.removeCachedView(oldest)
    }
  }
)
```

### 3. 更新後の復元

ページ更新後のタブ状態の復元：

```typescript
// 在 layout 的 onMounted 中
onMounted(() => {
  // 从 localStorage 恢复标签
  const savedTabs = localStorage.getItem('tabs')
  if (savedTabs) {
    const tabs = JSON.parse(savedTabs)
    tabs.forEach(tab => tabsStore.addTab(tab))
  }
})

// 监听变化保存
watch(
  () => tabsStore.tabList,
  (tabs) => {
    localStorage.setItem('tabs', JSON.stringify(tabs))
  },
  { deep: true }
)
```

---

## 次のステップ

- [レイアウトシステム](/guide/layout) でページレイアウト設定を学ぶ
- [実例と実践](/guide/examples) で完全なケースを確認
- [状態管理](/guide/state-management) で Tabs Store の原理を理解
