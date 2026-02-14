# ProForm 高级表单

## 概述

`ProForm` 是一个配置化驱动的高级表单组件，支持 20+ 字段类型、网格布局、表单验证和动态选项加载，通过 JSON 配置即可生成完整的表单。

## 基本用法

```vue
<script setup lang="ts">
import ProForm from '@/components/Pro/ProForm/index.vue'
import type { ProFormItem } from '@/types/pro'

const formItems: ProFormItem[] = [
  {
    name: 'username',
    label: '用户名',
    type: 'input',
    required: true,
    placeholder: '请输入用户名',
  },
  {
    name: 'email',
    label: '邮箱',
    type: 'input',
    rules: [{ type: 'email', message: '请输入正确的邮箱格式' }],
  },
  {
    name: 'role',
    label: '角色',
    type: 'select',
    options: [
      { label: '管理员', value: 'admin' },
      { label: '用户', value: 'user' },
    ],
  },
  {
    name: 'enabled',
    label: '启用',
    type: 'switch',
    valuePropName: 'checked',
    initialValue: true,
  },
]

const handleSubmit = (values: Record<string, any>) => {
  console.log('表单提交:', values)
}
</script>

<template>
  <ProForm :form-items="formItems" @submit="handleSubmit" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `formItems` | `ProFormItem[]` | 必填 | 表单字段配置 |
| `initialValues` | `Record<string, any>` | — | 表单初始值 |
| `layout` | `ProFormLayout` | `{ labelCol: { span: 6 }, wrapperCol: { span: 18 }, layout: 'horizontal' }` | 表单布局 |
| `grid` | `ProFormGrid` | `{ gutter: 16, cols: 1 }` | 网格布局配置 |

## ProFormItem

表单字段配置接口：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 字段名（必填） |
| `label` | `string` | 字段标签（必填） |
| `type` | `FormItemType` | 字段类型（必填） |
| `required` | `boolean` | 是否必填（自动添加必填验证） |
| `rules` | `any[]` | 自定义验证规则 |
| `initialValue` | `any` | 默认值 |
| `dependencies` | `string[]` | 依赖的字段（值变化时触发重渲染） |
| `tooltip` | `string` | 帮助提示文本 |
| `placeholder` | `string` | 占位提示文本 |
| `colSpan` | `number` | 网格列跨度 |
| `hidden` | `boolean` | 是否隐藏 |
| `options` | `Array<{ label, value, disabled? }>` | 下拉/单选/复选选项 |
| `props` | `Record<string, any>` | 传递给组件的额外属性 |
| `valuePropName` | `string` | 值属性名（如 Switch 使用 `'checked'`） |
| `render` | `(form) => any` | 自定义渲染函数 |
| `request` | `() => Promise<Array<{ label, value }>>` | 动态加载选项 |

## FormItemType 字段类型

| 类型 | 说明 | 适用场景 |
| --- | --- | --- |
| `input` | 文本输入框 | 姓名、标题等文本 |
| `password` | 密码输入框 | 密码 |
| `textarea` | 多行文本 | 描述、备注 |
| `number` | 数字输入框 | 数量、金额 |
| `select` | 下拉选择 | 状态、类型等枚举 |
| `radio` | 单选框 | 少量选项的单选 |
| `checkbox` | 复选框 | 多选 |
| `switch` | 开关 | 布尔值 |
| `datePicker` | 日期选择器 | 日期 |
| `timePicker` | 时间选择器 | 时间 |
| `dateRange` | 日期范围 | 起止日期 |
| `timeRange` | 时间范围 | 起止时间 |
| `upload` | 文件上传 | 文件、图片 |
| `slider` | 滑动条 | 范围值 |
| `rate` | 评分 | 星级评分 |
| `colorPicker` | 颜色选择器 | 颜色 |
| `cascader` | 级联选择 | 省市区等层级 |
| `treeSelect` | 树形选择 | 部门、分类等树形数据 |
| `custom` | 自定义 | 配合 `render` 实现任意组件 |

## 布局配置

### ProFormLayout

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `labelCol` | `{ span: number }` | 标签栅格占位 |
| `wrapperCol` | `{ span: number }` | 输入控件栅格占位 |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | 表单布局方向 |

### ProFormGrid

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `gutter` | `number` | 列间距（px） |
| `cols` | `number` | 列数 |

### 网格布局示例

```vue
<ProForm
  :form-items="formItems"
  :grid="{ gutter: 24, cols: 2 }"
/>
```

使用 `colSpan` 让某些字段占据多列：

```typescript
const formItems: ProFormItem[] = [
  { name: 'name', label: '姓名', type: 'input', colSpan: 1 },
  { name: 'email', label: '邮箱', type: 'input', colSpan: 1 },
  { name: 'description', label: '描述', type: 'textarea', colSpan: 2 }, // 跨两列
]
```

## 动态选项

使用 `request` 属性异步加载选项：

```typescript
{
  name: 'department',
  label: '部门',
  type: 'treeSelect',
  request: async () => {
    const res = await fetchDepartments()
    return res.map(d => ({ label: d.name, value: d.id }))
  },
}
```

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `submit` | `(values: Record<string, any>)` | 表单提交（验证通过后） |
| `finish` | `(values: Record<string, any>)` | 同 submit |
| `valuesChange` | `(changedValues, allValues)` | 字段值变化 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `footer` | 自定义表单底部按钮区域 |

## 暴露方法

| 方法 | 返回类型 | 说明 |
| --- | --- | --- |
| `validate()` | `Promise<Record<string, any>>` | 触发表单验证 |
| `resetFields()` | `void` | 重置表单 |
| `setFieldsValue(values)` | `void` | 设置字段值 |
| `getFieldsValue()` | `Record<string, any>` | 获取所有字段值 |
| `formRef` | `FormInstance` | 获取 Ant Design Form 实例 |

```vue
<script setup lang="ts">
const formRef = ref()

// 手动设置值
formRef.value?.setFieldsValue({ name: '张三', status: 'active' })

// 获取所有值
const values = formRef.value?.getFieldsValue()

// 手动触发验证
const result = await formRef.value?.validate()

// 重置表单
formRef.value?.resetFields()
</script>

<template>
  <ProForm ref="formRef" :form-items="formItems" />
</template>
```
