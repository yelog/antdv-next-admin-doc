# ProTable

## Overview

`ProTable` is a configuration-driven advanced table component built on top of Ant Design Vue Table, with built-in search form, toolbar, pagination, and value type rendering — significantly reducing boilerplate code.

## Basic Usage

```vue
<script setup lang="ts">
import ProTable from '@/components/Pro/ProTable/index.vue'
import type { ProTableColumn, ProTableRequest } from '@/types/pro'

const columns: ProTableColumn[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    search: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    valueType: 'tag',
    search: true,
    options: [
      { label: 'Active', value: 'active', color: 'green' },
      { label: 'Inactive', value: 'inactive', color: 'red' },
    ],
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    valueType: 'dateTime',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    actions: [
      { label: 'Edit', onClick: (record) => handleEdit(record) },
      { label: 'Delete', danger: true, confirm: 'Are you sure?', onClick: (record) => handleDelete(record) },
    ],
  },
]

const request: ProTableRequest = async (params) => {
  const res = await fetchUsers(params)
  return { data: res.list, total: res.total, success: true }
}
</script>

<template>
  <ProTable :columns="columns" :request="request" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `ProTableColumn[]` | Required | Column definitions |
| `request` | `ProTableRequest` | Required | Data fetching function |
| `toolbar` | `ProTableToolbar` | — | Toolbar configuration |
| `search` | `ProTableSearch \| false` | — | Search form config, `false` to hide |
| `headerFilter` | `ProTableHeaderFilterConfig` | — | Header filter global config |
| `pagination` | `ProTablePagination \| false` | Default pagination | Pagination config, `false` to hide |
| `rowKey` | `string \| ((record) => string)` | `'id'` | Row unique key |
| `size` | `'large' \| 'middle' \| 'small'` | `'small'` | Table density |
| `height` | `number \| string \| 'auto'` | `'auto'` | Table height |
| `resizable` | `boolean` | `true` | Row resizable |
| `columnResizable` | `boolean` | `true` | Column width drag-resizable |
| `ellipsis` | `boolean` | `true` | Text overflow ellipsis |
| `bordered` | `boolean` | `true` | Show border |
| `fixedHeader` | `boolean` | `true` | Fixed header on scroll |
| `formItems` | `ProFormItem[]` | — | Form config for built-in CRUD modal |
| `formLayout` | `ProFormLayout` | — | CRUD modal form layout |
| `formGrid` | `ProFormGrid` | — | CRUD modal form grid |
| `formModalWidth` | `number \| string` | `640` | CRUD modal width |
| `formCreateTitle` | `string` | `'Add'` | Create modal title |
| `formEditTitle` | `string` | `'Edit'` | Edit modal title |

## ProTableColumn

Column configuration interface defining rendering, search, and interaction behavior:

| Property | Type | Description |
| --- | --- | --- |
| `title` | `string` | Column header text |
| `dataIndex` | `string` | Data field key |
| `key` | `string` | Optional unique key |
| `width` | `number \| string` | Column width |
| `minWidth` | `number \| string` | Minimum column width |
| `fixed` | `'left' \| 'right'` | Fixed column position |
| `align` | `'left' \| 'center' \| 'right'` | Text alignment |
| `ellipsis` | `boolean` | Text overflow ellipsis |
| `resizable` | `boolean` | Column drag-resizable |
| `hideInTable` | `boolean` | Hide column in table |
| `valueType` | `ValueType` | Render type |
| `valueEnum` | `Record<string, { text, status?, color? }>` | Enum mapping |
| `copyable` | `boolean` | Enable copy on click |
| `search` | `boolean` | Generate search field |
| `searchType` | `SearchType` | Search field type (auto-inferred from valueType if omitted) |
| `searchOptions` | `Array<{ label, value }>` | Search select options |
| `options` | `Array<{ label, value, color?, status?, disabled? }>` | Unified options — auto-derives `searchOptions` and `valueEnum` |
| `searchProps` | `Record<string, any>` | Extra search field props |
| `headerFilter` | `ProTableHeaderFilter` | Header filter config |
| `sorter` | `boolean \| ((a, b) => number)` | Enable sorting |
| `defaultSortOrder` | `'ascend' \| 'descend'` | Default sort direction |
| `actions` | `ProTableAction[]` | Action column buttons |
| `render` | `(text, record, index) => any` | Custom render function |
| `valueTypeProps` | `Record<string, any>` | Custom rendering params for ValueType (e.g. date format, currency symbol) |

## ValueType

| Type | Description | Example |
| --- | --- | --- |
| `text` | Plain text (default) | `Hello` |
| `date` | Date — customizable via valueTypeProps.format | `2024-01-15` |
| `dateTime` | Date and time — customizable via valueTypeProps.format | `2024-01-15 14:30:00` |
| `dateRange` | Date range | — |
| `time` | Time | `14:30:00` |
| `tag` | Tag (use with `valueEnum`) | — |
| `badge` | Badge (use with `valueEnum`) | — |
| `money` | Currency (with symbol and formatting) — customizable via valueTypeProps.symbol and precision | `¥12,345.00` |
| `percent` | Percentage — customizable via valueTypeProps.precision | `85.50%` |
| `avatar` | Avatar (32px circle) — customizable via valueTypeProps.size | — |
| `image` | Image (80px width) — customizable via valueTypeProps.width | — |
| `link` | Hyperlink | — |
| `progress` | Progress bar | — |

## SearchType

| Type | Description |
| --- | --- |
| `input` | Text input |
| `select` | Select dropdown (requires `searchOptions` or `valueEnum`) |
| `dateRange` | Date range picker |
| `datePicker` | Date picker |
| `number` | Number input |
| `checkbox` | Checkbox |
| `radio` | Radio |

## Unified Options

Use the `options` property to define column options once, automatically deriving both `valueEnum` (for rendering) and `searchOptions` (for search dropdowns):

```typescript
{
  title: 'Status',
  dataIndex: 'status',
  valueType: 'tag',
  search: true,
  options: [
    { label: 'Active', value: 'active', color: 'green' },
    { label: 'Inactive', value: 'inactive', color: 'red' },
  ],
}
```

This is equivalent to setting `valueEnum` + `searchOptions` separately, reducing configuration duplication. If both `options` and `valueEnum`/`searchOptions` are set, the latter takes precedence.

## valueTypeProps

Customize ValueType rendering with `valueTypeProps`:

```typescript
const columns: ProTableColumn[] = [
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    valueType: 'date',
    valueTypeProps: { format: 'YYYY/MM/DD' },
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    valueType: 'money',
    valueTypeProps: { symbol: '$', precision: 0 },
  },
  {
    title: 'Progress',
    dataIndex: 'progress',
    valueType: 'progress',
    valueTypeProps: { strokeColor: '#52c41a', showInfo: true },
  },
]
```

| ValueType | Available Props | Description |
| --- | --- | --- |
| `date` | `format` | Date format, default `'YYYY-MM-DD'` |
| `dateTime` | `format` | DateTime format, default `'YYYY-MM-DD HH:mm:ss'` |
| `money` | `symbol`, `precision` | Currency symbol (default `¥`) and decimal places (default `2`) |
| `percent` | `precision` | Decimal places (default `2`) |
| `avatar` | `size` | Avatar size (default `32`) |
| `image` | `width` | Image width (default `80`) |
| `progress` | All `a-progress` props | Passed through to progress component |

## ProTableAction

Define row-level action buttons:

| Property | Type | Description |
| --- | --- | --- |
| `label` | `string` | Button text |
| `type` | `'link' \| 'button' \| 'dropdown'` | Button type |
| `icon` | `any` | Button icon |
| `permission` | `string` | Required permission code |
| `danger` | `boolean` | Mark as dangerous action |
| `disabled` | `(record) => boolean` | Disable condition |
| `hidden` | `(record) => boolean` | Hide condition |
| `confirm` | `string` | Confirmation prompt (shows confirm dialog) |
| `onClick` | `(record) => void \| Promise<void>` | Click handler |
| `items` | `ProTableAction[]` | Dropdown items (when type is dropdown) |

```typescript
actions: [
  {
    label: 'Edit',
    permission: 'user.edit',
    onClick: (record) => openEditModal(record),
  },
  {
    label: 'More',
    type: 'dropdown',
    items: [
      { label: 'Reset Password', onClick: (record) => resetPassword(record) },
      { label: 'Delete', danger: true, confirm: 'Are you sure?', onClick: (record) => deleteUser(record) },
    ],
  },
]
```

## ProTableHeaderFilter

Column-level header filtering with keyword search and select types:

| Property | Type | Description |
| --- | --- | --- |
| `type` | `'keyword' \| 'select'` | Filter type |
| `mode` | `'client' \| 'server' \| 'hybrid'` | Filter mode |
| `icon` | `'search' \| 'filter'` | Icon type |
| `paramKey` | `string` | Server-side parameter name |
| `placeholder` | `string` | Placeholder text |
| `multiple` | `boolean` | Multi-select (for select type) |
| `options` | `Array<{ label, value }>` | Select options |

Filter modes:
- **client** — Client-side filtering, no request sent
- **server** — Server-side filtering, filter params included in request
- **hybrid** — Fetches data via request, then filters client-side

## Toolbar

```typescript
const toolbar: ProTableToolbar = {
  title: 'User List',
  subTitle: 'Manage system users',
  // Prefix with ! to hide default tools
  actions: ['!density'],  // Hide density switcher
}
```

Built-in tools:
- **Refresh** — Reload data
- **Density** — Toggle table density (large/middle/small)
- **Column Settings** — Column visibility, ordering, and pinning

## Events

| Event | Params | Description |
| --- | --- | --- |
| `refresh` | — | Triggered when refresh button is clicked |
| `form-submit` | `{ values, record, isEdit }` | Triggered when built-in form is submitted |

## Slots

| Slot | Description |
| --- | --- |
| `toolbar-actions` | Custom actions area on toolbar right side |
| `bodyCell` | Custom cell rendering |

## Built-in CRUD Modal

By configuring `formItems`, ProTable can embed a CRUD modal without manually managing ProModal + ProForm:

```vue
<script setup lang="ts">
import ProTable from '@/components/Pro/ProTable/index.vue'
import type { ProTableColumn, ProFormItem } from '@/types/pro'

