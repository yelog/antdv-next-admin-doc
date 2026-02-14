# ProForm

## Overview

`ProForm` is a configuration-driven advanced form component supporting 20+ field types, grid layout, form validation, and dynamic option loading — generate complete forms from JSON configuration.

## Basic Usage

```vue
<script setup lang="ts">
import ProForm from '@/components/Pro/ProForm/index.vue'
import type { ProFormItem } from '@/types/pro'

const formItems: ProFormItem[] = [
  {
    name: 'username',
    label: 'Username',
    type: 'input',
    required: true,
    placeholder: 'Enter username',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'input',
    rules: [{ type: 'email', message: 'Please enter a valid email' }],
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
    ],
  },
  {
    name: 'enabled',
    label: 'Enabled',
    type: 'switch',
    valuePropName: 'checked',
    initialValue: true,
  },
]

const handleSubmit = (values: Record<string, any>) => {
  console.log('Form submitted:', values)
}
</script>

<template>
  <ProForm :form-items="formItems" @submit="handleSubmit" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `formItems` | `ProFormItem[]` | Required | Form field definitions |
| `initialValues` | `Record<string, any>` | — | Initial form values |
| `layout` | `ProFormLayout` | `{ labelCol: { span: 6 }, wrapperCol: { span: 18 }, layout: 'horizontal' }` | Form layout |
| `grid` | `ProFormGrid` | `{ gutter: 16, cols: 1 }` | Grid layout config |

## ProFormItem

Form field configuration interface:

| Property | Type | Description |
| --- | --- | --- |
| `name` | `string` | Field name (required) |
| `label` | `string` | Field label (required) |
| `type` | `FormItemType` | Field type (required) |
| `required` | `boolean` | Auto-add required validation |
| `rules` | `any[]` | Custom validation rules |
| `initialValue` | `any` | Default value |
| `dependencies` | `string[]` | Dependent fields (re-render on change) |
| `tooltip` | `string` | Help tooltip text |
| `placeholder` | `string` | Placeholder text |
| `colSpan` | `number` | Grid column span |
| `hidden` | `boolean` | Hide field |
| `options` | `Array<{ label, value, disabled? }>` | Options for select/radio/checkbox |
| `props` | `Record<string, any>` | Extra props passed to the component |
| `valuePropName` | `string` | Value prop name (e.g. `'checked'` for Switch) |
| `render` | `(form) => any` | Custom render function |
| `request` | `() => Promise<Array<{ label, value }>>` | Dynamic options loader |

## FormItemType

| Type | Description | Use Case |
| --- | --- | --- |
| `input` | Text input | Names, titles |
| `password` | Password input | Passwords |
| `textarea` | Multi-line text | Descriptions, notes |
| `number` | Number input | Quantities, amounts |
| `select` | Select dropdown | Status, type enums |
| `radio` | Radio buttons | Few single-choice options |
| `checkbox` | Checkboxes | Multi-select |
| `switch` | Toggle switch | Boolean values |
| `datePicker` | Date picker | Dates |
| `timePicker` | Time picker | Times |
| `dateRange` | Date range picker | Date ranges |
| `timeRange` | Time range picker | Time ranges |
| `upload` | File upload | Files, images |
| `slider` | Slider | Range values |
| `rate` | Rating | Star ratings |
| `colorPicker` | Color picker | Colors |
| `cascader` | Cascading select | Region, category hierarchies |
| `treeSelect` | Tree select | Departments, categories |
| `custom` | Custom | Any component via `render` |

## Layout Configuration

### ProFormLayout

| Property | Type | Description |
| --- | --- | --- |
| `labelCol` | `{ span: number }` | Label grid span |
| `wrapperCol` | `{ span: number }` | Input control grid span |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` | Form layout direction |

### ProFormGrid

| Property | Type | Description |
| --- | --- | --- |
| `gutter` | `number` | Column gap (px) |
| `cols` | `number` | Number of columns |

### Grid Layout Example

```vue
<ProForm
  :form-items="formItems"
  :grid="{ gutter: 24, cols: 2 }"
/>
```

Use `colSpan` to make fields span multiple columns:

```typescript
const formItems: ProFormItem[] = [
  { name: 'name', label: 'Name', type: 'input', colSpan: 1 },
  { name: 'email', label: 'Email', type: 'input', colSpan: 1 },
  { name: 'description', label: 'Description', type: 'textarea', colSpan: 2 }, // Spans two columns
]
```

## Dynamic Options

Use the `request` property to load options asynchronously:

```typescript
{
  name: 'department',
  label: 'Department',
  type: 'treeSelect',
  request: async () => {
    const res = await fetchDepartments()
    return res.map(d => ({ label: d.name, value: d.id }))
  },
}
```

## Events

| Event | Params | Description |
| --- | --- | --- |
| `submit` | `(values: Record<string, any>)` | Form submit (after validation) |
| `finish` | `(values: Record<string, any>)` | Same as submit |
| `valuesChange` | `(changedValues, allValues)` | Field value change |

## Slots

| Slot | Description |
| --- | --- |
| `footer` | Custom form footer / button area |

## Exposed Methods

| Method | Return Type | Description |
| --- | --- | --- |
| `validate()` | `Promise<Record<string, any>>` | Trigger form validation |
| `resetFields()` | `void` | Reset form |
| `setFieldsValue(values)` | `void` | Set field values |
| `getFieldsValue()` | `Record<string, any>` | Get all field values |
| `formRef` | `FormInstance` | Access Ant Design Form instance |

```vue
<script setup lang="ts">
const formRef = ref()

// Set values programmatically
formRef.value?.setFieldsValue({ name: 'John', status: 'active' })

// Get all values
const values = formRef.value?.getFieldsValue()

// Trigger validation
const result = await formRef.value?.validate()

// Reset form
formRef.value?.resetFields()
</script>

<template>
  <ProForm ref="formRef" :form-items="formItems" />
</template>
```
