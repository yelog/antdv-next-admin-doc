# 레이아웃 시스템

이 문서는 Antdv Next Admin의 레이아웃 시스템을 소개합니다. 수직/수평 레이아웃, 사이드바 설정, 반응형 대응 등이 포함됩니다.

## 목차

- [레이아웃 개요](#레이아웃-개요)
- [레이아웃 모드](#레이아웃-모드)
- [사이드바 설정](#사이드바-설정)
- [반응형 대응](#반응형-대응)
- [레이아웃 컴포넌트](#레이아웃-컴포넌트)
- [커스텀 레이아웃](#커스텀-레이아웃)

---

## 레이아웃 개요

프로젝트는 두 가지 주요 레이아웃 모드를 제공합니다:

- **수직 레이아웃** - 사이드바가 왼쪽, 콘텐츠가 오른쪽(기본값)
- **수평 레이아웃** - 메뉴가 상단, 콘텐츠가 하단

---

## 레이아웃 모드

### 수직 레이아웃

```
+-----------------------------------+
|  Logo    |        Header          |
|----------+------------------------|
|          |                        |
| Sidebar  |       Content          |
|          |                        |
+----------+------------------------+
```

특징:
- 사이드바 너비 고정(기본값 210px)
- 접기 지원(collapsed)
- 백엔드 관리 시스템에 적합

### 수평 레이아웃

```
+-----------------------------------+
|  Logo  |  Menu  |     Header      |
+--------+--------------------------+
|                                   |
|           Content                 |
|                                   |
+-----------------------------------+
```

특징:
- 메뉴가 상단에 배치
- 더 현대적인 디자인
- 페이지가 적은 시스템에 적합

### 레이아웃 전환

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// 切换布局模式
layoutStore.setLayoutMode('horizontal')  // 或 'vertical'
```

---

## 사이드바 설정

### 사이드바 테마

라이트 테마와 다크 테마 2가지 지원:

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// 设置侧边栏主题
themeStore.setSidebarTheme('dark')   // 深色
themeStore.setSidebarTheme('light')  // 浅色
```

### 사이드바 접기

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// 切换折叠状态
layoutStore.toggleSidebar()

// 直接设置
layoutStore.setSidebarCollapsed(true)
```

### 접기 애니메이션

사이드바 접기 시 부드러운 전환 애니메이션:

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

## 반응형 대응

### 브레이크포인트 설정

프로젝트는 다음 반응형 브레이크포인트를 사전 설정:

| 브레이크포인트 | 너비 | 설명 |
|------|------|------|
| xs | < 576px | 초소형 화면(스마트폰) |
| sm | >= 576px | 소형 화면(대형 스마트폰) |
| md | >= 768px | 중형 화면(태블릿) |
| lg | >= 992px | 대형 화면(소형 데스크톱) |
| xl | >= 1200px | 초대형 화면(데스크톱) |
| xxl | >= 1600px | 초대형 화면(대형 데스크톱) |

### 모바일 대응

모바일에서:

1. 사이드바가 드로어 방식(Drawer)으로 변경
2. 탭 바가 가로 스크롤 가능
3. 테이블이 가로 스크롤 지원

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// 检测是否为移动端
const isMobile = computed(() => layoutStore.isMobile)

// 打开侧边栏抽屉（移动端）
layoutStore.openSidebarDrawer()
```

### 반응형 유틸리티

컴포넌트에서 반응형 사용:

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

## 레이아웃 컴포넌트

### AdminLayout

메인 레이아웃 컴포넌트, `src/components/Layout/`에 위치.

```vue
<template>
  <AdminLayout>
    <router-view />
  </AdminLayout>
</template>
```

### 레이아웃 구조

```
components/Layout/
├── AdminLayout.vue        # 布局主文件
├── Sidebar.vue            # 侧边栏
├── Header.vue             # 顶部栏
├── TabBar.vue             # 标签栏
├── Breadcrumb.vue         # 面包屑
└── SettingsDrawer.vue     # 偏好设置抽屉
```

### 슬롯

AdminLayout은 다음 슬롯을 제공:

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

## 커스텀 레이아웃

### 새 레이아웃 생성

1. `src/components/Layout/`에 새 레이아웃 파일 생성

```
components/Layout/
└── CustomLayout.vue
```

2. 레이아웃 컴포넌트 작성

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

3. 라우트에서 사용

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

### 혼합 레이아웃

다른 라우트에서 다른 레이아웃 사용 가능:

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

## CSS 변수

레이아웃 관련 CSS 변수:

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

## 모범 사례

### 1. 콘텐츠 영역 최소 높이

콘텐츠 영역이 남은 공간을 확실히 채우도록:

```scss
.content {
  min-height: calc(100vh - var(--header-height) - var(--tabs-height));
}
```

### 2. 헤더 고정

헤더를 고정하고 콘텐츠는 스크롤 가능하게:

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

### 3. 모바일 최적화

모바일에서는 사이드바를 숨기고 드로어 사용:

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

## 다음 단계

- [다중 탭 시스템](/guide/tabs)에서 탭 관리 학습
- [예제 및 실전](/guide/examples)에서 완전한 사례 확인
- [테마 시스템](/guide/theme)에서 테마 커스터마이징 확인
