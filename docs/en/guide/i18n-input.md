# I18nInput Component

## Overview

`I18nInput` is built on top of `JsonInput` to maintain multilingual fields such as `zh-CN/en-US`.

- Component: `src/components/I18nInput/index.vue`
- Example page: `/examples/i18n-input`

## Key Features

- Multilingual key-value editing
- Primary display by current locale
- Supports object and JSON-string value formats
- Auto-fills missing locale keys

## Basic Usage

```vue
<I18nInput v-model:value="form.title" :placeholder="'Edit multilingual content'" />
```

## Use Cases

- Multilingual product title/description
- CMS internationalized content editing
- Multilingual form fields

## Related Docs

- [Internationalization](/en/guide/i18n)
- [JsonInput Component](/en/guide/json-input)
