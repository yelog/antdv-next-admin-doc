# ProChart

## Overview

`ProChart` is a chart card component based on `vue-echarts`. It supports quickly creating common charts (bar, line, pie, donut, area, radar) via simple `type` + `data` configuration, and automatically syncs with the theme store for dark/light mode switching.

## Basic Usage

```vue
<script setup lang="ts">
import ProChart from '@/components/Pro/ProChart/index.vue'

const barData = [
  { name: 'Jan', value: 340 },
  { name: 'Feb', value: 480 },
  { name: 'Mar', value: 440 },
  { name: 'Apr', value: 620 },
]
</script>

<template>
  <ProChart type="bar" title="Monthly Sales" :data="barData" :height="300" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'line' \| 'bar' \| 'pie' \| 'donut' \| 'area' \| 'radar'` | — | Chart type, required |
| `data` | `any[]` | — | Data array, required |
| `height` | `number \| string` | `300` | Chart area height |
| `title` | `string` | — | Card title |
| `subTitle` | `string` | — | Subtitle |
| `loading` | `boolean` | `false` | Loading state |
| `option` | `Record<string, any>` | — | ECharts option override for advanced customization |

## Data Formats

### Bar / Line / Area

```typescript
const data = [
  { name: 'Category 1', value: 100 },
  { name: 'Category 2', value: 200 },
]
```

### Pie / Donut

```typescript
const data = [
  { name: 'New Users', value: 46 },
  { name: 'Returning Users', value: 34 },
  { name: 'Enterprise Users', value: 20 },
]
```

### Radar

```typescript
const data = [
  { name: 'Sales', value: 80, max: 100 },
  { name: 'Management', value: 60, max: 100 },
  { name: 'Technology', value: 90, max: 100 },
]
```

## Slots

| Slot | Description |
| --- | --- |
| `extra` | Extra content on the right side of the title bar |

## Theme Sync

ProChart automatically watches `themeStore.isDark` and updates the ECharts theme when switching between dark and light modes.

## Advanced Customization

Use the `option` prop to override the auto-generated ECharts configuration:

```vue
<ProChart
  type="bar"
  :data="data"
  :option="{
    series: [{ itemStyle: { borderRadius: [4, 4, 0, 0] } }]
  }"
/>
```
