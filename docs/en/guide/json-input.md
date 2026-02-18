# JsonInput Component

## Overview

`JsonInput` is a structured JSON editor with form mode and raw JSON mode for configuration-oriented forms.

- Component: `src/components/JsonInput/index.vue`
- Example page: `/examples/json-input`

## Key Features

- Visual object-field editing
- Drag-sort fields (optional)
- Add/remove fields (optional)
- Raw JSON editing and validation
- Disabled/readonly fields and label mapping

## Basic Usage

```vue
<JsonInput v-model:value="config" :placeholder="'Edit JSON'" />
```

## Use Cases

- System configuration editing
- Complex strategy parameters
- Backend JSON field management

## Related Docs

- [Examples](/en/guide/examples)
- [Complex Form Scaffold](/en/guide/scaffold-complex-form)
