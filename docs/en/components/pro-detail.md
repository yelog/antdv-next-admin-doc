# ProDetail

## Overview

`ProDetail` is a detail page scaffold component providing a three-section layout: header (title + subtitle + tags + extra actions) → description list → tabbed content. It uses `ProDescriptions` internally and provides named slots for each tab.

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProDetail from '@/components/Pro/ProDetail/index.vue'
import type { ProDescriptionItem, ProDetailTab } from '@/types/pro'

const descriptions: ProDescriptionItem[] = [
  { label: 'Title', dataIndex: 'title' },
  { label: 'Owner', dataIndex: 'owner' },
  { label: 'Created At', dataIndex: 'createdAt' },
]

const tabs: ProDetailTab[] = [
  { key: 'detail', label: 'Details' },
  { key: 'logs', label: 'Activity Log' },
]

const data = ref({
  title: 'Ticket #001',
  owner: 'John',
  createdAt: '2024-01-01 12:00:00',
})
</script>

<template>
  <ProDetail
    title="#001"
    sub-title="Ticket Number"
    :tags="[{ text: 'Processing', color: 'blue' }]"
    :descriptions="descriptions"
    :data="data"
    :tabs="tabs"
  >
    <template #tab-detail>
      <p>Detail content</p>
    </template>
    <template #tab-logs>
      <p>Activity log</p>
    </template>
  </ProDetail>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Title |
| `subTitle` | `string` | — | Subtitle |
| `tags` | `Array<{ text: string; color?: string }>` | — | Tag list |
| `descriptions` | `ProDescriptionItem[]` | — | Description list configuration |
| `data` | `Record<string, any>` | — | Data object |
| `descriptionColumn` | `number` | `2` | Number of columns per row in descriptions |
| `tabs` | `ProDetailTab[]` | — | Tab configuration |
| `activeTab` | `string` | — | Active tab key (v-model) |

## ProDetailTab

```typescript
interface ProDetailTab {
  key: string    // Unique tab identifier, maps to slot #tab-{key}
  label: string  // Tab title
}
```

## Slots

| Slot | Description |
| --- | --- |
| `extra` | Extra content on the right side of the header (e.g., action buttons) |
| `tab-{key}` | Content for each tab, where key maps to `ProDetailTab.key` |
| `default` | Default content when no tabs are configured |

## Events

| Event | Description |
| --- | --- |
| `update:activeTab` | Tab switched |
