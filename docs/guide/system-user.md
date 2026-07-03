# 用户管理模块

## 概述

用户管理页用于维护账号信息、角色绑定和启停状态，是后台权限体系的入口页面。所有 RBAC 权限检查都基于用户所绑定的角色，因此用户管理是权限系统的核心模块之一。

- 路由：`/organization/user`
- 页面：`src/views/system/user/index.vue`
- 权限：`system.user.view`
- API：`src/api/user.ts`

## 核心能力

### 1. 分页查询用户列表

使用 `ProTable` + `search.formItems` 实现用户列表的展示、筛选和分页：

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

**推荐使用 `search.formItems` 配置搜索字段**，使用 `ProFormItem` 类型定义：

```typescript
const searchFormItems = computed<ProFormItem[]>(() => [
  { name: 'username', label: '用户名', type: 'input' },
  { name: 'email', label: '邮箱', type: 'input' },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
])
```

### 3. 用户列表列配置

```typescript
const columns = computed((): ProTableColumn[] => [
  { title: '用户名', dataIndex: 'username', width: 150, fixed: 'left' },
  { title: '姓名', dataIndex: 'realName', width: 140 },
  { title: '邮箱', dataIndex: 'email', width: 220 },
  { title: '手机号', dataIndex: 'phone', width: 150 },
  { title: '角色', dataIndex: 'roleNames', width: 220 },
  {
    title: '性别',
    dataIndex: 'gender',
    width: 100,
    valueType: 'tag',
    valueEnum: {
      male: { text: '男', color: 'blue' },
      female: { text: '女', color: 'magenta' },
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    valueType: 'badge',
    valueEnum: {
      active: { text: '启用', status: 'success' },
      inactive: { text: '禁用', status: 'default' },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
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

### 4. 新增、编辑、删除用户

使用 `ProModal` + `ProForm` 实现用户表单，**推荐使用 `search.formItems` 等价于 ProFormItem 的配置方式**：

```vue
<a-modal
  v-model:open="modalVisible"
  :title="editingUserId ? '编辑用户' : '新增用户'"
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

### 5. 表单字段配置

```typescript
const formItems = computed<ProFormItem[]>(() => [
  {
    name: 'username',
    label: '用户名',
    type: 'input',
    required: true,
    props: { disabled: Boolean(editingUserId.value) },
    rules: [
      { required: true, message: '请输入用户名' },
      { min: 3, max: 20, message: '用户名长度 3-20 个字符' },
    ],
  },
  { name: 'realName', label: '姓名', type: 'input', required: true },
  {
    name: 'email',
    label: '邮箱',
    type: 'input',
    required: true,
    rules: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }],
  },
  {
    name: 'phone',
    label: '手机号',
    type: 'input',
    rules: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }],
  },
  {
    name: 'gender',
    label: '性别',
    type: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    name: 'status',
    label: '状态',
    type: 'switch',
    valuePropName: 'checked',
    props: {
      checkedChildren: '启用',
      unCheckedChildren: '禁用',
    },
  },
  {
    name: 'roleIds',
    label: '角色',
    type: 'select',
    options: roleSelectOptions, // 从 API 获取的角色选项
    props: { mode: 'multiple', allowClear: true },
    rules: [{ type: 'array', required: true, message: '请选择角色' }],
  },
  {
    name: 'bio',
    label: '个人简介',
    type: 'textarea',
    colSpan: 2,
    props: { rows: 3, maxLength: 200, showCount: true },
  },
])
```

## 典型数据结构

```typescript
interface User {
  id: string;
  username: string; // 用户名（唯一）
  realName: string; // 真实姓名
  phone?: string; // 手机号
  email?: string; // 邮箱
  gender: 'male' | 'female'; // 性别
  status: 'active' | 'inactive'; // 状态
  bio?: string; // 个人简介
  roles: Role[]; // 绑定的角色列表
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}
```

## 数据请求

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

  return {
    data: list,
    total: response.data.total,
    success: true,
  }
}
```

## 注意事项

### 1. 角色选项预加载

```typescript
onMounted(async () => {
  const response = await getRoleList({ current: 1, pageSize: 200 })
  roleOptions.value = response.data.list
})
```

### 2. 编辑时用户名不可修改

```typescript
props: {
  disabled: Boolean(editingUserId.value)
}
```

### 3. 状态值转换

ProForm 的 Switch 组件使用 `valuePropName: 'checked'`，提交时需转换为字符串值：

```typescript
status: typeof values.status === 'boolean'
  ? (values.status ? 'active' : 'inactive')
  : values.status
```

## 相关文档

- [权限系统](/guide/permission)
- [角色管理](/guide/system-role)
- [API 集成](/guide/api-integration)
- [ProTable 高级表格](/components/pro-table)
- [ProForm 高级表单](/components/pro-form)