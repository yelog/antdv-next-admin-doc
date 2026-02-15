# 라우팅 시스템

## 개요

Antdv Next Admin은 Vue Router 4를 사용하며, 라우팅 설정은 권한 요구사항에 따라 3개의 계층으로 분류되어 라우트 가드와 함께 동적 라우트 주입 및 권한 필터링을 구현합니다.

## 라우트 분류

### 정적 라우트(staticRoutes)

인증 없이 접근 가능한 페이지:

```typescript
// 로그인 페이지, 404, 403, 500 등의 오류 페이지
const staticRoutes = [
  { path: '/login', component: Login },
  { path: '/404', component: NotFound },
  { path: '/403', component: Forbidden },
  { path: '/500', component: ServerError },
]
```

### 기본 라우트(basicRoutes)

인증이 필요하지만 특정 권한은 불필요한 페이지:

```typescript
// 대시보드, 프로필, 소개 페이지 등
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

### 비동기 라우트(asyncRoutes)

특정 권한이 필요한 페이지로, 사용자 로그인 후 권한에 따라 동적으로 주입됩니다:

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

## 라우트 Meta 필드

| 필드 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `title` | `string` | — | 페이지 제목(i18n key) |
| `icon` | `string` | — | 메뉴 아이콘 컴포넌트명 |
| `requiresAuth` | `boolean` | `true` | 인증 필요 여부 |
| `requiredPermissions` | `string[]` | — | 필요한 권한 코드 |
| `requiredRoles` | `string[]` | — | 필요한 역할 코드 |
| `hidden` | `boolean` | `false` | 메뉴에서 숨김 여부 |
| `affix` | `boolean` | `false` | 탭 고정 여부(닫을 수 없음) |
| `order` | `number` | — | 메뉴 정렬 순서 |
| `externalLink` | `string` | — | 외부 링크 주소 |

## 동적 라우트 생성 흐름

```
사용자 로그인
  ↓
라우트 가드(guards.ts)가 첫 번째 네비게이션 가로채기
  ↓
permissionStore.generateRoutes() 호출
  ↓
사용자의 roles/permissions 기반으로 asyncRoutes 필터링
  ↓
router.addRoute()로 필터링된 라우트를 동적으로 주입
  ↓
동시에 사이드바 메뉴 트리 생성
  ↓
네비게이션 계속
```

::: warning 주의
비동기 라우트의 변경사항은 재로그인이 필요합니다. 라우트 생성은 로그인 후 첫 번째 네비게이션에서 한 번만 실행되기 때문입니다.
:::

## 새 페이지 추가

### 1. 뷰 컴포넌트 생성

`src/views/` 하위에 해당 페이지 컴포넌트를 생성합니다:

```
src/views/my-module/index.vue
```

```vue
<script setup lang="ts">
// 페이지 로직
</script>

<template>
  <div>
    <!-- 페이지 콘텐츠 -->
  </div>
</template>
```

### 2. 라우트 설정 추가

`src/router/routes.ts`에 라우트를 추가하고, 권한 요구사항에 따라 적절한 계층에 배치합니다:

```typescript
// asyncRoutes에 추가
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

### 3. 국제화 추가

`src/locales/zh-CN.ts`와 `en-US.ts`에 해당 메뉴 번역을 추가합니다:

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

라우트 가드가 동적 라우트 주입을 자동으로 처리하므로 수동으로 `addRoute`를 호출할 필요가 없습니다.
