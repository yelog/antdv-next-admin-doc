# 权限管理模块

## 概述

权限管理用于维护权限点（如 `system.user.create`），供路由鉴权与按钮鉴权统一使用。权限点是 RBAC 体系中最细粒度的控制单元，决定了用户可以执行哪些具体操作。

- 路由：`/organization/permission`
- 页面：`src/views/system/permission/index.vue`
- 权限：`system.permission.view`
- API：`src/api/permission.ts`

## 权限点设计规范

### 命名规范

采用 `domain.resource.action` 三段式命名：

```typescript
// 格式：<模块>.<资源>.<操作>
const PERMISSION_EXAMPLES = {
  // 系统管理模块
  "system.user.view": "查看用户",
  "system.user.create": "新增用户",
  "system.user.edit": "编辑用户",
  "system.user.delete": "删除用户",

  "system.role.view": "查看角色",
  "system.role.create": "新增角色",
  "system.role.edit": "编辑角色",
  "system.role.delete": "删除角色",

  // 业务模块
  "order.list.view": "查看订单列表",
  "order.detail.view": "查看订单详情",
  "order.export": "导出订单",

  "report.dashboard.view": "查看仪表盘",
  "report.generate": "生成报表",
};
```

### 使用场景

```typescript
// 1. 路由级权限
{
  path: '/system/user',
  meta: {
    requiredPermissions: ['system.user.view'],
  },
}

// 2. 按钮级权限 - 指令方式
<a-button v-permission="'system.user.create'">新增用户</a-button>

// 3. 按钮级权限 - 组件方式
<PermissionButton permission="system.user.delete" danger>删除</PermissionButton>

// 4. 编程式权限检查
const { can } = usePermission()
if (can('system.user.edit')) {
  // 有编辑权限
}
```

## 核心能力

### 1. 权限点树形维护

```vue
<template>
  <a-table
    :columns="columns"
    :data-source="permissionTree"
    :pagination="false"
    :default-expand-all-rows="true"
    children-column-name="children"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'code'">
        <a-tag>{{ record.code }}</a-tag>
      </template>
      <template v-if="column.dataIndex === 'type'">
        <a-tag :color="record.type === 'menu' ? 'blue' : 'green'">
          {{ record.type === "menu" ? "菜单" : "按钮" }}
        </a-tag>
      </template>
    </template>
  </a-table>
</template>
```

### 2. 权限点新增/编辑/删除

```typescript
const formItems: ProFormItem[] = [
  { type: "input", name: "name", label: "权限名称", required: true },
  { type: "input", name: "code", label: "权限标识", required: true },
  {
    type: "select",
    name: "type",
    label: "权限类型",
    options: [
      { label: "菜单", value: "menu" },
      { label: "按钮", value: "button" },
    ],
    defaultValue: "button",
  },
  {
    type: "tree-select",
    name: "parentId",
    label: "上级权限",
    treeData: permissionTree,
  },
  { type: "input-number", name: "sort", label: "排序", defaultValue: 0 },
];
```

### 3. 角色与权限点联动

```typescript
// 获取角色的权限树
const getRolePermissionTree = async (roleId: string) => {
  const allPermissions = await getAllPermissions();
  const rolePermissions = await getRolePermissions(roleId);

  // 标记已选中的权限
  const checkedIds = new Set(rolePermissions.map((p) => p.id));

  return {
    tree: buildPermissionTree(allPermissions),
    checkedKeys: Array.from(checkedIds),
  };
};
```

## 数据结构

```typescript
interface PermissionItem {
  id: string;
  name: string; // 权限名称
  code: string; // 权限标识
  type: "menu" | "button"; // 权限类型
  parentId?: string; // 父级 ID
  path?: string; // 菜单路径（type=menu）
  icon?: string; // 图标
  sort: number; // 排序
  status: "active" | "inactive";
  children?: PermissionItem[];
}
```

## 最佳实践

### 1. 先定义权限字典

```typescript
// constants/permissions.ts
export const PERMISSIONS = {
  // 用户管理
  USER_VIEW: 'system.user.view',
  USER_CREATE: 'system.user.create',
  USER_EDIT: 'system.user.edit',
  USER_DELETE: 'system.user.delete',

  // 角色管理
  ROLE_VIEW: 'system.role.view',
  ROLE_CREATE: 'system.role.create',
  ROLE_EDIT: 'system.role.edit',
  ROLE_DELETE: 'system.role.delete',
} as const

// 使用
import { PERMISSIONS } from '@/constants/permissions'

<a-button v-permission="PERMISSIONS.USER_CREATE">新增</a-button>
```

### 2. 权限命名保持稳定

```typescript
// ✅ 好：权限命名稳定
'system.user.create'

// ❌ 避免：频繁重命名
'system.user.add' → 'system.user.create' → 'system.user.new'
```

### 3. 前端权限仅用于体验优化

```typescript
// 前端隐藏无权限按钮（体验优化）
<a-button v-permission="'system.user.delete'" danger>删除</a-button>

// 后端必须做真正的权限校验
@DeleteMapping("/users/{id}")
@PreAuthorize("hasPermission('system.user.delete')")
public void deleteUser(@PathVariable String id) {
  // ...
}
```

### 4. 权限缓存与更新

```typescript
// stores/permission.ts
export const usePermissionStore = defineStore("permission", () => {
  const permissions = ref<string[]>([]);

  // 获取权限列表
  const fetchPermissions = async () => {
    const res = await getMyPermissions();
    permissions.value = res.map((p) => p.code);
  };

  // 检查权限
  const hasPermission = (code: string) => {
    return permissions.value.includes(code);
  };

  return { permissions, fetchPermissions, hasPermission };
});
```

## 权限继承设计

```typescript
// 权限继承关系
interface PermissionTreeNode extends PermissionItem {
  inheritedFrom?: string[]; // 从哪些角色继承而来
}

// 计算用户最终权限
const calculateUserPermissions = (user: User) => {
  const permissionSet = new Set<string>();

  // 遍历用户所有角色
  for (const role of user.roles) {
    for (const perm of role.permissions) {
      permissionSet.add(perm.code);
    }
  }

  return Array.from(permissionSet);
};
```

## 相关文档

- [权限系统](/guide/permission)
- [角色管理](/guide/system-role)
- [路由系统](/guide/routing)
