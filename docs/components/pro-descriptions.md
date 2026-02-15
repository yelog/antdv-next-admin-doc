# ProDescriptions 描述列表

## 概述

`ProDescriptions` 是基于 Ant Design Vue Descriptions 的配置化描述列表组件，支持通过列配置自动渲染数据，并复用 ProTable 的 `ValueTypeRender` 实现统一的值类型展示。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProDescriptions from '@/components/Pro/ProDescriptions/index.vue'
import type { ProDescriptionItem } from '@/types/pro'

const columns: ProDescriptionItem[] = [
  { label: '用户名', dataIndex: 'username' },
  { label: '邮箱', dataIndex: 'email' },
  { label: '创建时间', dataIndex: 'createTime', valueType: 'dateTime' },
  { label: '状态', dataIndex: 'status', valueType: 'tag', valueEnum: {
    active: { text: '启用', color: 'green' },
    inactive: { text: '禁用', color: 'red' },
  }},
  { label: '备注', dataIndex: 'remark', span: 2 },
]

const data = ref({
  username: 'admin',
  email: 'admin@example.com',
  createTime: '2024-01-01 12:00:00',
  status: 'active',
  remark: '系统管理员',
})
</script>

<template>
  <ProDescriptions :columns="columns" :data="data" :column="2" bordered />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `ProDescriptionItem[]` | — | 列配置，必填 |
| `data` | `Record<string, any>` | — | 数据对象，必填 |
| `column` | `number` | `2` | 每行显示的描述项数量 |
| `bordered` | `boolean` | `false` | 是否显示边框 |
| `size` | `'default' \| 'middle' \| 'small'` | `'default'` | 尺寸 |
| `title` | `string` | — | 描述列表标题 |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 布局方向 |

## ProDescriptionItem

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 标签文本 |
| `dataIndex` | `string` | — | 数据字段名，支持嵌套路径（如 `'user.name'`） |
| `valueType` | `ValueType` | — | 值类型，复用 ProTable 的值类型渲染 |
| `valueEnum` | `Record<string, { text: string; status?: string; color?: string }>` | — | 枚举配置 |
| `valueTypeProps` | `Record<string, any>` | — | 传递给 ValueTypeRender 的额外属性 |
| `span` | `number` | — | 该项占用的列数 |
| `render` | `(value: any, record: any) => any` | — | 自定义渲染函数 |
| `copyable` | `boolean` | `false` | 是否可复制 |

## ValueType 支持

`ProDescriptions` 复用 ProTable 的 `ValueTypeRender`，支持以下值类型：

- `text` — 纯文本
- `date` / `dateTime` — 日期/日期时间
- `tag` — 标签
- `badge` — 徽标
- `money` — 金额
- `percent` — 百分比
- `avatar` — 头像
- `image` — 图片
- `link` — 链接
- `progress` — 进度条

## 自定义渲染

```typescript
const columns: ProDescriptionItem[] = [
  {
    label: '金额',
    dataIndex: 'amount',
    valueType: 'money',
    valueTypeProps: { symbol: '$', precision: 2 }
  },
  {
    label: '操作人',
    dataIndex: 'operator',
    render: (value) => h('strong', value)
  },
]
```
