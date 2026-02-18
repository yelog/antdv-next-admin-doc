# 权限管理模块

## 概述

权限管理用于维护权限点（如 `system.user.create`），供路由鉴权与按钮鉴权统一使用。

- 路由：`/organization/permission`
- 页面：`src/views/system/permission/index.vue`
- 权限：`system.permission.view`
- API：`src/api/permission.ts`

## 权限点设计建议

- 采用 `domain.resource.action` 命名，例如：`system.user.delete`
- 路由级权限使用 `requiredPermissions`
- 按钮级权限使用 `v-permission` 或 `PermissionButton`

## 核心能力

- 权限点树形维护
- 权限点新增/编辑/删除
- 角色与权限点联动

## 最佳实践

1. 先定义权限字典，再在页面中引用。
2. 权限点命名保持稳定，避免频繁重命名。
3. 前端控制仅用于体验优化，最终以后端鉴权为准。

## 相关文档

- [权限系统](/guide/permission)
- [路由系统](/guide/routing)
