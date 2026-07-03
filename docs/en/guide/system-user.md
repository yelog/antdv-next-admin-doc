# User Management Module

## Overview

The user management page maintains accounts, role bindings, and status transitions. It is the entry point of the permission system.

- Route: `/organization/user`
- View: `src/views/system/user/index.vue`
- Permission: `system.user.view`
- API: `src/api/user.ts`

## Core Capabilities

### 1. Paginated User List

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

### 2. Search Form Configuration

**Recommended**: use `search.formItems` with `ProFormItem` types:

```typescript
const searchFormItems = computed<ProFormItem[]>(() => [
  { name: 'username', label: 'Username', type: 'input' },
  { name: 'email', label: 'Email', type: 'input' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
])
```

### 3. Column Configuration

```typescript
const columns = computed((): ProTableColumn[] => [
  { title: 'Username', dataIndex: 'username', width: 150, fixed: 'left' },
  { title: 'Real Name', dataIndex: 'realName', width: 140 },
  { title: 'Email', dataIndex: 'email', width: 220 },
  { title: 'Phone', dataIndex: 'phone', width: 150 },
  { title: 'Roles', dataIndex: 'roleNames', width: 220 },
  {
    title: 'Gender',
    dataIndex: 'gender',
    width: 100,
    valueType: 'tag',
    valueEnum: {
      male: { text: 'Male', color: 'blue' },
      female: { text: 'Female', color: 'magenta' },
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 120,
    valueType: 'badge',
    valueEnum: {
      active: { text: 'Active', status: 'success' },
      inactive: { text: 'Inactive', status: 'default' },
    },
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    width: 200,
    valueType: 'dateTime',
  },
  {
    title: 'Actions',
    dataIndex: 'action',
    width: 160,
    fixed: 'right',
    actions: [
      { label: 'Edit', icon: EditOutlined, onClick: (record) => handleEdit(record) },
      { label: 'Delete', icon: DeleteOutlined, danger: true, confirm: 'Delete this user?', onClick: (record) => handleDelete(record) },
    ],
  },
])
```

### 4. Create/Edit Form

```vue
<a-modal
  v-model:open="modalVisible"
  :title="editingUserId ? 'Edit User' : 'Create User'"
  width="760px"
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

### 5. Form Fields

```typescript
const formItems = computed<ProFormItem[]>(() => [
  {
    name: 'username',
    label: 'Username',
    type: 'input',
    required: true,
    props: { disabled: Boolean(editingUserId.value) },
    rules: [
      { required: true, message: 'Please enter username' },
      { min: 3, max: 20, message: 'Username must be 3-20 characters' },
    ],
  },
  { name: 'realName', label: 'Real Name', type: 'input', required: true },
  {
    name: 'email',
    label: 'Email',
    type: 'input',
    required: true,
    rules: [{ required: true, message: 'Please enter email' }, { type: 'email', message: 'Invalid email format' }],
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'input',
    rules: [{ pattern: /^1[3-9]\d{9}$/, message: 'Invalid phone format' }],
  },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ],
  },
  {
    name: 'status',
    label: 'Status',
    type: 'switch',
    valuePropName: 'checked',
    props: { checkedChildren: 'Active', unCheckedChildren: 'Inactive' },
  },
  {
    name: 'roleIds',
    label: 'Roles',
    type: 'select',
    options: roleSelectOptions,
    props: { mode: 'multiple', allowClear: true },
    rules: [{ type: 'array', required: true, message: 'Please select roles' }],
  },
  {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    colSpan: 2,
    props: { rows: 3, maxLength: 200, showCount: true },
  },
])
```

## Data Structure

```typescript
interface User {
  id: string;
  username: string;
  realName: string;
  phone?: string;
  email?: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive';
  bio?: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}
```

## Data Request

```typescript
const fetchTableData = async (params: Record<string, unknown>) => {
  const response = await getUserList({
    current: Number(params.current || 1),
    pageSize: Number(params.pageSize || 10),
    username: (params.username as string)?.trim() || undefined,
    email: (params.email as string)?.trim() || undefined,
    status: params.status as string,
  })

  const list = response.data.list.map((item) => ({
    ...item,
    roleNames: item.roles.map((role) => role.name).join(', '),
  }))

  return { data: list, total: response.data.total, success: true }
}
```

## Notes

### 1. Preload Role Options

```typescript
onMounted(async () => {
  const response = await getRoleList({ current: 1, pageSize: 200 })
  roleOptions.value = response.data.list
})
```

### 2. Username is Immutable on Edit

```typescript
props: { disabled: Boolean(editingUserId.value) }
```

### 3. Status Value Conversion

When using `valuePropName: 'checked'`, convert the boolean to string on submit:

```typescript
status: typeof values.status === 'boolean'
  ? (values.status ? 'active' : 'inactive')
  : values.status
```

## Related Docs

- [Permission System](/en/guide/permission)
- [Role Management](/en/guide/system-role)
- [API Integration](/en/guide/api-integration)
- [ProTable](/en/components/pro-table)
- [ProForm](/en/components/pro-form)