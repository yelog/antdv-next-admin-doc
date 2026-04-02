# 角色管理模块

## 概述

角色管理负责维护角色定义与权限集合，是 RBAC（基于角色的访问控制）的核心配置页面。角色作为用户和权限之间的桥梁，决定了用户可以访问哪些资源和执行哪些操作。

- 路由：`/organization/role`
- 页面：`src/views/system/role/index.vue`
- 权限：`system.role.view`
- API：`src/api/role.ts`

## 核心能力

### 1. 角色列表分页查询

```vue
<ProTable
  :columns="columns"
  :request="requestRoles"
  :search="false"
  row-key="id"
/>
```

### 2. 角色新增、编辑、删除

```typescript
const formItems: ProFormItem[] = [
  { type: "input", name: "name", label: "角色名称", required: true },
  { type: "input", name: "code", label: "角色标识", required: true },
  { type: "textarea", name: "description", label: "描述" },
  { type: "switch", name: "status", label: "状态", defaultValue: "active" },
];
```

### 3. 角色绑定菜单权限/按钮权限

使用树形结构分配权限：

```vue
<template>
  <a-modal v-model:open="permissionModalOpen" title="分配权限" width="720px">
    <a-tree
      v-model:checked-keys="checkedKeys"
      :tree-data="permissionTree"
      checkable
      :field-names="{ title: 'name', key: 'id' }"
    />
  </a-modal>
</template>
```

### 4. 角色状态管理

```typescript
const handleStatusChange = async (
  roleId: string,
  status: "active" | "inactive",
) => {
  await updateRoleStatus(roleId, status);

  // 更新已绑定该角色的用户的权限
  await refreshAffectedUsers(roleId);

  message.success(`角色已${status === "active" ? "启用" : "禁用"}`);
};
```

## 数据结构

```typescript
interface RoleItem {
  id: string;
  name: string; // 角色名称（显示用）
  code: string; // 角色标识（代码用，如 'admin', 'user'）
  description?: string; // 描述
  status: "active" | "inactive";
  permissionIds: string[]; // 绑定的权限 ID 列表
  userCount: number; // 关联用户数
  createdAt: string;
  updatedAt: string;
}

interface RoleForm {
  name: string;
  code: string;
  description?: string;
  status: "active" | "inactive";
  permissionIds: string[];
}
```

## 实现要点

### 1. 权限树交互

```vue
<template>
  <a-tree
    v-model:checked-keys="checkedPermissionIds"
    :tree-data="permissionTree"
    checkable
    default-expand-all
    @check="handlePermissionCheck"
  >
    <template #title="{ name, code }">
      <span>{{ name }}</span>
      <span class="text-secondary ml-sm">{{ code }}</span>
    </template>
  </a-tree>
</template>

<script setup lang="ts">
const handlePermissionCheck = (checkedKeys: string[], { node, checked }) => {
  // 处理半选状态（父节点部分选中）
  // 处理级联选择（选中父节点自动选中子节点）
};
</script>
```

### 2. 超级管理员保护

```typescript
// 前端保护
const ADMIN_ROLE_CODE = "admin";

const canDeleteRole = (role: RoleItem) => {
  return role.code !== ADMIN_ROLE_CODE;
};

const handleDelete = (role: RoleItem) => {
  if (role.code === ADMIN_ROLE_CODE) {
    message.warning("超级管理员角色不允许删除");
    return;
  }
  // 执行删除...
};

// 后端也应做同样的保护
```

### 3. 权限刷新机制

```typescript
const handleRoleUpdate = async (roleId: string, data: RoleForm) => {
  await updateRole(roleId, data);

  // 找出所有绑定该角色的用户
  const affectedUsers = await getUsersByRole(roleId);

  // 如果包含当前用户，刷新权限
  if (affectedUsers.some((u) => u.id === currentUser.value?.id)) {
    await permissionStore.fetchPermissions();
  }

  message.success("角色更新成功");
};
```

## 典型流程

### 新建角色流程

1. 点击「新建角色」按钮
2. 填写角色名称、标识、描述
3. 选择菜单与操作权限（树形勾选）
4. 保存后回到角色列表
5. 在用户管理中为用户分配该角色
6. 使用测试账号验证权限生效

### 权限分配流程

```typescript
const assignPermissions = async (roleId: string) => {
  // 1. 获取当前角色的权限
  const currentPermissions = await getRolePermissions(roleId);
  checkedPermissionIds.value = currentPermissions.map((p) => p.id);

  // 2. 打开权限分配弹窗
  permissionModalOpen.value = true;

  // 3. 用户勾选权限后保存
  const savePermissions = async () => {
    await updateRolePermissions(roleId, checkedPermissionIds.value);

    // 4. 刷新相关用户的权限缓存
    await invalidatePermissionCache(roleId);

    message.success("权限分配成功");
  };
};
```

## 最佳实践

### 1. 角色命名规范

```typescript
// 推荐命名格式
const ROLE_NAMING = {
  admin: "超级管理员",
  "dept-manager": "部门管理员",
  user: "普通用户",
  auditor: "审计员",
  operator: "操作员",
};
```

### 2. 预置角色

系统应预置常用角色，减少用户配置成本：

| 角色标识     | 角色名称   | 权限范围       |
| ------------ | ---------- | -------------- |
| admin        | 超级管理员 | 所有权限       |
| user         | 普通用户   | 基础查看权限   |
| dept-manager | 部门管理员 | 部门内管理权限 |

### 3. 权限粒度设计

```
system          # 系统模块
├── user        # 用户资源
│   ├── view    # 查看权限
│   ├── create  # 新增权限
│   ├── edit    # 编辑权限
│   └── delete  # 删除权限
├── role
│   └── ...
└── ...
```

### 4. 审计日志

所有角色变更应记录操作日志：

```typescript
const logRoleChange = async (action: string, roleId: string, details: any) => {
  await createLog({
    module: "角色管理",
    action,
    targetId: roleId,
    operator: currentUser.value.id,
    details: JSON.stringify(details),
  });
};
```

## 相关文档

- [权限系统](/guide/permission)
- [权限管理](/guide/system-permission)
- [用户管理](/guide/system-user)
- [状态管理](/guide/state-management)
