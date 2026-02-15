# 示例与实战

本文档通过实际案例展示如何使用 Antdv Next Admin 开发常见功能。

## 目录

- [CRUD 完整示例](#crud-完整示例)
- [用户管理实战](#用户管理实战)
- [表单设计模式](#表单设计模式)
- [表格高级用法](#表格高级用法)
- [权限控制实战](#权限控制实战)

---

## CRUD 完整示例

### 场景

实现一个完整的用户管理模块，包含列表、新增、编辑、删除功能。

### 1. 创建 API 接口

```typescript
// src/api/user.ts
import request from '@/utils/request'
import type { User, PaginationParams } from '@/types'

export const getUserList = (params: PaginationParams) => {
  return request.get('/api/users', { params })
}

export const createUser = (data: Partial<User>) => {
  return request.post('/api/users', data)
}

export const updateUser = (id: string, data: Partial<User>) => {
  return request.put(`/api/users/${id}`, data)
}

export const deleteUser = (id: string) => {
  return request.delete(`/api/users/${id}`)
}
```

### 2. 创建 Mock 数据

```typescript
// mock/data/user.data.ts
import { faker } from '@faker-js/faker/locale/zh_CN'

export interface User {
  id: string
  username: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  role: string
  createdAt: string
}

export const userList: User[] = Array.from({ length: 35 }, (_, i) => ({
  id: `user_${i + 1}`,
  username: faker.internet.userName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  status: faker.helpers.arrayElement(['active', 'inactive']),
  role: faker.helpers.arrayElement(['admin', 'user', 'editor']),
  createdAt: faker.date.past().toISOString(),
}))
```

```typescript
// mock/handlers/user.mock.ts
import { defineMock } from 'vite-plugin-mock-dev-server'
import { userList } from '../data/user.data'

export default defineMock([
  {
    url: '/api/users',
    method: 'GET',
    response: ({ query }) => {
      const { current = 1, pageSize = 10, username, status } = query
      
      let list = [...userList]
      if (username) {
        list = list.filter(u => u.username.includes(username))
      }
      if (status) {
        list = list.filter(u => u.status === status)
      }
      
      const start = (current - 1) * pageSize
      const end = start + parseInt(pageSize)
      
      return {
        code: 200,
        data: {
          list: list.slice(start, end),
          total: list.length,
        },
      }
    },
  },
  // ... POST, PUT, DELETE 接口
])
```

### 3. 创建页面

```vue
<!-- src/views/system/users/index.vue -->
<template>
  <div class="user-management">
    <ProTable
      ref="tableRef"
      :columns="columns"
      :request="fetchUserList"
      :toolbar="toolbar"
      :form-items="formItems"
      @form-submit="handleFormSubmit"
    >
      <template #toolbar-actions>
        <a-button type="primary" @click="handleCreate">
          <PlusOutlined />
          新增用户
        </a-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'antdv-next'
import { PlusOutlined } from '@antdv-next/icons'
import ProTable from '@/components/Pro/ProTable/index.vue'
import type { ProTableColumn, ProFormItem, ProTableRequest } from '@/types/pro'
import {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
} from '@/api/user'

const tableRef = ref()

// 表格列配置
const columns: ProTableColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    search: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'tag',
    search: true,
    options: [
      { label: '启用', value: 'active', color: 'green' },
      { label: '禁用', value: 'inactive', color: 'red' },
    ],
  },
  {
    title: '角色',
    dataIndex: 'role',
    valueType: 'tag',
    options: [
      { label: '管理员', value: 'admin', color: 'blue' },
      { label: '编辑', value: 'editor', color: 'cyan' },
      { label: '用户', value: 'user' },
    ],
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateTime',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    actions: [
      {
        label: '编辑',
        permission: 'user.edit',
        onClick: (record) => tableRef.value?.openEditModal(record),
      },
      {
        label: '删除',
        danger: true,
        permission: 'user.delete',
        confirm: '确认删除该用户？',
        onClick: (record) => handleDelete(record),
      },
    ],
  },
]

// 表单配置
const formItems: ProFormItem[] = [
  { name: 'username', label: '用户名', type: 'input', required: true },
  { name: 'email', label: '邮箱', type: 'input', rules: [{ type: 'email' }] },
  { name: 'phone', label: '手机号', type: 'input' },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    required: true,
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
  {
    name: 'role',
    label: '角色',
    type: 'select',
    required: true,
    options: [
      { label: '管理员', value: 'admin' },
      { label: '编辑', value: 'editor' },
      { label: '用户', value: 'user' },
    ],
  },
]

// 请求数据
const fetchUserList: ProTableRequest = async (params) => {
  const res = await getUserList(params)
  return {
    data: res.data.list,
    total: res.data.total,
    success: true,
  }
}

// 表单提交
const handleFormSubmit = async ({ values, record, isEdit }) => {
  try {
    if (isEdit) {
      await updateUser(record.id, values)
      message.success('更新成功')
    } else {
      await createUser(values)
      message.success('创建成功')
    }
    tableRef.value?.refresh()
  } catch (error) {
    message.error('操作失败')
  }
}

// 删除
const handleDelete = async (record: any) => {
  try {
    await deleteUser(record.id)
    message.success('删除成功')
    tableRef.value?.refresh()
  } catch (error) {
    message.error('删除失败')
  }
}

// 打开新增弹窗
const handleCreate = () => {
  tableRef.value?.openCreateModal()
}
</script>
```

---

## 表单设计模式

### 分步表单

```typescript
const stepFormItems: ProFormItem[][] = [
  // 第一步
  [
    { name: 'name', label: '项目名称', type: 'input', required: true },
    { name: 'type', label: '项目类型', type: 'select', required: true, options: [...] },
  ],
  // 第二步
  [
    { name: 'startDate', label: '开始日期', type: 'datePicker', required: true },
    { name: 'endDate', label: '结束日期', type: 'datePicker', required: true },
  ],
  // 第三步
  [
    { name: 'members', label: '成员', type: 'select', mode: 'multiple' },
    { name: 'description', label: '描述', type: 'textarea' },
  ],
]
```

### 动态表单

根据选择动态显示字段：

```typescript
const formItems: ProFormItem[] = [
  {
    name: 'type',
    label: '类型',
    type: 'select',
    options: [
      { label: '个人', value: 'personal' },
      { label: '企业', value: 'enterprise' },
    ],
  },
  {
    name: 'idCard',
    label: '身份证号',
    type: 'input',
    hidden: (values) => values.type !== 'personal',
  },
  {
    name: 'businessLicense',
    label: '营业执照',
    type: 'input',
    hidden: (values) => values.type !== 'enterprise',
  },
]
```

---

## 表格高级用法

### 自定义列渲染

```typescript
const columns: ProTableColumn[] = [
  {
    title: '头像',
    dataIndex: 'avatar',
    render: (text) => h('img', { src: text, style: { width: '40px', borderRadius: '50%' } }),
  },
  {
    title: '进度',
    dataIndex: 'progress',
    render: (text) => h(Progress, { percent: text }),
  },
]
```

### 嵌套表格

```vue
<template>
  <ProTable :columns="columns" :request="request">
    <template #expand="{ record }">
      <ProTable
        :columns="detailColumns"
        :data-source="record.details"
        :pagination="false"
      />
    </template>
  </ProTable>
</template>
```

---

## 权限控制实战

### 按钮级权限

```vue
<template>
  <div>
    <a-button v-permission="'user.create'">新增</a-button>
    <a-button v-permission="'user.export'">导出</a-button>
  </div>
</template>
```

### 页面级权限

```typescript
{
  path: '/system/users',
  meta: {
    requiredPermissions: ['user.view'],
  },
}
```

### 动态权限判断

```typescript
const { can } = usePermission()

const actions = computed(() => {
  const list = []
  if (can('user.edit')) {
    list.push({ label: '编辑', onClick: handleEdit })
  }
  if (can('user.delete')) {
    list.push({ label: '删除', onClick: handleDelete, danger: true })
  }
  return list
})
```

---

## 下一步

- 阅读 [开发工作流](/guide/development-workflow) 了解更多开发规范
- 查看 [API 集成](/guide/api-integration) 学习后端对接
- 阅读 [状态管理](/guide/state-management) 掌握数据流
