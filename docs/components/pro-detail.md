# ProDetail 详情页脚手架

## 概述

`ProDetail` 是详情页脚手架组件，提供标题区（标题 + 副标题 + 标签 + 额外操作） → 描述列表 → 标签页三段式布局。内部使用 `ProDescriptions` 渲染描述区域，通过具名插槽提供各标签页的内容。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProDetail from '@/components/Pro/ProDetail/index.vue'
import type { ProDescriptionItem, ProDetailTab } from '@/types/pro'

const descriptions: ProDescriptionItem[] = [
  { label: '标题', dataIndex: 'title' },
  { label: '负责人', dataIndex: 'owner' },
  { label: '创建时间', dataIndex: 'createdAt' },
]

const tabs: ProDetailTab[] = [
  { key: 'detail', label: '详情' },
  { key: 'logs', label: '操作记录' },
]

const data = ref({
  title: '工单 #001',
  owner: '张三',
  createdAt: '2024-01-01 12:00:00',
})
</script>

<template>
  <ProDetail
    title="#001"
    sub-title="工单编号"
    :tags="[{ text: '处理中', color: 'blue' }]"
    :descriptions="descriptions"
    :data="data"
    :tabs="tabs"
  >
    <template #tab-detail>
      <p>详情内容</p>
    </template>
    <template #tab-logs>
      <p>操作记录</p>
    </template>
  </ProDetail>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题 |
| `subTitle` | `string` | — | 副标题 |
| `tags` | `Array<{ text: string; color?: string }>` | — | 标签列表 |
| `descriptions` | `ProDescriptionItem[]` | — | 描述列表配置 |
| `data` | `Record<string, any>` | — | 数据对象 |
| `descriptionColumn` | `number` | `2` | 描述列表每行列数 |
| `tabs` | `ProDetailTab[]` | — | 标签页配置 |
| `activeTab` | `string` | — | 当前激活标签页（v-model） |

## ProDetailTab

```typescript
interface ProDetailTab {
  key: string    // 标签页唯一标识，对应插槽名 #tab-{key}
  label: string  // 标签页标题
}
```

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `extra` | 标题栏右侧的额外内容（如操作按钮） |
| `tab-{key}` | 各标签页的内容，key 对应 `ProDetailTab.key` |
| `default` | 当没有配置 tabs 时的默认内容 |

## Events

| 事件 | 说明 |
| --- | --- |
| `update:activeTab` | 标签页切换 |
