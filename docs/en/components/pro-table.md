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
    searchType: 'input',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    valueType: 'tag',
    valueEnum: {
      active: { text: 'Active', color: 'green' },
      inactive: { text: 'Inactive', color: 'red' },
    },
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
| `searchType` | `SearchType` | Search field type |
| `searchOptions` | `Array<{ label, value }>` | Search select options |
| `searchProps` | `Record<string, any>` | Extra search field props |
| `headerFilter` | `ProTableHeaderFilter` | Header filter config |
| `sorter` | `boolean \| ((a, b) => number)` | Enable sorting |
| `defaultSortOrder` | `'ascend' \| 'descend'` | Default sort direction |
| `actions` | `ProTableAction[]` | Action column buttons |
| `render` | `(text, record, index) => any` | Custom render function |

## ValueType

| Type | Description | Example |
| --- | --- | --- |
| `text` | Plain text (default) | `Hello` |
| `date` | Date | `2024-01-15` |
| `dateTime` | Date and time | `2024-01-15 14:30:00` |
| `dateRange` | Date range | — |
| `time` | Time | `14:30:00` |
| `tag` | Tag (use with `valueEnum`) | — |
| `badge` | Badge (use with `valueEnum`) | — |
| `money` | Currency (with symbol and formatting) | `¥12,345.00` |
| `percent` | Percentage | `85.50%` |
| `avatar` | Avatar (32px circle) | — |
| `image` | Image (80px width) | — |
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

## Slots

| Slot | Description |
| --- | --- |
| `toolbar-actions` | Custom actions area on toolbar right side |
| `bodyCell` | Custom cell rendering |

## Exposed Methods

| Method | Description |
| --- | --- |
| `refresh()` | Reload data with current params |
| `reload()` | Reset pagination and reload |

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
