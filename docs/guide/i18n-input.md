# I18nInput 组件

## 概述

`I18nInput` 是对 `JsonInput` 的多语言封装，用于维护 `zh-CN`、`en-US` 等语言文案。组件会根据系统支持语言自动生成字段，并保持多语言数据结构稳定。

- 组件路径：`src/components/I18nInput/index.vue`
- 示例页面：`/examples/i18n-input`

## 核心能力

- 多语言键值对可视化编辑
- 支持对象值与 JSON 字符串值双格式
- 自动补齐缺失语言键
- 可选严格语言模式（剔除非系统支持语言）
- 主展示值按 `locale` 或当前系统语言确定

## 组件关系

`I18nInput` 内部直接复用 `JsonInput`，并默认关闭结构变更能力：

- `allow-add = false`
- `allow-delete = false`
- `allow-sort = false`

因此在 `I18nInput` 中你主要是编辑每个语言的文本值，而不是调整字段结构。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import I18nInput from '@/components/I18nInput/index.vue'

const title = ref({
  'zh-CN': '订单中心',
  'en-US': 'Order Center'
})
</script>

<template>
  <I18nInput
    v-model:value="title"
    placeholder="点击编辑多语言内容"
    modal-title="编辑标题"
  />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string \| Record<string, string>` | `{}` | 绑定值，支持对象或 JSON 字符串 |
| `locale` | `string` | `getLocale()` | 主展示语言 |
| `placeholder` | `string` | `''` | 输入框占位文案 |
| `modalTitle` | `string` | `''` | 弹窗标题 |
| `strictLocales` | `boolean` | `false` | 是否仅保留系统支持语言 |

## 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:value` | `(value: string \| Record<string, string>)` | 值变更时触发 |
| `change` | `(value: string \| Record<string, string>)` | 与 `update:value` 同步触发 |

## 数据归一化规则

### 语言来源

- 语言列表来自 `SUPPORTED_LOCALES`
- 每次处理值时，都会保证这些语言键存在（缺失自动补空字符串）

### 输入值处理

- `value` 为对象：按对象处理
- `value` 为字符串：按 JSON 解析，解析失败则回退到默认空语言对象
- 空值会回退到默认空语言对象

### 严格模式

- `strictLocales = true`：删除所有不在 `SUPPORTED_LOCALES` 里的键
- `strictLocales = false`：保留额外语言键

### 回传值类型

- 若外部传入是字符串，回传保持字符串
- 若外部传入是对象，回传保持对象

## 展示语言规则

`display-key` 会自动映射为目标语言：

1. 优先使用 `locale` prop
2. 若不在支持列表中，降级到支持语言列表第一个
3. 输入框展示该语言对应文案

## 进阶示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import I18nInput from '@/components/I18nInput/index.vue'

const nameAsObject = ref({
  'zh-CN': '商品名称',
  'en-US': 'Product Name',
  'ja-JP': '商品名'
})

const nameAsString = ref('{"zh-CN":"颜色","en-US":"Color"}')
</script>

<template>
  <I18nInput
    v-model:value="nameAsObject"
    locale="zh-CN"
    :strict-locales="true"
    modal-title="编辑对象模式"
  />

  <I18nInput
    v-model:value="nameAsString"
    locale="en-US"
    modal-title="编辑字符串模式"
  />
</template>
```

## 适用场景

- 商品名称/描述多语言维护
- CMS 国际化文案编辑
- 多语言表单字段录入

## 相关文档

- [国际化](/guide/i18n)
- [JsonInput 组件](/guide/json-input)
- [示例与实战](/guide/examples)
