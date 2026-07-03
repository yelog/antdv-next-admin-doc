# Permission Management Module

## Overview

Permission management maintains permission points (e.g. `system.user.create`) used by route and button guards. It is the finest-grained control unit in the RBAC model.

- Route: `/organization/permission`
- View: `src/views/system/permission/index.vue`
- Permission: `system.permission.view`
- API: `src/api/permission.ts`

## Naming Convention

Uses `domain.resource.action` three-segment naming:

```typescript
'system.user.view'     → View user
'system.user.create'   → Create user
'system.user.edit'     → Edit user
'system.user.delete'   → Delete user
```

## Core Capabilities

### 1. Tree Table with Search

Uses `ProTable` in tree mode with a search form:

```vue
<template>
  <ProTable
    ref="tableRef"
    :columns="columns"
    :request="fetchTableData"
    :search="{
      formItems: searchFormItems,
      defaultCollapsed: false,
    }"
    :pagination="false"
    :show-index-column="false"
    row-key="id"
    :expanded-row-keys="expandedRowKeys"
    :children-column-name="'children'"
  >
    <template #toolbar-actions>
      <a-button type="primary" @click="handleCreateRoot">Create Root</a-button>
      <a-button @click="expandAllRows">Expand All</a-button>
      <a-button @click="collapseAllRows">Collapse All</a-button>
    </template>
  </ProTable>
</template>
```

### 2. Search Form Configuration

```typescript
const searchFormItems = computed<ProFormItem[]>(() => [
  { name: 'keyword', label: 'Keyword', type: 'input' },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { label: 'Menu', value: 'menu' },
      { label: 'Button', value: 'button' },
      { label: 'API', value: 'api' },
    ],
  },
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
  {
    title: 'Name',
    dataIndex: 'name',
    width: 220,
    fixed: 'left',
    render: (value) => resolveLocalizedText(value),
  },
  { title: 'Code', dataIndex: 'code', width: 220 },
  {
    title: 'Type',
    dataIndex: 'type',
    width: 120,
    valueType: 'tag',
    valueEnum: {
      menu: { text: 'Menu', color: 'processing' },
      button: { text: 'Button', color: 'success' },
      api: { text: 'API', color: 'purple' },
    },
  },
  { title: 'Route Path', dataIndex: 'path', width: 170 },
  { title: 'Component', dataIndex: 'component', width: 220 },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 120,
    valueType: 'badge',
    valueEnum: { active: { text: 'Active', status: 'success' }, inactive: { text: 'Inactive', status: 'default' } },
  },
  {
    title: 'Visible',
    dataIndex: 'visible',
    width: 100,
    valueType: 'tag',
    valueEnum: { true: { text: 'Show', color: 'blue' }, false: { text: 'Hide', color: 'default' } },
  },
  { title: 'Sort', dataIndex: 'sort', width: 90 },
  { title: 'Actions', dataIndex: 'action', width: 260, fixed: 'right', actions: [...] },
])
```

### 4. Create/Edit Form

The form uses `I18nInput` for multi-language names and `IconPicker` for icons:

```vue
<a-modal v-model:open="modalVisible" :title="modalTitle" width="760px" @ok="handleSubmit">
  <ProForm
    ref="formRef"
    :form-items="formItems"
    :grid="{ cols: 2, gutter: 16 }"
    :layout="{ layout: 'vertical' }"
    @values-change="handleFormValuesChange"
  />
</a-modal>
```

Fields like `path`, `component`, `icon`, `sort` are conditionally hidden when `type !== 'menu'`.

## Data Structure

```typescript
interface Permission {
  id: string;
  name: LocalizedText | string;
  code: string;
  type: 'menu' | 'button' | 'api';
  parentId?: string;
  path?: string;
  component?: string;
  icon?: string;
  sort: number;
  status: 'active' | 'inactive';
  visible: boolean;
  resource?: string;
  action?: string;
  description?: string;
  children?: Permission[];
}
```

## Notes

1. **API type**: permissions can be `menu`, `button`, or `api`
2. **I18n name**: uses `I18nInput` component with `LocalizedText` type
3. **Dynamic fields**: `path`, `component`, `icon`, `sort` only show for `menu` type
4. **Auto-derive resource/action**: on submit, `resource` and `action` are computed from the code/path

## Related Docs

- [Permission System](/en/guide/permission)
- [Role Management](/en/guide/system-role)