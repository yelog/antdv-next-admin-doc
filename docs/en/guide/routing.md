# Routing System

## Overview

Antdv Next Admin uses Vue Router 4 with routes organized into three tiers by permission requirements. Router guards handle dynamic route injection and permission filtering.

## Route Categories

### Static Routes (staticRoutes)

Pages accessible without authentication:

```typescript
// Login, 404, 403, 500 error pages
const staticRoutes = [
  { path: '/login', component: Login },
  { path: '/404', component: NotFound },
  { path: '/403', component: Forbidden },
  { path: '/500', component: ServerError },
]
```

### Basic Routes (basicRoutes)

Pages that require authentication but no specific permissions:

```typescript
// Dashboard, profile, about, etc.
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

### Async Routes (asyncRoutes)

Pages requiring specific permissions, dynamically injected after login:

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

## Route Meta Fields

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Page title (i18n key) |
| `icon` | `string` | — | Menu icon component name |
| `requiresAuth` | `boolean` | `true` | Whether authentication is required |
| `requiredPermissions` | `string[]` | — | Required permission codes |
| `requiredRoles` | `string[]` | — | Required role codes |
| `hidden` | `boolean` | `false` | Hide from sidebar menu |
| `affix` | `boolean` | `false` | Pin tab (cannot be closed) |
| `order` | `number` | — | Menu sort order |
| `externalLink` | `string` | — | External link URL |

## Dynamic Route Generation Flow

```
User logs in
  ↓
Router guard (guards.ts) intercepts first navigation
  ↓
Calls permissionStore.generateRoutes()
  ↓
Filters asyncRoutes by user roles/permissions
  ↓
Injects filtered routes via router.addRoute()
  ↓
Builds sidebar menu tree simultaneously
  ↓
Navigation continues
```

::: warning Note
Changes to async routes require re-login to take effect, since route generation only runs once during the first post-login navigation.
:::

## Adding New Pages

### 1. Create the View Component

Create a page component under `src/views/`:

```
src/views/my-module/index.vue
```

```vue
<script setup lang="ts">
// Page logic
</script>

<template>
  <div>
    <!-- Page content -->
  </div>
</template>
```

### 2. Add Route Configuration

Add the route in `src/router/routes.ts` under the appropriate tier:

```typescript
// Add to asyncRoutes
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

### 3. Add i18n Keys

Add menu translations in `src/locales/zh-CN.ts` and `en-US.ts`:

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

Router guards handle dynamic route injection automatically — no need to manually call `addRoute`.
