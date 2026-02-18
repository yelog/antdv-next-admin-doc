# ProStatus

## Overview

`ProStatus` is a lightweight status indicator component that unifies scattered status tag styles (dot/tag/badge) across the project. It maps status values to display via a configurable `statusMap`.

## Basic Usage

```vue
<script setup lang="ts">
import ProStatus from '@/components/Pro/ProStatus/index.vue'
import type { ProStatusMap } from '@/types/pro'

const statusMap: ProStatusMap = {
  enabled: { text: 'Enabled', color: '#52c41a' },
  disabled: { text: 'Disabled', color: '#bfbfbf' },
}
</script>

<template>
  <ProStatus value="enabled" :status-map="statusMap" />
  <ProStatus value="disabled" :status-map="statusMap" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number` | — | Status value, required |
| `statusMap` | `ProStatusMap` | — | Status mapping configuration, required |
| `mode` | `'dot' \| 'tag' \| 'badge'` | `'dot'` | Display mode |

## ProStatusMap

```typescript
interface ProStatusMap {
  [key: string]: {
    text: string    // Display text
    color: string   // Color value (supports hex and CSS color names)
    icon?: any      // Optional icon
  }
}
```

## Display Modes

### dot mode (default)

A capsule label with a colored dot, suitable for status display in tables and description lists.

```vue
<ProStatus value="active" :status-map="map" mode="dot" />
```

### tag mode

Renders using Ant Design's `a-tag`, suitable for scenarios needing stronger visual weight.

```vue
<ProStatus value="active" :status-map="map" mode="tag" />
```

### badge mode

Renders using Ant Design's `a-badge`, suitable for list item status.

```vue
<ProStatus value="active" :status-map="map" mode="badge" />
```

## Common Status Map Examples

```typescript
// Enabled/Disabled
const enabledMap: ProStatusMap = {
  enabled: { text: 'Enabled', color: '#52c41a' },
  disabled: { text: 'Disabled', color: '#bfbfbf' },
}

// Success/Fail
const resultMap: ProStatusMap = {
  success: { text: 'Success', color: '#52c41a' },
  fail: { text: 'Failed', color: '#ff4d4f' },
}

// Ticket status
const ticketMap: ProStatusMap = {
  open: { text: 'Open', color: '#1677ff' },
  processing: { text: 'Processing', color: '#faad14' },
  closed: { text: 'Closed', color: '#bfbfbf' },
}
```
