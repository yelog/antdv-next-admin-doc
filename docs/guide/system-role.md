# 角色管理模块

## 概述

角色管理负责维护角色定义与权限集合，是 RBAC（基于角色的访问控制）的核心配置页面。角色作为用户和权限之间的桥梁，决定了用户可以访问哪些资源和执行哪些操作。

- 路由：`/organization/role`
- 页面：`src/views/system/role/index.vue`
- 权限：`system.role.view`
- API：`src/api/role.ts`

## 核心能力

### 1. 角色列表分页查询

使用 `ProTable` + `search.formItems` 实现角色列表的展示、筛选和分页：

```vue
<template>
  <ProTable
    ref="tableRef"
    :columns="columns"
    :request="fetchTableData"
    :toolbar="toolbarConfig"
    :search="{
      formItems: searchFormItems,
      labelWidth: 6,
      defaultCollapsed: true,
    }"
    row-key="id"
  />
</template>
```

### 2. 搜索表单配置

```typescript
const searchFormItems = computed<ProFormItem[]>(() => [
  { name: 'name', label: '角色名称', type: 'input' },
  { name: 'code', label: '角色标识', type: 'input' },
])
```

### 3. 角色列配置

```typescript
const columns = computed<ProTableColumn[]>(() => [
  { title: '角色名称', dataIndex: 'name', width: 200 },
  { title: '角色标识', dataIndex: 'code', width: 200 },
  { title: '描述', dataIndex: 'description' },
  { title: '权限数', dataIndex: 'permissionCount', width: 120 },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    width: 200,
    valueType: 'dateTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 160,
    fixed: 'right',
    actions: [
      { label: '编辑', icon: EditOutlined, onClick: (record) => handleEdit(record) },
      { label: '删除', icon: DeleteOutlined, danger: true, confirm: '确认删除？', onClick: (record) => handleDelete(record) },
    ],
  },
])
```

### 4. 角色新增、编辑

使用 `ProModal` + `ProForm` 实现角色表单，权限选择使用 `treeSelect` 内嵌在表单中：

```vue
<a-modal
  v-model:open="modalVisible"
  :title="editingRoleId ? '编辑角色' : '新建角色'"
  width="820px"
  @ok="handleSubmit"
>
  <ProForm
    ref="formRef"
    :form-items="formItems"
    :initial-values="formData"
    :grid="{ cols: 2, gutter: 16 }"
    :layout="{ layout: 'vertical' }"
  />
</a-modal>
```

### 5. 表单字段配置

```typescript
const formItems = computed<ProFormItem[]>(() => [
  { name: 'name', label: '角色名称', type: 'input', required: true },
  {
    name: 'code',
    label: '角色标识',
    type: 'input',
    required: true,
    props: { disabled: Boolean(editingRoleId.value) },
    rules: [
      { required: true, message: '请输入角色标识' },
      { pattern: /^[a-zA-Z0-9_.-]+$/, message: '角色标识格式不正确' },
    ],
  },
  {
    name: 'description',
    label: '描述',
    type: 'textarea',
    colSpan: 2,
    props: { rows: 3 },
  },
  {
    name: 'permissionIds',
    label: '权限',
    type: 'treeSelect',
    colSpan: 2,
    options: permissionOptions, // 从 API 获取的权限树选项
    props: {
      treeCheckable: true,
      allowClear: true,
      treeDefaultExpandAll: true,
      showCheckedStrategy: 'SHOW_PARENT',
      maxTagCount: 2,
    },
    rules: [{ type: 'array', required: true, message: '请选择权限' }],
  },
])
```

### 6. 权限树构建

```typescript
const permissionOptions = computed<PermissionOption[]>(() => {
  const buildOptions = (nodes: Permission[]): PermissionOption[] => {
    return nodes.map((node) => ({
      label: `${node.name} (${node.code})`,
      value: node.id,
      children: node.children?.length > 0 ? buildOptions(node.children) : undefined,
    }))
  }
  return buildOptions(permissionTree.value)
})

// 初始化时加载权限树
onMounted(async () => {
  const response = await getPermissionTree()
  permissionTree.value = response.data
})
```

## 数据结构

```typescript
interface Role {
  id: string;
  name: string; // 角色名称（显示用）
  code: string; // 角色标识（代码用，如 'admin', 'user'）
  description?: string; // 描述
  permissions: Permission[]; // 绑定的权限列表
  updatedAt: string;
  createdAt: string;
}

interface RoleForm {
  name: string;
  code: string;
  description?: string;
  permissionIds: string[];
}
```

## 数据请求

```typescript
const fetchTableData = async (params: Record<string, unknown>) => {
  const response = await getRoleList({
    current: Number(params.current || 1),
    pageSize: Number(params.pageSize || 10),
    name: (params.name as string)?.trim() || undefined,
    code: (params.code as string)?.trim() || undefined,
  })

  const list = response.data.list.map((item) => ({
    ...item,
    permissionCount: item.permissions?.length || 0,
  }))

  return { data: list, total: response.data.total, success: true }
}
```

## 注意事项

### 1. 编辑时角色标识不可修改

```typescript
props: { disabled: Boolean(editingRoleId.value) }
```

### 2. 权限联动

编辑角色时，需从 `record.permissions` 中提取权限 ID 回填到 `treeSelect`：

```typescript
formData.value = {
  name: record.name,
  code: record.code,
  description: record.description || '',
  permissionIds: (record.permissions || []).map((p) => p.id),
}
```

### 3. 复用权限数据

使用 `permissionMap` 扁平化权限树，在提交时根据 ID 查找完整的权限对象：

```typescript
const permissionMap = computed(() => {
  const map = new Map<string, Permission>()
  const traverse = (nodes: Permission[]) => {
    nodes.forEach((node) => {
      map.set(node.id, node)
      if (node.children) traverse(node.children)
    })
  }
  traverse(permissionTree.value)
  return map
})
```

## 相关文档

- [权限系统](/guide/permission)
- [权限管理](/guide/system-permission)
- [用户管理](/guide/system-user)
- [ProTable 高级表格](/components/pro-table)
- [ProForm 高级表单](/components/pro-form)