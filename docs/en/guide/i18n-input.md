# I18nInput Component

## Overview

`I18nInput` is a multilingual wrapper around `JsonInput` for editing locale-based content such as `zh-CN`, `en-US`, and other supported locales.

- Component path: `src/components/I18nInput/index.vue`
- Example page: `/examples/i18n-input`

## Core Capabilities

- Visual multilingual key-value editing
- Supports both object values and JSON-string values
- Auto-fills missing locale keys
- Optional strict locale mode (removes unsupported locale keys)
- Primary display value follows `locale` or current app locale

## Component Relationship

`I18nInput` internally reuses `JsonInput` and locks structural editing by default:

- `allow-add = false`
- `allow-delete = false`
- `allow-sort = false`

So the focus is editing locale text values, not changing field structure.

## Basic Usage

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
    placeholder="Edit multilingual content"
    modal-title="Edit Title"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| Record<string, string>` | `{}` | Bound value, object or JSON string |
| `locale` | `string` | `getLocale()` | Primary display locale |
| `placeholder` | `string` | `''` | Input placeholder |
| `modalTitle` | `string` | `''` | Modal title |
| `strictLocales` | `boolean` | `false` | Keep only locales in `SUPPORTED_LOCALES` |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:value` | `(value: string \| Record<string, string>)` | Emitted when value changes |
| `change` | `(value: string \| Record<string, string>)` | Emitted together with `update:value` |

## Normalization Rules

### Locale Source

- Locale keys come from `SUPPORTED_LOCALES`
- Every update ensures these locale keys exist (missing keys are filled with empty strings)

### Input Handling

- Object input: used as object
- String input: parsed as JSON; on parse failure it falls back to default empty-locale object
- Empty value also falls back to default empty-locale object

### Strict Mode

- `strictLocales = true`: remove keys not in `SUPPORTED_LOCALES`
- `strictLocales = false`: keep extra locale keys

### Output Type Preservation

- If external input type is string, emitted value stays string
- If external input type is object, emitted value stays object

## Display Locale Rules

`display-key` is automatically mapped to the target locale:

1. Use `locale` prop first
2. If not supported, fallback to the first locale in `SUPPORTED_LOCALES`
3. Input display value uses that locale content

## Advanced Example

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
    modal-title="Object Mode"
  />

  <I18nInput
    v-model:value="nameAsString"
    locale="en-US"
    modal-title="String Mode"
  />
</template>
```

## Use Cases

- Multilingual product title/description management
- CMS i18n content editing
- Multilingual form field input

## Related Docs

- [Internationalization](/en/guide/i18n)
- [JsonInput Component](/en/guide/json-input)
- [Examples](/en/guide/examples)
