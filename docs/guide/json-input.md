# JsonInput 组件

## 概述

`JsonInput` 是一个面向「对象型 JSON 字段」的可视化编辑组件，适合配置中心、策略参数、扩展字段等后台场景。

- 组件路径：`src/components/JsonInput/index.vue`
- 示例页面：`/examples/json-input`

## 核心能力

- 单栏层级编辑：通过缩进展示嵌套对象，支持展开/收起
- 同层级拖拽排序：在同一父对象下拖拽字段，拖动父节点时子孙结构会一起移动
- 字段新增/删除（可选）
- 字段类型感知：`string / number / boolean / tags / array / object`
- 原始 JSON 模式与结构模式互切
- 支持字段标签映射、字段配置、禁用/只读控制

## 值模型与提交规则

- `v-model:value` 只接受对象或 `null`
- 当传入 `null` 或非法值时，编辑器内部会归一化为 `{}`
- 点击确定时要求根节点仍是对象，否则会提示错误
- 若启用 `displayKey`，输入框展示 `value[displayKey]`；否则展示 JSON 预览片段

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import JsonInput from '@/components/JsonInput/index.vue'

const config = ref({
  name: 'Demo',
  enabled: true,
  options: {
    timeout: 30,
    tags: ['alpha', 'beta']
  }
})
</script>

<template>
  <JsonInput
    v-model:value="config"
    placeholder="点击编辑 JSON"
    modal-title="编辑配置"
  />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `Record<string, unknown> \| null` | `null` | 绑定值（根节点必须是对象） |
| `displayKey` | `string` | `''` | 输入框显示主值字段 |
| `labelMap` | `Record<string, string>` | `{}` | 字段标签映射，支持 `name` 与 `user.name` 两种键 |
| `fieldConfig` | `Record<string, FieldConfig>` | `{}` | 字段配置，支持按字段名或完整路径配置 |
| `disabledFields` | `string[]` | `[]` | 禁用字段列表（支持字段名或完整路径） |
| `readonlyFields` | `string[]` | `[]` | 只读字段列表（支持字段名或完整路径） |
| `allowAdd` | `boolean` | `true` | 是否允许新增字段 |
| `allowDelete` | `boolean` | `true` | 是否允许删除字段 |
| `allowSort` | `boolean` | `true` | 是否允许拖拽排序 |
| `placeholder` | `string` | `''` | 输入框占位文案 |
| `modalTitle` | `string` | `''` | 弹窗标题 |
| `modalWidth` | `string` | `'900px'` | 弹窗宽度 |

### FieldConfig

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `'string' \| 'number' \| 'boolean' \| 'tags' \| 'array' \| 'object'` | 指定字段类型 |
| `component` | `'input' \| 'textarea'` | 文本字段渲染方式 |
| `label` | `string` | 当前字段显示名 |
| `min` | `number` | 数字最小值 |
| `max` | `number` | 数字最大值 |
| `maxLength` | `number` | 文本最大长度（`textarea`） |
| `activeLabel` | `string` | 布尔字段为 `true` 时文案 |
| `inactiveLabel` | `string` | 布尔字段为 `false` 时文案 |

## 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:value` | `(value: Record<string, unknown>)` | 点击确定后回传新值 |
| `change` | `(value: Record<string, unknown>)` | 与 `update:value` 同步触发 |

## 行为细节

### 字段标签与配置优先级

- 标签优先级：`fieldConfig[path].label` > `labelMap[path]` > `labelMap[key]` > `key`
- 配置优先级：`fieldConfig[path]` > `fieldConfig[key]`

### 只读与禁用

- `disabledFields` 命中后字段不可编辑
- `readonlyFields` 命中后字段只读
- 命中方式都支持：
  - 字段名：`name`
  - 完整路径：`profile.name`

### 数组字段

- 数组以 JSON 文本编辑
- 失焦或提交时会解析校验
- 不是合法数组会阻止提交并提示错误

### 拖拽范围

- 当前版本拖拽为「同父级重排」
- 父节点重排时会连同其全部子孙一起移动
- 不支持跨父级直接改挂载位置

## 进阶示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import JsonInput from '@/components/JsonInput/index.vue'

const payload = ref({
  id: 'cfg-001',
  profile: {
    nickname: 'admin',
    description: '系统管理员'
  },
  flags: {
    enabled: true
  }
})
</script>

<template>
  <JsonInput
    v-model:value="payload"
    display-key="id"
    modal-title="编辑配置"
    :disabled-fields="['id']"
    :readonly-fields="['profile.nickname']"
    :field-config="{
      'profile.description': { component: 'textarea', maxLength: 200 },
      'flags.enabled': { type: 'boolean', activeLabel: '开启', inactiveLabel: '关闭' }
    }"
    :label-map="{
      id: '配置ID',
      profile: '资料',
      'profile.nickname': '昵称',
      'profile.description': '描述'
    }"
  />
</template>
```

## 适用场景

- 系统配置编辑
- 业务策略参数维护
- 后端扩展 JSON 字段管理

## 相关文档

- [示例与实战](/guide/examples)
- [I18nInput 组件](/guide/i18n-input)
- [复杂表单脚手架](/guide/scaffold-complex-form)
