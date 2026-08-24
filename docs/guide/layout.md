# 布局系统

本文档介绍 Antdv Next Admin 的布局系统，包括垂直/水平布局、侧边栏配置、响应式适配等。

## 目录

- [布局概述](#布局概述)
- [布局模式](#布局模式)
- [侧边栏配置](#侧边栏配置)
- [响应式适配](#响应式适配)
- [布局组件](#布局组件)
- [头部交互能力](#头部交互能力)
- [自定义布局](#自定义布局)

---

## 布局概述

项目提供两种主要布局模式：

- **垂直布局** - 侧边栏在左侧，内容在右侧（默认）
- **水平布局** - 菜单在顶部，内容在下

---

## 布局模式

### 垂直布局

```
+-----------------------------------+
|  Logo    |        Header          |
|----------+------------------------|
|          |                        |
| Sidebar  |       Content          |
|          |                        |
+----------+------------------------+
```

特点：
- 侧边栏宽度固定（默认 210px）
- 支持折叠（collapsed）
- 适合后台管理系统

### 水平布局

```
+-----------------------------------+
|  Logo  |  Menu  |     Header      |
+--------+--------------------------+
|                                   |
|           Content                 |
|                                   |
+-----------------------------------+
```

特点：
- 菜单在顶部
- 更现代的设计
- 适合页面较少的系统

### 切换布局

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// 切换布局模式
layoutStore.setLayoutMode('horizontal')  // 或 'vertical'
```

---

## 侧边栏配置

### 侧边栏主题

支持浅色和深色两种主题：

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// 设置侧边栏主题
themeStore.setSidebarTheme('dark')   // 深色
themeStore.setSidebarTheme('light')  // 浅色
```

### 侧边栏折叠

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// 切换折叠状态
layoutStore.toggleSidebar()

// 直接设置
layoutStore.setSidebarCollapsed(true)
```

### 折叠动画

侧边栏折叠时有平滑的过渡动画：

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

## 响应式适配

### 断点配置

项目预设了以下响应式断点：

| 断点 | 宽度 | 说明 |
|------|------|------|
| xs | < 576px | 超小屏幕（手机） |
| sm | >= 576px | 小屏幕（大手机） |
| md | >= 768px | 中等屏幕（平板） |
| lg | >= 992px | 大屏幕（小桌面） |
| xl | >= 1200px | 超大屏幕（桌面） |
| xxl | >= 1600px | 超大屏幕（大桌面） |

### 移动端适配

在移动端下：

1. 侧边栏变为抽屉式（Drawer）
2. 标签栏可以横向滚动
3. 表格支持横向滚动

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// 检测是否为移动端
const isMobile = computed(() => layoutStore.isMobile)

// 打开侧边栏抽屉（移动端）
layoutStore.openSidebarDrawer()
```

### 响应式工具

在组件中使用响应式：

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

## 布局组件

### AdminLayout

主要布局组件，位于 `src/components/Layout/`。

```vue
<template>
  <AdminLayout>
    <router-view />
  </AdminLayout>
</template>
```

### 布局结构

```
components/Layout/
├── AdminLayout.vue        # 布局主文件
├── Sidebar.vue            # 侧边栏
├── Header.vue             # 顶部栏
├── TabBar.vue             # 标签栏
├── Breadcrumb.vue         # 面包屑
└── SettingsDrawer.vue     # 偏好设置抽屉
```

### 插槽

AdminLayout 提供以下插槽：

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

## 头部交互能力

Header 不只是导航条，还承担了全局操作入口。核心实现位于：

- `src/components/Layout/Header.vue`
- `src/components/Layout/GlobalSearch.vue`
- `src/components/Layout/NotificationPanel.vue`
- `src/components/Layout/AICollabPanel.vue`

### 1. 全局搜索（Global Search）

- 点击头部搜索入口可打开搜索面板。
- 支持快捷键 `Ctrl + K`（Windows/Linux）和 `⌘ + K`（macOS）。
- 建议将搜索结果按「菜单/页面/最近访问」分组展示，降低定位成本。

### 2. 通知面板（Notification Panel）

- 头部通知按钮展示未读状态。
- 支持标记全部已读、清空、单条删除、跳转通知详情页。
- 通知数据由 `notification store` 管理，适合接入业务消息中心。

### 3. AI 协作入口（AI Collab）

- 当 `layoutStore.aiEntryVisible` 为 `true` 时显示 AI 开关。
- 支持面板开关与快捷提示词操作，适合页面内解释、总结、风险提示等场景。
- 建议在生产场景接入真实后端推理服务，替换示例回复逻辑。

### 4. 移动端降级策略

- 移动端头部操作收敛到 `More` 下拉菜单。
- 需保留核心能力：全屏、主题、设置、AI 开关（可选）、语言切换（可通过设置抽屉关闭）。
- 全局搜索仍建议保留独立入口，避免深层菜单操作成本。

---

## 自定义布局

### 创建新布局

1. 在 `src/components/Layout/` 创建新布局文件

```
components/Layout/
└── CustomLayout.vue
```

2. 编写布局组件

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

3. 在路由中使用

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

### 混合布局

可以在不同路由使用不同布局：

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

## CSS 变量

布局相关的 CSS 变量：

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

## 最佳实践

### 1. 内容区域最小高度

确保内容区域占满剩余空间：

```scss
.content {
  min-height: calc(100vh - var(--header-height) - var(--tabs-height));
}
```

### 2. 固定头部

头部固定，内容可滚动：

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

### 3. 移动端优化

移动端隐藏侧边栏，使用抽屉：

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

## 下一步

- 查看 [多标签页系统](/guide/tabs) 学习标签页管理
- 阅读 [示例与实战](/guide/examples) 了解完整案例
- 查看 [主题系统](/guide/theme) 了解主题定制
