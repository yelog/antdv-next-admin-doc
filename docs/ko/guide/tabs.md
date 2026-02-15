# 다중 탭 시스템

이 문서는 Antdv Next Admin의 다중 탭 시스템에 대해 자세히 설명합니다. KeepAlive 캐시, 탭 바 조작, 컨텍스트 메뉴 등의 기능이 포함됩니다.

## 목차

- [탭 개요](#탭-개요)
- [기본 설정](#기본-설정)
- [KeepAlive 캐시](#keepalive-캐시)
- [탭 바 조작](#탭-바-조작)
- [컨텍스트 메뉴](#컨텍스트-메뉴)
- [고정 탭](#고정-탭)
- [프로그래밍 방식 조작](#프로그래밍-방식-조작)

---

## 탭 개요

다중 탭 시스템은 백엔드 관리 시스템의 핵심 상호작용 모드로, 사용자가 여러 페이지를 동시에 열고 빠르게 전환할 수 있습니다.

### 특징

- ✅ **KeepAlive 캐시** - 페이지 전환 시 상태 유지
- ✅ **컨텍스트 메뉴** - 새로고침, 닫기, 다른 탭 닫기, 모두 닫기
- ✅ **고정 탭** - 중요한 페이지를 탭 바에 상주
- ✅ **드래그 정렬** - 탭 드래그로 순서 조정
- ✅ **캐시 제어** - 세밀한 페이지 캐시 관리

---

## 기본 설정

### 라우트 설정

라우트의 `meta`에서 탭 관련 속성을 설정합니다:

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

### 설정 항목 설명

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| keepAlive | boolean | false | 페이지 캐시 여부 |
| affix | boolean | false | 고정 여부(닫을 수 없음) |
| title | string | - | 탭 표시 제목 |

---

## KeepAlive 캐시

### 원리

Vue의 `<KeepAlive>` 컴포넌트는 동적 컴포넌트의 상태를 캐시하여 재렌더링을 방지합니다.

### 캐시 설정

`src/layouts/AdminLayout/index.vue`에서:

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedViews">
      <component :is="Component" :key="route.path" />
    </keep-alive>
  </router-view>
</template>
```

### Tabs Store를 사용한 캐시 관리

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

### 페이지 새로고침(캐시 제거 및 다시 로드)

```typescript
// 刷新当前页面
tabsStore.refreshTab(route.path)

// 实现原理：
// 1. 从 cachedViews 中移除
// 2. nextTick 后重新添加
// 3. 触发重新渲染
```

---

## 탭 바 조작

### 탭 바 컴포넌트

탭 바는 일반적으로 레이아웃 상단에 배치되어 열린 모든 탭을 표시합니다.

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

## 컨텍스트 메뉴

### 컨텍스트 메뉴 표시

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

## 고정 탭

고정 탭(Affix)은 닫을 수 없는 탭으로, 일반적으로 홈페이지, 대시보드 등 중요한 페이지에 사용됩니다.

### 고정 탭 설정

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

### 표시 효과

- 고정 탭은 가장 왼쪽에 표시
- 닫기 버튼 없음
- 페이지 새로고침 후에도 유지

---

## 프로그래밍 방식 조작

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

### 라우트 감시로 자동 탭 추가

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

## 모범 사례

### 1. KeepAlive의 적절한 사용

모든 페이지에 캐시가 필요한 것은 아닙니다:

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

### 2. 메모리 관리

불필요한 캐시를 정기적으로 정리:

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

### 3. 새로고침 후 복원

페이지 새로고침 후 탭 상태 복원:

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

## 다음 단계

- [레이아웃 시스템](/guide/layout)에서 페이지 레이아웃 설정 학습
- [예제 및 실전](/guide/examples)에서 완전한 사례 확인
- [상태 관리](/guide/state-management)에서 Tabs Store 원리 이해
