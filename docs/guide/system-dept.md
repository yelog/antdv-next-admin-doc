# 部门管理模块

## 概述

部门管理用于维护组织架构，通常以树形结构展示部门层级。部门管理在 RBAC 体系中用于数据权限控制，可以限制用户只能访问本部门或特定部门的数据。

- 路由：`/organization/dept`
- 页面：`src/views/system/dept/index.vue`
- 权限：`system.dept.view`
- API：`src/api/dept.ts`

## 核心能力

### 1. 部门树加载与懒加载

```vue
<template>
  <a-tree
    :tree-data="deptTree"
    :load-data="onLoadData"
    :field-names="{ title: 'name', key: 'id', children: 'children' }"
    show-line
    default-expand-all
    @select="handleSelect"
  >
    <template #title="{ name, code, leader }">
      <span>{{ name }}</span>
      <span class="text-secondary ml-sm">({{ code }})</span>
      <span v-if="leader" class="text-secondary ml-sm">- {{ leader }}</span>
    </template>
  </a-tree>
</template>

<script setup lang="ts">
// 懒加载子节点
const onLoadData = async ({ key, children }) => {
  if (children) return; // 已加载

  const childDepts = await getDeptChildren(key);
  // 更新树数据...
};
</script>
```

### 2. 新增/编辑/删除部门

```typescript
const formItems: ProFormItem[] = [
  { type: "input", name: "name", label: "部门名称", required: true },
  { type: "input", name: "code", label: "部门编码", required: true },
  {
    type: "tree-select",
    name: "parentId",
    label: "上级部门",
    treeData: deptTree,
  },
  { type: "input", name: "leader", label: "负责人" },
  { type: "input", name: "phone", label: "联系电话" },
  { type: "input-number", name: "sort", label: "排序", defaultValue: 0 },
  { type: "textarea", name: "description", label: "描述" },
];
```

### 3. 上下级关系维护

```typescript
// 检查是否可以删除部门
const canDeleteDept = async (deptId: string) => {
  // 1. 检查是否有子部门
  const children = await getDeptChildren(deptId);
  if (children.length > 0) {
    message.warning("该部门下存在子部门，无法删除");
    return false;
  }

  // 2. 检查是否有关联用户
  const users = await getUsersByDept(deptId);
  if (users.length > 0) {
    message.warning("该部门下存在用户，无法删除");
    return false;
  }

  return true;
};
```

### 4. 绑定负责人和部门编码

```typescript
// 选择部门负责人
const handleSelectLeader = async (deptId: string) => {
  const users = await getDeptUsers(deptId);

  // 弹出用户选择器
  leaderModalOpen.value = true;
  leaderOptions.value = users.map((u) => ({
    label: u.realName,
    value: u.id,
  }));
};
```

## 数据结构

```typescript
interface DeptItem {
  id: string;
  name: string; // 部门名称
  code: string; // 部门编码
  parentId?: string; // 父级 ID
  leader?: string; // 负责人姓名
  leaderId?: string; // 负责人 ID
  phone?: string; // 联系电话
  email?: string; // 邮箱
  sort: number; // 排序
  status: "active" | "inactive";
  userCount?: number; // 部门人数
  children?: DeptItem[];
}
```

## 交互设计

### 1. 左侧树 + 右侧详情

使用 `ProSplitLayout` 实现主从布局：

```vue
<ProSplitLayout :left-width="280" :min-left="200" :max-left="400">
  <template #left>
    <div class="dept-tree-panel">
      <a-input-search placeholder="搜索部门" @search="handleSearch" />
      <a-tree :tree-data="filteredDeptTree" @select="handleSelect" />
    </div>
  </template>
  
  <template #right>
    <div class="dept-detail-panel">
      <DeptDetail v-if="selectedDept" :dept="selectedDept" />
      <a-empty v-else description="请选择部门" />
    </div>
  </template>
</ProSplitLayout>
```

### 2. 部门搜索

```typescript
const handleSearch = (keyword: string) => {
  if (!keyword) {
    filteredDeptTree.value = deptTree.value;
    return;
  }

  // 递归过滤树
  const filterTree = (nodes: DeptItem[]): DeptItem[] => {
    return nodes.reduce((acc, node) => {
      const match = node.name.includes(keyword) || node.code.includes(keyword);
      const children = node.children ? filterTree(node.children) : [];

      if (match || children.length > 0) {
        acc.push({ ...node, children });
      }

      return acc;
    }, [] as DeptItem[]);
  };

  filteredDeptTree.value = filterTree(deptTree.value);
};
```

### 3. 部门拖拽排序

```vue
<template>
  <a-tree
    :tree-data="deptTree"
    draggable
    @drop="handleDrop"
    @dragenter="handleDragEnter"
  />
</template>

<script setup lang="ts">
const handleDrop = async (info: DropEvent) => {
  const { node, dragNode, dropPosition } = info;

  // 更新父级关系
  await updateDeptParent(dragNode.id, node.id, dropPosition);

  // 刷新树
  await refreshDeptTree();

  message.success("部门移动成功");
};
</script>
```

## 最佳实践

### 1. 删除前检查

```typescript
const handleDelete = async (dept: DeptItem) => {
  // 1. 检查子部门
  const children = await getDeptChildren(dept.id);
  if (children.length > 0) {
    Modal.confirm({
      title: "确认删除",
      content: `该部门下有 ${children.length} 个子部门，确定要一起删除吗？`,
      onOk: () => deleteDeptRecursive(dept.id),
    });
    return;
  }

  // 2. 检查关联用户
  const users = await getUsersByDept(dept.id);
  if (users.length > 0) {
    message.warning("该部门下存在用户，请先转移用户");
    return;
  }

  // 3. 执行删除
  await deleteDept(dept.id);
  message.success("删除成功");
};
```

### 2. 部门路径展示

```typescript
// 获取部门的完整路径
const getDeptPath = (deptId: string, tree: DeptItem[]): string[] => {
  const path: string[] = [];

  const findPath = (
    nodes: DeptItem[],
    target: string,
    parents: string[],
  ): boolean => {
    for (const node of nodes) {
      if (node.id === target) {
        path.push(...parents, node.name);
        return true;
      }
      if (
        node.children &&
        findPath(node.children, target, [...parents, node.name])
      ) {
        return true;
      }
    }
    return false;
  };

  findPath(tree, deptId, []);
  return path;
};

// 显示：总公司 / 技术部 / 研发一组
```

### 3. 数据权限设计

```typescript
// 部门数据权限类型
enum DeptDataScope {
  ALL = "all", // 全部数据
  DEPT = "dept", // 本部门
  DEPT_AND_SUB = "dept_sub", // 本部门及子部门
  CUSTOM = "custom", // 自定义
  SELF = "self", // 仅本人
}

// 根据数据权限过滤数据
const filterByDataScope = async (userId: string, query: QueryParams) => {
  const user = await getUserWithRoles(userId);

  for (const role of user.roles) {
    switch (role.dataScope) {
      case DeptDataScope.ALL:
        // 不加过滤条件
        break;
      case DeptDataScope.DEPT:
        query.deptId = user.deptId;
        break;
      case DeptDataScope.DEPT_AND_SUB:
        const subDeptIds = await getSubDeptIds(user.deptId);
        query.deptIds = [user.deptId, ...subDeptIds];
        break;
      case DeptDataScope.SELF:
        query.creatorId = userId;
        break;
    }
  }

  return query;
};
```

## 相关文档

- [ProSplitLayout 分栏布局](/components/pro-split-layout)
- [用户管理](/guide/system-user)
- [权限系统](/guide/permission)
- [示例与实战](/guide/examples)
