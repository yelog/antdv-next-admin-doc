# RBAC 权限流实战

## 场景

示例页 `rbac-flow` 演示了从登录账号到页面权限、按钮权限和数据权限的完整闭环。

- 路由：`/examples/rbac-flow`
- 页面：`src/views/examples/scaffold/rbac/index.vue`

## 权限流链路

1. 登录后拉取用户信息、角色与权限点。
2. `permission store` 基于权限生成可访问路由。
3. 页面级通过 `requiredPermissions` 控制访问。
4. 按钮级通过 `v-permission` / `PermissionButton` 控制显示。
5. 数据级按权限做字段脱敏或接口拒绝。

## 推荐命名

- `system.user.view`
- `system.user.create`
- `system.user.edit`
- `system.user.delete`

## 页面实现建议

- 将权限判断统一收口到 `usePermission`。
- 模板中避免散落复杂表达式，优先封装 `computed`。
- 权限变更后触发路由与页面状态同步更新。

## 验证方式

- 用 `admin/123456` 与 `user/123456` 对比菜单和按钮差异。
- 观察敏感字段（手机号、邮箱）脱敏行为。

## 相关文档

- [权限系统](/guide/permission)
- [状态管理](/guide/state-management)
- [路由系统](/guide/routing)
