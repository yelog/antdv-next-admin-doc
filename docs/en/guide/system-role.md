# Role Management Module

## Overview

Role management maintains role definitions and permission sets in the RBAC model.

- Route: `/organization/role`
- View: `src/views/system/role/index.vue`
- Permission: `system.role.view`
- API: `src/api/role.ts`

## Core Capabilities

### 1. Paginated Role List

Use `ProTable` with `search.formItems` configuration:

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

### 2. Search Form

```typescript
const searchFormItems = computed<ProFormItem[]>(() => [
  { name: 'name', label: 'Role Name', type: 'input' },
  { name: 'code', label: 'Role Code', type: 'input' },
])
```

### 3. Column Configuration

```typescript
const columns = computed<ProTableColumn[]>(() => [
  { title: 'Role Name', dataIndex: 'name', width: 200 },
  { title: 'Role Code', dataIndex: 'code', width: 200 },
  { title: 'Description', dataIndex: 'description' },
  { title: 'Permissions', dataIndex: 'permissionCount', width: 120 },
  { title: 'Updated At', dataIndex: 'updatedAt', width: 200, valueType: 'dateTime' },
  {
    title: 'Actions',
    dataIndex: 'action',
    width: 160,
    fixed: 'right',
    actions: [
      { label: 'Edit', icon: EditOutlined, onClick: (record) => handleEdit(record) },
      { label: 'Delete', icon: DeleteOutlined, danger: true, confirm: 'Delete?', onClick: (record) => handleDelete(record) },
    ],
  },
])
```

### 4. Create/Edit Form with Permission Tree

Permissions are assigned via a `treeSelect` field embedded in the ProForm:

```vue
<a-modal
  v-model:open="modalVisible"
  :title="editingRoleId ? 'Edit Role' : 'Create Role'"
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

```typescript
const formItems = computed<ProFormItem[]>(() => [
  { name: 'name', label: 'Role Name', type: 'input', required: true },
  {
    name: 'code',
    label: 'Role Code',
    type: 'input',
    required: true,
    props: { disabled: Boolean(editingRoleId.value) },
    rules: [
      { required: true, message: 'Please enter role code' },
      { pattern: /^[a-zA-Z0-9_.-]+$/, message: 'Invalid role code format' },
    ],
  },
  { name: 'description', label: 'Description', type: 'textarea', colSpan: 2, props: { rows: 3 } },
  {
    name: 'permissionIds',
    label: 'Permissions',
    type: 'treeSelect',
    colSpan: 2,
    options: permissionOptions,
    props: { treeCheckable: true, allowClear: true, treeDefaultExpandAll: true, showCheckedStrategy: 'SHOW_PARENT', maxTagCount: 2 },
    rules: [{ type: 'array', required: true, message: 'Please select permissions' }],
  },
])
```

### 5. Build Permission Tree

```typescript
onMounted(async () => {
  const response = await getPermissionTree()
  permissionTree.value = response.data
})
```

## Data Structure

```typescript
interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  permissions: Permission[];
  updatedAt: string;
  createdAt: string;
}
```

## Data Request

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

## Notes

1. **Role code is immutable on edit** — `props: { disabled: Boolean(editingRoleId.value) }`
2. **Permission backfill**: on edit, extract permission IDs from `record.permissions`
3. **Flat permission map**: build a `Map<string, Permission>` from the tree for ID-lookup on submit

## Related Docs

- [Permission System](/en/guide/permission)
- [Permission Management](/en/guide/system-permission)
- [User Management](/en/guide/system-user)