# ProStatus 状态指示器

## 概述

`ProStatus` 是一个轻量级状态指示器组件，统一了项目中分散的状态标签样式（dot/tag/badge），通过配置化的 `statusMap` 实现状态值到展示的映射。

## 基本用法

```vue
<script setup lang="ts">
import ProStatus from '@/components/Pro/ProStatus/index.vue'
import type { ProStatusMap } from '@/types/pro'

const statusMap: ProStatusMap = {
  enabled: { text: '启用', color: '#52c41a' },
  disabled: { text: '禁用', color: '#bfbfbf' },
}
</script>

<template>
  <ProStatus value="enabled" :status-map="statusMap" />
  <ProStatus value="disabled" :status-map="statusMap" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string \| number` | — | 状态值，必填 |
| `statusMap` | `ProStatusMap` | — | 状态映射配置，必填 |
| `mode` | `'dot' \| 'tag' \| 'badge'` | `'dot'` | 展示模式 |

## ProStatusMap

```typescript
interface ProStatusMap {
  [key: string]: {
    text: string    // 显示文本
    color: string   // 颜色值（支持 hex 和 CSS 颜色名）
    icon?: any      // 可选图标
  }
}
```

## 展示模式

### dot 模式（默认）

带有彩色小圆点的胶囊标签，适用于表格和描述列表中的状态展示。

```vue
<ProStatus value="active" :status-map="map" mode="dot" />
```

### tag 模式

使用 Ant Design 的 `a-tag` 渲染，适用于需要更强视觉权重的场景。

```vue
<ProStatus value="active" :status-map="map" mode="tag" />
```

### badge 模式

使用 Ant Design 的 `a-badge` 渲染，适用于列表项状态。

```vue
<ProStatus value="active" :status-map="map" mode="badge" />
```

## 常见状态映射示例

```typescript
// 启用/禁用
const enabledMap: ProStatusMap = {
  enabled: { text: '启用', color: '#52c41a' },
  disabled: { text: '禁用', color: '#bfbfbf' },
}

// 成功/失败
const resultMap: ProStatusMap = {
  success: { text: '成功', color: '#52c41a' },
  fail: { text: '失败', color: '#ff4d4f' },
}

// 工单状态
const ticketMap: ProStatusMap = {
  open: { text: '待处理', color: '#1677ff' },
  processing: { text: '处理中', color: '#faad14' },
  closed: { text: '已关闭', color: '#bfbfbf' },
}
```
