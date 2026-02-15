# ProStatCard

## Overview

`ProStatCard` is a statistics card component for displaying key metric data. It provides label, value, trend, icon watermark elements with 6 tone presets and built-in hover animation.

## Basic Usage

```vue
<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
import ProStatCard from '@/components/Pro/ProStatCard/index.vue'
</script>

<template>
  <ProStatCard
    label="Total Users"
    value="12,458"
    trend="+12.5%"
    :icon="UserOutlined"
    tone="blue"
  />
</template>
```

## Multi-Card Grid

```vue
<script setup lang="ts">
import { UserOutlined, ShoppingOutlined, DollarOutlined, RiseOutlined } from '@antdv-next/icons'
import ProStatCard from '@/components/Pro/ProStatCard/index.vue'

const cards = [
  { key: 'users', label: 'Total Users', value: '12,458', trend: '+12.5%', icon: UserOutlined, tone: 'blue' as const },
  { key: 'orders', label: 'Total Orders', value: '8,946', trend: '+8.2%', icon: ShoppingOutlined, tone: 'green' as const },
  { key: 'revenue', label: 'Revenue', value: '$456,789', trend: '+15.3%', icon: DollarOutlined, tone: 'orange' as const },
  { key: 'conversion', label: 'Conversion', value: '3.24%', trend: '+0.8%', icon: RiseOutlined, tone: 'purple' as const },
]
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
    <ProStatCard
      v-for="card in cards"
      :key="card.key"
      :label="card.label"
      :value="card.value"
      :trend="card.trend"
      :icon="card.icon"
      :tone="card.tone"
    />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Metric label |
| `value` | `string \| number` | — | Metric value |
| `trend` | `string` | — | Trend text, e.g. `+12.5%` |
| `trendDirection` | `'up' \| 'down'` | `'up'` | Trend direction, controls color and icon |
| `icon` | `Component` | — | Watermark icon component |
| `tone` | `'blue' \| 'green' \| 'orange' \| 'purple' \| 'red' \| 'cyan'` | `'blue'` | Color tone preset |

## Slots

| Slot | Description |
| --- | --- |
| `extra` | Extra content area |
