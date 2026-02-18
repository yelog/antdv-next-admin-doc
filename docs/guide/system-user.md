# 用户管理模块

## 概述

用户管理页用于维护账号信息、角色绑定和启停状态，是后台权限体系的入口页面。

- 路由：`/organization/user`
- 页面：`src/views/system/user/index.vue`
- 权限：`system.user.view`
- API：`src/api/user.ts`

## 核心能力

- 分页查询用户列表
- 按关键字筛选用户名/手机号/状态
- 新增、编辑、删除用户
- 角色分配与状态切换

## 典型数据结构

```ts
interface UserItem {
  id: string
  username: string
  realName: string
  phone?: string
  email?: string
  status: 'active' | 'inactive'
  roleIds: string[]
}
```

## 页面实现建议

1. 用 `ProTable` 管理列表、查询与批量操作。
2. 用 `ProModal + ProForm` 管理新增/编辑弹窗。
3. 删除前统一二次确认，避免误操作。
4. 对手机号、邮箱等敏感字段做脱敏展示。

## 相关文档

- [权限系统](/guide/permission)
- [API 集成](/guide/api-integration)
- [示例与实战](/guide/examples)
