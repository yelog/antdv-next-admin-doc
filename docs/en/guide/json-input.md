# JsonInput Component

## Overview

`JsonInput` is a visual editor for object-based JSON fields, designed for admin scenarios like config centers, policy parameters, and extensible metadata.

- Component path: `src/components/JsonInput/index.vue`
- Example page: `/examples/json-input`

## Core Capabilities

- Single-column nested editor with indentation and expand/collapse
- Same-parent drag sorting (moving a parent keeps all descendants)
- Optional add/remove fields
- Field type awareness: `string / number / boolean / tags / array / object`
- Structured mode and raw JSON mode switching
- Label mapping, field configuration, disabled/readonly controls

## Value Model and Submit Rules

- `v-model:value` accepts an object or `null`
- `null` (or invalid input) is normalized to `{}` inside the editor
- On confirm, the root node must still be an object
- If `displayKey` is provided, the input shows `value[displayKey]`; otherwise it shows a JSON preview snippet

## Basic Usage

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
    placeholder="Edit JSON"
    modal-title="Edit Config"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Record<string, unknown> \| null` | `null` | Bound value (root must be an object) |
| `displayKey` | `string` | `''` | Primary field shown in the input |
| `labelMap` | `Record<string, string>` | `{}` | Label map supporting both `name` and `user.name` keys |
| `fieldConfig` | `Record<string, FieldConfig>` | `{}` | Field config by field key or full path |
| `disabledFields` | `string[]` | `[]` | Disabled fields (field key or full path) |
| `readonlyFields` | `string[]` | `[]` | Readonly fields (field key or full path) |
| `allowAdd` | `boolean` | `true` | Whether adding fields is allowed |
| `allowDelete` | `boolean` | `true` | Whether deleting fields is allowed |
| `allowSort` | `boolean` | `true` | Whether drag sorting is allowed |
| `placeholder` | `string` | `''` | Input placeholder |
| `modalTitle` | `string` | `''` | Modal title |
| `modalWidth` | `string` | `'900px'` | Modal width |

### FieldConfig

| Field | Type | Description |
| --- | --- | --- |
| `type` | `'string' \| 'number' \| 'boolean' \| 'tags' \| 'array' \| 'object'` | Force field type |
| `component` | `'input' \| 'textarea'` | Text renderer style |
| `label` | `string` | Display label |
| `min` | `number` | Number min value |
| `max` | `number` | Number max value |
| `maxLength` | `number` | Max text length (`textarea`) |
| `activeLabel` | `string` | Label for boolean `true` |
| `inactiveLabel` | `string` | Label for boolean `false` |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:value` | `(value: Record<string, unknown>)` | Emitted on confirm |
| `change` | `(value: Record<string, unknown>)` | Emitted together with `update:value` |

## Behavior Details

### Label and Config Priority

- Label priority: `fieldConfig[path].label` > `labelMap[path]` > `labelMap[key]` > `key`
- Config priority: `fieldConfig[path]` > `fieldConfig[key]`

### Readonly and Disabled

- `disabledFields` makes fields non-editable
- `readonlyFields` makes fields readonly
- Both match modes are supported:
  - Field key: `name`
  - Full path: `profile.name`

### Array Fields

- Edited as JSON text
- Parsed on blur and on submit
- Invalid array text blocks submit and shows an error

### Drag Scope

- Drag sorting is currently same-parent only
- Reordering a parent keeps its entire subtree together
- Cross-parent re-parenting is not supported yet

## Advanced Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import JsonInput from '@/components/JsonInput/index.vue'

const payload = ref({
  id: 'cfg-001',
  profile: {
    nickname: 'admin',
    description: 'System administrator'
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
    modal-title="Edit Config"
    :disabled-fields="['id']"
    :readonly-fields="['profile.nickname']"
    :field-config="{
      'profile.description': { component: 'textarea', maxLength: 200 },
      'flags.enabled': { type: 'boolean', activeLabel: 'On', inactiveLabel: 'Off' }
    }"
    :label-map="{
      id: 'Config ID',
      profile: 'Profile',
      'profile.nickname': 'Nickname',
      'profile.description': 'Description'
    }"
  />
</template>
```

## Use Cases

- System configuration editing
- Business policy parameter editing
- Backend extensible JSON field management

## Related Docs

- [Examples](/en/guide/examples)
- [I18nInput Component](/en/guide/i18n-input)
- [Complex Form Scaffold](/en/guide/scaffold-complex-form)