const tableRef = ref()

const columns: ProTableColumn[] = [
  { title: 'Name', dataIndex: 'name', search: true },
  { title: 'Email', dataIndex: 'email' },
  {
    title: 'Actions',
    dataIndex: 'action',
    actions: [
      { label: 'Edit', onClick: (record) => tableRef.value?.openEditModal(record) },
    ],
  },
]

const formItems: ProFormItem[] = [
  { name: 'name', label: 'Name', type: 'input', required: true },
  { name: 'email', label: 'Email', type: 'input' },
]

const handleFormSubmit = async ({ values, record, isEdit }) => {
  if (isEdit) {
    await updateUser(record.id, values)
  } else {
    await createUser(values)
  }
  tableRef.value?.refresh()
}
</script>

<template>
  <ProTable
    ref="tableRef"
    :columns="columns"
    :request="request"
    :form-items="formItems"
    :form-grid="{ cols: 2 }"
    @form-submit="handleFormSubmit"
  >
    <template #toolbar-actions>
      <a-button type="primary" @click="tableRef?.openCreateModal()">Add</a-button>
    </template>
  </ProTable>
</template>
```

## Exposed Methods

| Method | Description |
| --- | --- |
| `refresh()` | Reload data with current params |
| `reload()` | Reset pagination and reload |
| `openCreateModal(initialValues?)` | Open the create modal |
| `openEditModal(record)` | Open the edit modal (auto-fills data) |

```vue
<script setup lang="ts">
const tableRef = ref()

// Refresh data
tableRef.value?.refresh()

// Reset and refresh
tableRef.value?.reload()
</script>

<template>
  <ProTable ref="tableRef" :columns="columns" :request="request" />
</template>
```

## ProTableRequest

Type definition for the data fetching function:

```typescript
interface ProTableRequest {
  (params: Record<string, any>): Promise<{
    data: any[]      // Data list
    total?: number   // Total count (for pagination)
    success: boolean // Whether the request succeeded
  }>
}
```

The `params` object includes pagination info and search form values:

```typescript
{
  current: 1,       // Current page
  pageSize: 10,     // Items per page
  name: 'John',     // Search field value
  status: 'active', // Search field value
}
```
