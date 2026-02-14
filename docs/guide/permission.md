# 权限系统

## 概述

Antdv Next Admin 实现了完整的 RBAC（基于角色的访问控制）权限系统，支持从路由级到按钮级的细粒度权限控制。

## 权限校验方式

系统提供三种等效的权限校验方式，可根据场景灵活选择：

### 1. 指令方式（v-permission）

在模板中使用自定义指令控制元素的显示：

```vue
<!-- 单个权限：拥有其中一个即可（OR 逻辑） -->
<a-button v-permission="'user.create'">新增用户</a-button>

<!-- 多个权限：拥有其中一个即可（OR 逻辑） -->
<a-button v-permission="['user.edit', 'user.delete']">操作</a-button>

<!-- 所有权限：必须全部拥有（AND 逻辑） -->
<a-button v-permission.all="['user.edit', 'user.approve']">审批</a-button>
```

::: tip 说明
`v-permission` 默认使用 **OR** 逻辑，传入数组时只需满足一个权限即可。使用 `.all` 修饰符切换为 **AND** 逻辑。
:::

### 2. 组合式函数（usePermission）

在 `<script setup>` 中使用组合式函数进行编程式权限校验：

```vue
<script setup lang="ts">
import { usePermission } from '@/composables/usePermission'

const { can, canAll, hasRole } = usePermission()

// 检查单个权限
if (can('user.create')) {
  // 有权限时的逻辑
}

// 检查多个权限（全部满足）
if (canAll(['user.edit', 'user.approve'])) {
  // 同时拥有两个权限
}

// 检查角色
if (hasRole('admin')) {
  // 管理员逻辑
}
</script>
```

### 3. 组件方式（PermissionButton）

使用权限按钮组件包裹需要权限控制的内容：

```vue
<template>
  <PermissionButton permission="user.create">
    <a-button type="primary">新增用户</a-button>
  </PermissionButton>
</template>
```

## 路由级权限

通过路由 `meta` 字段配置页面级权限：

```typescript
{
  path: '/organization/user',
  meta: {
    title: 'menu.user',
    // 需要以下权限之一
    requiredPermissions: ['system.user.view'],
    // 或要求特定角色
    requiredRoles: ['admin'],
  },
}
```

路由级权限在 `permissionStore.generateRoutes()` 中过滤，不满足权限的路由不会被注入。

## 权限数据来源

权限数据来自用户登录后获取的用户信息：

```typescript
// authStore 中的权限数据
const roles = ref<string[]>([])        // 用户角色列表，如 ['admin']
const permissions = ref<string[]>([])  // 用户权限列表，如 ['system.user.view', 'system.user.create']
```

在 Mock 模式下：
- **admin** 账号拥有全部权限
- **user** 账号拥有有限权限

## 权限命名规范

权限码采用点分隔的层级命名：

```
模块.资源.操作
```

示例：
- `system.user.view` — 查看用户
- `system.user.create` — 创建用户
- `system.user.edit` — 编辑用户
- `system.user.delete` — 删除用户
- `system.role.view` — 查看角色
