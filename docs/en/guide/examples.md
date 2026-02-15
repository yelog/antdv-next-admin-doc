# Examples

This document demonstrates common features through practical cases using Antdv Next Admin.

## Table of Contents

- [CRUD Complete Example](#crud-complete-example)
- [Form Design Patterns](#form-design-patterns)
- [Table Advanced Usage](#table-advanced-usage)
- [Permission Control](#permission-control)

---

## CRUD Complete Example

### Scenario

Implement a complete user management module with list, create, edit, and delete functions.

### 1. Create API Interface

```typescript
// src/api/user.ts
import request from '@/utils/request'

export const getUserList = (params) => {
  return request.get('/api/users', { params })
}

export const createUser = (data) => {
  return request.post('/api/users', data)
}

export const updateUser = (id, data) => {
  return request.put(`/api/users/${id}`, data)
}

export const deleteUser = (id) => {
  return request.delete(`/api/users/${id}`)
}
```

### 2. Create Page

```vue
<template>
  <div class="user-management">
    <ProTable
      ref="tableRef"
      :columns="columns"
      :request="fetchUserList"
      :form-items="formItems"
      @form-submit="handleFormSubmit"
    >
      <template #toolbar-actions>
        <a-button type="primary" @click="handleCreate">
          <PlusOutlined />
          Add User
        </a-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'antdv-next'
import ProTable from '@/components/Pro/ProTable/index.vue'

const tableRef = ref()

const columns = [
  { title: 'Username', dataIndex: 'username', search: true },
  { title: 'Email', dataIndex: 'email' },
  {
    title: 'Status',
    dataIndex: 'status',
    valueType: 'tag',
    options: [
      { label: 'Active', value: 'active', color: 'green' },
      { label: 'Inactive', value: 'inactive', color: 'red' },
    ],
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    actions: [
      { label: 'Edit', onClick: (record) => tableRef.value?.openEditModal(record) },
      { label: 'Delete', danger: true, onClick: (record) => handleDelete(record) },
    ],
  },
]

const formItems = [
  { name: 'username', label: 'Username', type: 'input', required: true },
  { name: 'email', label: 'Email', type: 'input' },
]

const handleFormSubmit = async ({ values, record, isEdit }) => {
  if (isEdit) {
    await updateUser(record.id, values)
    message.success('Updated successfully')
  } else {
    await createUser(values)
    message.success('Created successfully')
  }
  tableRef.value?.refresh()
}

const handleDelete = async (record) => {
  await deleteUser(record.id)
  message.success('Deleted successfully')
  tableRef.value?.refresh()
}
</script>
```

---

## Form Design Patterns

### Dynamic Form

```typescript
const formItems = [
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { label: 'Personal', value: 'personal' },
      { label: 'Enterprise', value: 'enterprise' },
    ],
  },
  {
    name: 'idCard',
    label: 'ID Card',
    type: 'input',
    hidden: (values) => values.type !== 'personal',
  },
  {
    name: 'businessLicense',
    label: 'Business License',
    type: 'input',
    hidden: (values) => values.type !== 'enterprise',
  },
]
```

---

## Permission Control

### Button-level Permission

```vue
<template>
  <div>
    <a-button v-permission="'user.create'">Add</a-button>
    <a-button v-permission="'user.export'">Export</a-button>
  </div>
</template>
```

### Dynamic Permission Check

```typescript
const { can } = usePermission()

const actions = computed(() => {
  const list = []
  if (can('user.edit')) {
    list.push({ label: 'Edit', onClick: handleEdit })
  }
  if (can('user.delete')) {
    list.push({ label: 'Delete', onClick: handleDelete, danger: true })
  }
  return list
})
```

---

## Next Steps

- Read [Development Workflow](/en/guide/development-workflow)
- View [API Integration](/en/guide/api-integration)
- Learn [State Management](/en/guide/state-management)
