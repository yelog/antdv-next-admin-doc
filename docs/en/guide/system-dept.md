# Department Management Module

## Overview

Department management maintains the organization hierarchy using a tree structure. It serves as the foundation for data-level access control in the RBAC system.

- Route: `/organization/dept`
- View: `src/views/system/dept/index.vue`
- Permission: `system.dept.view`
- API: `src/api/dept.ts`

## Core Capabilities

### 1. Split Layout: Left Tree + Right Detail

Uses `ProSplitLayout` with a searchable department tree on the left and detail/inner-table on the right:

```vue
<template>
  <ProSplitLayout :side-width="280">
    <template #side>
      <a-input-search v-model:value="searchText" @search="loadDeptTree" />
      <a-tree :tree-data="treeData" @select="handleTreeSelect" />
    </template>
    <template #main>
      <template v-if="selectedDept">
        <ProDescriptions :columns="deptDescColumns" :data="deptDescData" :column="2" bordered />
        <ProTable :columns="childColumns" :request="loadChildDepts" :search="false" :pagination="false" />
      </template>
    </template>
  </ProSplitLayout>
</template>
```

### 2. Department Detail (ProDescriptions)

```typescript
const deptDescColumns = computed<ProDescriptionItem[]>(() => [
  { label: 'Name', dataIndex: 'name' },
  { label: 'Parent Dept', dataIndex: 'parentName' },
  { label: 'Leader', dataIndex: 'leader' },
  { label: 'Phone', dataIndex: 'phone' },
  { label: 'Email', dataIndex: 'email' },
  { label: 'Sort', dataIndex: 'sort' },
  { label: 'Created At', dataIndex: 'createTime' },
  { label: 'Updated At', dataIndex: 'updateTime' },
  { label: 'Remark', dataIndex: 'remark', span: 2 },
])
```

### 3. Add/Edit Form

```vue
<a-modal v-model:open="modalVisible" :title="form.id ? 'Edit Dept' : 'Create Dept'" width="520">
  <a-form :model="form" :label-col="{ span: 6 }">
    <a-form-item label="Parent Dept">
      <a-tree-select v-model:value="form.parentId" :tree-data="parentTreeData" allow-clear />
    </a-form-item>
    <a-form-item label="Dept Name" required>
      <a-input v-model:value="form.name" />
    </a-form-item>
    <a-form-item label="Leader"><a-input v-model:value="form.leader" /></a-form-item>
    <a-form-item label="Phone"><a-input v-model:value="form.phone" /></a-form-item>
    <a-form-item label="Email"><a-input v-model:value="form.email" /></a-form-item>
    <a-form-item label="Sort"><a-input-number v-model:value="form.sort" :min="0" style="width: 100%" /></a-form-item>
    <a-form-item label="Status">
      <a-radio-group v-model:value="form.status">
        <a-radio value="enabled">Enabled</a-radio>
        <a-radio value="disabled">Disabled</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Remark"><a-textarea v-model:value="form.remark" :rows="3" /></a-form-item>
  </a-form>
</a-modal>
```

### 4. Delete Check

```typescript
const hasChildren = flatList.value.some((d) => d.parentId === dept.id)
if (hasChildren) {
  message.warning('Cannot delete: has child departments')
  return
}
```

## Data Structure

```typescript
interface Department {
  id: string;
  name: string;
  parentId: string | null;
  leader?: string;
  phone?: string;
  email?: string;
  sort: number;
  status: 'enabled' | 'disabled';
  remark?: string;
  createTime: string;
  updateTime: string;
  children?: Department[];
}
```

## Notes

1. **Status values**: use `enabled`/`disabled` (not `active`/`inactive`)
2. **Parent tree**: includes a synthetic root node for "no parent"
3. **Delete protection**: departments with children cannot be deleted

## Related Docs

- [ProSplitLayout](/en/components/pro-split-layout)
- [User Management](/en/guide/system-user)
- [Permission System](/en/guide/permission)