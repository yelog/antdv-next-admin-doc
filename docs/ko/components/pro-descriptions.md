# ProDescriptions

## Overview

`ProDescriptions` is a configuration-driven description list component based on Ant Design Vue Descriptions. It supports automatic data rendering through column configuration and reuses ProTable's `ValueTypeRender` for consistent value type display.

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProDescriptions from '@/components/Pro/ProDescriptions/index.vue'
import type { ProDescriptionItem } from '@/types/pro'

const columns: ProDescriptionItem[] = [
  { label: 'Username', dataIndex: 'username' },
  { label: 'Email', dataIndex: 'email' },
  { label: 'Created At', dataIndex: 'createTime', valueType: 'dateTime' },
  { label: 'Status', dataIndex: 'status', valueType: 'tag', valueEnum: {
    active: { text: 'Active', color: 'green' },
    inactive: { text: 'Inactive', color: 'red' },
  }},
  { label: 'Remark', dataIndex: 'remark', span: 2 },
]

const data = ref({
  username: 'admin',
  email: 'admin@example.com',
  createTime: '2024-01-01 12:00:00',
  status: 'active',
  remark: 'System administrator',
})
</script>

<template>
  <ProDescriptions :columns="columns" :data="data" :column="2" bordered />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `ProDescriptionItem[]` | — | Column configuration, required |
| `data` | `Record<string, any>` | — | Data object, required |
| `column` | `number` | `2` | Number of description items per row |
| `bordered` | `boolean` | `false` | Show borders |
| `size` | `'default' \| 'middle' \| 'small'` | `'default'` | Size |
| `title` | `string` | — | Description list title |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |

## ProDescriptionItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Label text |
| `dataIndex` | `string` | — | Data field name, supports nested paths (e.g., `'user.name'`) |
| `valueType` | `ValueType` | — | Value type, reuses ProTable's value type rendering |
| `valueEnum` | `Record<string, { text: string; status?: string; color?: string }>` | — | Enum configuration |
| `valueTypeProps` | `Record<string, any>` | — | Extra props passed to ValueTypeRender |
| `span` | `number` | — | Number of columns this item spans |
| `render` | `(value: any, record: any) => any` | — | Custom render function |
| `copyable` | `boolean` | `false` | Whether the value is copyable |

## ValueType Support

`ProDescriptions` reuses ProTable's `ValueTypeRender` and supports the following value types:

- `text` — Plain text
- `date` / `dateTime` — Date / DateTime
- `tag` — Tag
- `badge` — Badge
- `money` — Currency
- `percent` — Percentage
- `avatar` — Avatar
- `image` — Image
- `link` — Link
- `progress` — Progress bar

## Custom Rendering

```typescript
const columns: ProDescriptionItem[] = [
  {
    label: 'Amount',
    dataIndex: 'amount',
    valueType: 'money',
    valueTypeProps: { symbol: '$', precision: 2 }
  },
  {
    label: 'Operator',
    dataIndex: 'operator',
    render: (value) => h('strong', value)
  },
]
```
