# 路由系统

## 概述

Antdv Next Admin 采用 Vue Router 4，路由配置按权限需求分为三个层级，配合路由守卫实现动态路由注入和权限过滤。

## 路由分类

### 静态路由（staticRoutes）

无需认证即可访问的页面：

```typescript
// 登录页、404、403、500 等错误页
const staticRoutes = [
  { path: '/login', component: Login },
  { path: '/404', component: NotFound },
  { path: '/403', component: Forbidden },
  { path: '/500', component: ServerError },
]
```

### 基础路由（basicRoutes）

需要认证但无需特定权限的页面：

```typescript
// 仪表盘、个人中心、关于页等
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

### 异步路由（asyncRoutes）

需要特定权限的页面，在用户登录后根据权限动态注入：

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

## 路由 Meta 字段

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 页面标题（i18n key） |
| `icon` | `string` | — | 菜单图标组件名 |
| `requiresAuth` | `boolean` | `true` | 是否需要认证 |
| `requiredPermissions` | `string[]` | — | 所需权限码 |
| `requiredRoles` | `string[]` | — | 所需角色码 |
| `hidden` | `boolean` | `false` | 是否在菜单中隐藏 |
| `affix` | `boolean` | `false` | 是否固定标签页（不可关闭） |
| `order` | `number` | — | 菜单排序 |
| `externalLink` | `string` | — | 外部链接地址 |

## 动态路由生成流程

```
用户登录
  ↓
路由守卫（guards.ts）拦截首次导航
  ↓
调用 permissionStore.generateRoutes()
  ↓
根据用户的 roles/permissions 过滤 asyncRoutes
  ↓
通过 router.addRoute() 动态注入过滤后的路由
  ↓
同时生成侧边栏菜单树
  ↓
导航继续
```

::: warning 注意
异步路由的变更需要重新登录才能生效，因为路由生成只在首次登录后的导航中执行一次。
:::

## 添加新页面

### 1. 创建视图组件

在 `src/views/` 下创建对应的页面组件：

```
src/views/my-module/index.vue
```

```vue
<script setup lang="ts">
// 页面逻辑
</script>

<template>
  <div>
    <!-- 页面内容 -->
  </div>
</template>
```

### 2. 添加路由配置

在 `src/router/routes.ts` 中添加路由，根据权限需求选择放入不同层级：

```typescript
// 添加到 asyncRoutes 中
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

### 3. 添加国际化

在 `src/locales/zh-CN.ts` 和 `en-US.ts` 中添加对应的菜单翻译：

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

路由守卫会自动处理动态路由注入，无需手动调用 `addRoute`。
