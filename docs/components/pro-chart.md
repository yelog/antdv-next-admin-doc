# ProChart 图表卡片

## 概述

`ProChart` 是基于 `vue-echarts` 的图表卡片组件，支持通过简单的 `type` + `data` 配置快速创建常见图表（柱状图、折线图、饼图、环形图、面积图、雷达图），并自动跟随主题切换暗色/亮色模式。

## 基本用法

```vue
<script setup lang="ts">
import ProChart from '@/components/Pro/ProChart/index.vue'

const barData = [
  { name: '1月', value: 340 },
  { name: '2月', value: 480 },
  { name: '3月', value: 440 },
  { name: '4月', value: 620 },
]
</script>

<template>
  <ProChart type="bar" title="月度销售" :data="barData" :height="300" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'line' \| 'bar' \| 'pie' \| 'donut' \| 'area' \| 'radar'` | — | 图表类型，必填 |
| `data` | `any[]` | — | 数据数组，必填 |
| `height` | `number \| string` | `300` | 图表区域高度 |
| `title` | `string` | — | 卡片标题 |
| `subTitle` | `string` | — | 副标题 |
| `loading` | `boolean` | `false` | 加载状态 |
| `option` | `Record<string, any>` | — | ECharts option 覆盖，用于高级自定义 |

## 数据格式

### 柱状图/折线图/面积图

```typescript
const data = [
  { name: '分类1', value: 100 },
  { name: '分类2', value: 200 },
]
```

### 饼图/环形图

```typescript
const data = [
  { name: '新增用户', value: 46 },
  { name: '回访用户', value: 34 },
  { name: '企业用户', value: 20 },
]
```

### 雷达图

```typescript
const data = [
  { name: '销售', value: 80, max: 100 },
  { name: '管理', value: 60, max: 100 },
  { name: '技术', value: 90, max: 100 },
]
```

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `extra` | 标题栏右侧的额外内容 |

## 主题同步

ProChart 自动监听 `themeStore.isDark`，在暗色/亮色模式间切换时自动更新 ECharts 主题。

## 高级自定义

通过 `option` prop 可以覆盖自动生成的 ECharts 配置：

```vue
<ProChart
  type="bar"
  :data="data"
  :option="{
    series: [{ itemStyle: { borderRadius: [4, 4, 0, 0] } }]
  }"
/>
```
