# 多标签页系统

本文档详细介绍 Antdv Next Admin 的多标签页系统，包括 KeepAlive 缓存、标签栏操作、右键菜单等功能。

## 目录

- [标签页概述](#标签页概述)
- [基础配置](#基础配置)
- [KeepAlive 缓存](#keepalive-缓存)
- [标签栏操作](#标签栏操作)
- [右键菜单](#右键菜单)
- [固定标签](#固定标签)
- [编程式操作](#编程式操作)

---

## 标签页概述

多标签页系统是后台管理系统的核心交互模式，允许用户同时打开多个页面并在它们之间快速切换。

### 特性

- ✅ **KeepAlive 缓存** - 页面切换时保持状态
- ✅ **右键菜单** - 刷新、关闭、关闭其他、关闭全部
- ✅ **固定标签** - 重要页面常驻标签栏
- ✅ **拖拽排序** - 支持标签拖拽调整顺序
- ✅ **缓存控制** - 细粒度的页面缓存管理

---

## 基础配置

### 路由配置

在路由的 `meta` 中配置标签页相关属性：

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

### 配置项说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| keepAlive | boolean | false | 是否缓存页面 |
| affix | boolean | false | 是否固定（不可关闭） |
| title | string | - | 标签显示标题 |

---

## KeepAlive 缓存

### 原理

Vue 的 `<KeepAlive>` 组件会缓存动态组件的状态，避免重复渲染。

### 配置缓存

在 `src/layouts/AdminLayout/index.vue` 中：

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedViews">
      <component :is="Component" :key="route.path" />
    </keep-alive>
  </router-view>
</template>
```

### 使用 Tabs Store 管理缓存

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

### 刷新页面（清除缓存并重新加载）

```typescript
// 刷新当前页面
tabsStore.refreshTab(route.path)

// 实现原理：
// 1. 从 cachedViews 中移除
// 2. nextTick 后重新添加
// 3. 触发重新渲染
```

---

## 标签栏操作

### 标签栏组件

标签栏通常放在布局的顶部，显示所有打开的标签。

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

## 右键菜单

### 显示右键菜单

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

## 固定标签

固定标签（Affix）是无法被关闭的标签，通常用于首页、仪表盘等重要页面。

### 配置固定标签

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

### 显示效果

- 固定标签显示在最左侧
- 没有关闭按钮
- 页面刷新后仍然存在

---

## 编程式操作

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

### 监听路由自动添加标签

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

## 最佳实践

### 1. 合理使用 KeepAlive

不是所有页面都需要缓存：

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

### 2. 内存管理

定期清理不用的缓存：

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

### 3. 刷新后恢复

页面刷新后恢复标签状态：

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

## 下一步

- 了解 [布局系统](/guide/layout) 学习页面布局配置
- 查看 [示例与实战](/guide/examples) 了解完整案例
- 阅读 [状态管理](/guide/state-management) 掌握 Tabs Store 原理
