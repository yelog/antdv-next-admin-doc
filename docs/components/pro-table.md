# ProTable 高级表格

## 概述

`ProTable` 是一个配置化驱动的高级表格组件，在 Ant Design Vue Table 基础上封装了搜索表单、工具栏、分页、列类型渲染等功能，大幅减少样板代码。

## 基本用法

```vue
<script setup lang="ts">
import ProTable from '@/components/Pro/ProTable/index.vue'
import type { ProTableColumn, ProTableRequest } from '@/types/pro'

const columns: ProTableColumn[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    search: true,
    searchType: 'input',
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'tag',
    valueEnum: {
      active: { text: '启用', color: 'green' },
      inactive: { text: '禁用', color: 'red' },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateTime',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    actions: [
      { label: '编辑', onClick: (record) => handleEdit(record) },
      { label: '删除', danger: true, confirm: '确认删除？', onClick: (record) => handleDelete(record) },
    ],
  },
]

const request: ProTableRequest = async (params) => {
  const res = await fetchUsers(params)
  return { data: res.list, total: res.total, success: true }
}
</script>

<template>
  <ProTable :columns="columns" :request="request" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `ProTableColumn[]` | 必填 | 列配置 |
| `request` | `ProTableRequest` | 必填 | 数据请求函数 |
| `toolbar` | `ProTableToolbar` | — | 工具栏配置 |
| `search` | `ProTableSearch \| false` | — | 搜索表单配置，`false` 隐藏 |
| `headerFilter` | `ProTableHeaderFilterConfig` | — | 表头筛选全局配置 |
| `pagination` | `ProTablePagination \| false` | 默认分页 | 分页配置，`false` 隐藏 |
| `rowKey` | `string \| ((record) => string)` | `'id'` | 行唯一标识 |
| `size` | `'large' \| 'middle' \| 'small'` | `'small'` | 表格密度 |
| `height` | `number \| string \| 'auto'` | `'auto'` | 表格高度 |
| `resizable` | `boolean` | `true` | 行是否可调整 |
| `columnResizable` | `boolean` | `true` | 列宽是否可拖拽调整 |
| `ellipsis` | `boolean` | `true` | 文本溢出省略 |
| `bordered` | `boolean` | `true` | 是否显示边框 |
| `fixedHeader` | `boolean` | `true` | 是否固定表头 |

## ProTableColumn

列配置接口，定义每一列的渲染、搜索和交互行为：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 列标题 |
| `dataIndex` | `string` | 数据字段名 |
| `key` | `string` | 可选唯一标识 |
| `width` | `number \| string` | 列宽 |
| `minWidth` | `number \| string` | 最小列宽 |
| `fixed` | `'left' \| 'right'` | 固定列位置 |
| `align` | `'left' \| 'center' \| 'right'` | 文本对齐 |
| `ellipsis` | `boolean` | 文本溢出省略 |
| `resizable` | `boolean` | 该列是否可拖拽调整宽度 |
| `hideInTable` | `boolean` | 是否在表格中隐藏 |
| `valueType` | `ValueType` | 渲染类型 |
| `valueEnum` | `Record<string, { text, status?, color? }>` | 枚举映射 |
| `copyable` | `boolean` | 是否可复制 |
| `search` | `boolean` | 是否生成搜索字段 |
| `searchType` | `SearchType` | 搜索字段类型 |
| `searchOptions` | `Array<{ label, value }>` | 搜索下拉选项 |
| `searchProps` | `Record<string, any>` | 搜索字段额外属性 |
| `headerFilter` | `ProTableHeaderFilter` | 表头筛选配置 |
| `sorter` | `boolean \| ((a, b) => number)` | 排序 |
| `defaultSortOrder` | `'ascend' \| 'descend'` | 默认排序方向 |
| `actions` | `ProTableAction[]` | 操作列按钮 |
| `render` | `(text, record, index) => any` | 自定义渲染函数 |

## ValueType 渲染类型

| 类型 | 说明 | 示例 |
| --- | --- | --- |
| `text` | 纯文本（默认） | `Hello` |
| `date` | 日期 | `2024-01-15` |
| `dateTime` | 日期时间 | `2024-01-15 14:30:00` |
| `dateRange` | 日期范围 | — |
| `time` | 时间 | `14:30:00` |
| `tag` | 标签（配合 `valueEnum` 使用） | <span style="color: green">启用</span> |
| `badge` | 徽章（配合 `valueEnum` 使用） | — |
| `money` | 金额（带 ¥ 和千分位） | `¥12,345.00` |
| `percent` | 百分比 | `85.50%` |
| `avatar` | 头像（32px 圆形） | — |
| `image` | 图片（80px 宽） | — |
| `link` | 链接 | — |
| `progress` | 进度条 | — |

## SearchType 搜索类型

| 类型 | 说明 |
| --- | --- |
| `input` | 文本输入框 |
| `select` | 下拉选择（需配合 `searchOptions` 或 `valueEnum`） |
| `dateRange` | 日期范围选择器 |
| `datePicker` | 日期选择器 |
| `number` | 数字输入框 |
| `checkbox` | 复选框 |
| `radio` | 单选框 |

## ProTableAction 操作列

操作列用于定义行级操作按钮：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `string` | 按钮文本 |
| `type` | `'link' \| 'button' \| 'dropdown'` | 按钮类型 |
| `icon` | `any` | 按钮图标 |
| `permission` | `string` | 所需权限码 |
| `danger` | `boolean` | 是否为危险操作 |
| `disabled` | `(record) => boolean` | 是否禁用 |
| `hidden` | `(record) => boolean` | 是否隐藏 |
| `confirm` | `string` | 确认提示文本（显示确认弹窗） |
| `onClick` | `(record) => void \| Promise<void>` | 点击回调 |
| `items` | `ProTableAction[]` | 下拉菜单子项（type 为 dropdown 时） |

```typescript
actions: [
  {
    label: '编辑',
    permission: 'user.edit',
    onClick: (record) => openEditModal(record),
  },
  {
    label: '更多',
    type: 'dropdown',
    items: [
      { label: '重置密码', onClick: (record) => resetPassword(record) },
      { label: '删除', danger: true, confirm: '确认删除？', onClick: (record) => deleteUser(record) },
    ],
  },
]
```

## ProTableHeaderFilter 表头筛选

支持列级表头筛选，提供关键字搜索和下拉选择两种类型：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `'keyword' \| 'select'` | 筛选类型 |
| `mode` | `'client' \| 'server' \| 'hybrid'` | 筛选模式 |
| `icon` | `'search' \| 'filter'` | 图标类型 |
| `paramKey` | `string` | 服务端参数名 |
| `placeholder` | `string` | 占位文本 |
| `multiple` | `boolean` | 是否多选（select 类型） |
| `options` | `Array<{ label, value }>` | 下拉选项（select 类型） |

筛选模式说明：
- **client** — 前端过滤，不发请求
- **server** — 服务端过滤，筛选参数随请求发送
- **hybrid** — 先发请求获取数据，再进行前端过滤

## Toolbar 工具栏

```typescript
const toolbar: ProTableToolbar = {
  title: '用户列表',
  subTitle: '管理系统用户',
  // 隐藏默认工具按钮前加 !
  actions: ['!density'],  // 隐藏密度切换
}
```

内置工具：
- **刷新** — 重新加载数据
- **密度** — 切换表格密度（large/middle/small）
- **列设置** — 列显示/隐藏、排序、固定

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `toolbar-actions` | 工具栏右侧自定义操作区域 |
| `bodyCell` | 自定义单元格渲染 |

## 暴露方法

| 方法 | 说明 |
| --- | --- |
| `refresh()` | 使用当前参数重新加载数据 |
| `reload()` | 重置分页到第一页并重新加载 |

```vue
<script setup lang="ts">
const tableRef = ref()

// 刷新数据
tableRef.value?.refresh()

// 重置并刷新
tableRef.value?.reload()
</script>

<template>
  <ProTable ref="tableRef" :columns="columns" :request="request" />
</template>
```

## ProTableRequest

数据请求函数的类型定义：

```typescript
interface ProTableRequest {
  (params: Record<string, any>): Promise<{
    data: any[]      // 数据列表
    total?: number   // 总条数（用于分页）
    success: boolean // 请求是否成功
  }>
}
```

`params` 参数包含分页信息和搜索表单的值：

```typescript
{
  current: 1,       // 当前页码
  pageSize: 10,     // 每页条数
  name: '张三',     // 搜索字段值
  status: 'active', // 搜索字段值
}
```
