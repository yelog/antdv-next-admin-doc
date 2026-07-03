# System Configuration Module

## Overview

System configuration manages site-level parameters such as switches, thresholds, and defaults.

- Route: `/system/config`
- View: `src/views/system/config/index.vue`
- Permission: `system.config.view`
- API: `src/api/config.ts`

## Core Capabilities

### 1. Split Layout: Group Menu + Config Table

Uses `ProSplitLayout` with a group menu on the left and a `ProTable` on the right:

```vue
<template>
  <ProSplitLayout :side-width="200">
    <template #side>
      <a-menu mode="inline" :items="menuItems" @click="handleMenuClick" />
    </template>
    <template #main>
      <ProTable :key="selectedGroup + refreshKey" :columns="columns" :request="loadConfigList" :search="false" />
    </template>
  </ProSplitLayout>
</template>
```

### 2. Predefined Groups

```typescript
const groups = ['basic', 'security', 'upload', 'notification']
```

### 3. Columns

```typescript
const columns: ProTableColumn[] = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 160 },
  { title: 'Key', dataIndex: 'key', key: 'key', width: 200 },
  { title: 'Value', dataIndex: 'value', key: 'value', ellipsis: true },
  { title: 'Value Type', dataIndex: 'valueType', key: 'valueType', width: 90 },
  { title: 'Built-in', dataIndex: 'builtIn', key: 'builtIn', width: 90 },
  { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: 'Actions', dataIndex: 'action', key: 'action', width: 150, fixed: 'right' },
]
```

## Data Structure

```typescript
interface SysConfig {
  id: string;
  name: string;
  key: string;          // unique key
  value: string;        // stored as string
  valueType: 'string' | 'number' | 'boolean' | 'json';
  group: string;
  builtIn: boolean;     // built-in entries cannot be deleted
  sort: number;
  description?: string;
}
```

## Value Type Rendering

| valueType | Widget | Storage |
|-----------|--------|---------|
| `string` | `a-input` | raw string |
| `number` | `a-input-number` | numeric string |
| `boolean` | `a-switch` | `'true'` / `'false'` |
| `json` | `a-textarea` | JSON string |

## Notes

1. **Built-in protection**: built-in configs (`builtIn: true`) cannot be deleted; `key` and `valueType` are immutable on edit
2. **Refresh**: CRUD operations increment `refreshKey` to force ProTable re-mount
3. **Group counts**: all configs are loaded separately to calculate per-group counts

## Related Docs

- [ProSplitLayout](/en/components/pro-split-layout)
- [API Integration](/en/guide/api-integration)