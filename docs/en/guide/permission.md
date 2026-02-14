# Permission System

## Overview

Antdv Next Admin implements a complete RBAC (Role-Based Access Control) permission system supporting fine-grained access control from route-level down to button-level.

## Permission Check Methods

Three equivalent approaches are available — choose based on your scenario:

### 1. Directive (v-permission)

Use the custom directive to control element visibility in templates:

```vue
<!-- Single permission (OR logic) -->
<a-button v-permission="'user.create'">Create User</a-button>

<!-- Multiple permissions: any one is sufficient (OR logic) -->
<a-button v-permission="['user.edit', 'user.delete']">Actions</a-button>

<!-- All permissions: all must be present (AND logic) -->
<a-button v-permission.all="['user.edit', 'user.approve']">Approve</a-button>
```

::: tip
`v-permission` uses **OR** logic by default — when given an array, only one permission needs to match. Use the `.all` modifier to switch to **AND** logic.
:::

### 2. Composable (usePermission)

Use the composable for programmatic permission checks in `<script setup>`:

```vue
<script setup lang="ts">
import { usePermission } from '@/composables/usePermission'

const { can, canAll, hasRole } = usePermission()

// Check a single permission
if (can('user.create')) {
  // Logic when permitted
}

// Check multiple permissions (all required)
if (canAll(['user.edit', 'user.approve'])) {
  // Both permissions present
}

// Check role
if (hasRole('admin')) {
  // Admin-specific logic
}
</script>
```

### 3. Component (PermissionButton)

Wrap elements with the permission button component:

```vue
<template>
  <PermissionButton permission="user.create">
    <a-button type="primary">Create User</a-button>
  </PermissionButton>
</template>
```

## Route-Level Permissions

Configure page-level permissions via route `meta` fields:

```typescript
{
  path: '/organization/user',
  meta: {
    title: 'menu.user',
    // Require any of these permissions
    requiredPermissions: ['system.user.view'],
    // Or require specific roles
    requiredRoles: ['admin'],
  },
}
```

Route-level permissions are filtered in `permissionStore.generateRoutes()`. Routes that don't satisfy permissions are not injected.

## Permission Data Source

Permission data comes from user info obtained after login:

```typescript
// Permission data in authStore
const roles = ref<string[]>([])        // User roles, e.g. ['admin']
const permissions = ref<string[]>([])  // User permissions, e.g. ['system.user.view', 'system.user.create']
```

In mock mode:
- **admin** account has full permissions
- **user** account has limited permissions

## Permission Naming Convention

Permission codes use a dot-separated hierarchy:

```
module.resource.action
```

Examples:
- `system.user.view` — View users
- `system.user.create` — Create users
- `system.user.edit` — Edit users
- `system.user.delete` — Delete users
- `system.role.view` — View roles
