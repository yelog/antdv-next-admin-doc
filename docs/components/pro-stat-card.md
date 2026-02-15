# ProStatCard 统计卡片

## 概述

`ProStatCard` 是统计卡片组件，用于展示关键指标数据。提供标签、数值、趋势、图标水印等元素，支持 6 种色调预设，内置 hover 动效。

## 基本用法

```vue
<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
import ProStatCard from '@/components/Pro/ProStatCard/index.vue'
</script>

<template>
  <ProStatCard
    label="总用户数"
    value="12,458"
    trend="+12.5%"
    :icon="UserOutlined"
    tone="blue"
  />
</template>
```

## 多卡片网格

```vue
<script setup lang="ts">
import { UserOutlined, ShoppingOutlined, DollarOutlined, RiseOutlined } from '@antdv-next/icons'
import ProStatCard from '@/components/Pro/ProStatCard/index.vue'

const cards = [
  { key: 'users', label: '总用户数', value: '12,458', trend: '+12.5%', icon: UserOutlined, tone: 'blue' as const },
  { key: 'orders', label: '总订单数', value: '8,946', trend: '+8.2%', icon: ShoppingOutlined, tone: 'green' as const },
  { key: 'revenue', label: '总收入', value: '¥456,789', trend: '+15.3%', icon: DollarOutlined, tone: 'orange' as const },
  { key: 'conversion', label: '转化率', value: '3.24%', trend: '+0.8%', icon: RiseOutlined, tone: 'purple' as const },
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

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 指标标签 |
| `value` | `string \| number` | — | 指标数值 |
| `trend` | `string` | — | 趋势文案，如 `+12.5%` |
| `trendDirection` | `'up' \| 'down'` | `'up'` | 趋势方向，控制颜色和图标 |
| `icon` | `Component` | — | 水印图标组件 |
| `tone` | `'blue' \| 'green' \| 'orange' \| 'purple' \| 'red' \| 'cyan'` | `'blue'` | 色调预设 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `extra` | 额外内容区域 |
