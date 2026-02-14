# ProModal

## Overview

`ProModal` is an enhanced Ant Design Vue Modal component with added drag, edge resizing, and fullscreen toggle capabilities while retaining all native features.

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProModal from '@/components/Pro/ProModal/index.vue'

const open = ref(false)

const handleOk = () => {
  // Handle confirm logic
  open.value = false
}
</script>

<template>
  <a-button @click="open = true">Open Modal</a-button>

  <ProModal
    v-model:open="open"
    title="Edit User"
    :width="600"
    @ok="handleOk"
  >
    <p>Modal content</p>
  </ProModal>
</template>
```

## Props

In addition to all native Ant Design Vue Modal props, `ProModal` provides:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `draggable` | `boolean` | `true` | Enable drag via title bar |
| `resizable` | `boolean` | `true` | Enable edge resizing |
| `fullscreenable` | `boolean` | `true` | Show fullscreen toggle button |
| `minWidth` | `number` | `360` | Minimum width (px) |
| `minHeight` | `number` | `260` | Minimum height (px) |

::: tip
All Ant Design Vue Modal props (such as `title`, `width`, `centered`, `maskClosable`, etc.) can be passed directly.
:::

## Features

### Dragging

- Click and hold the title bar to drag the modal
- The modal is constrained within the viewport — it won't move off-screen
- Set `draggable: false` to disable

### Edge Resizing

- Hover near the modal edge (8px detection zone) to see resize cursors
- Supports 8 resize directions: N, S, E, W, NE, NW, SE, SW
- Respects `minWidth` and `minHeight` constraints
- Set `resizable: false` to disable

### Fullscreen Toggle

- A fullscreen button appears in the title bar (left of the close button)
- Smooth animation when toggling
- Click again in fullscreen mode to restore original size and position
- Set `fullscreenable: false` to hide the button

## Usage with ProForm

`ProModal` is commonly paired with `ProForm` for form dialogs:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProModal from '@/components/Pro/ProModal/index.vue'
import ProForm from '@/components/Pro/ProForm/index.vue'
import type { ProFormItem } from '@/types/pro'

const open = ref(false)
const formRef = ref()

const formItems: ProFormItem[] = [
  { name: 'name', label: 'Name', type: 'input', required: true },
  { name: 'email', label: 'Email', type: 'input' },
  { name: 'role', label: 'Role', type: 'select', options: [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ]},
]

const handleOk = async () => {
  const values = await formRef.value?.validate()
  if (values) {
    await saveUser(values)
    open.value = false
  }
}
</script>

<template>
  <ProModal
    v-model:open="open"
    title="Create User"
    :width="640"
    @ok="handleOk"
  >
    <ProForm
      ref="formRef"
      :form-items="formItems"
      :grid="{ cols: 1 }"
    />
  </ProModal>
</template>
```

## Slots

| Slot | Description |
| --- | --- |
| `default` | Modal body content |
| `title` | Custom title |
| `footer` | Custom footer / button area |

## Events

| Event | Description |
| --- | --- |
| `ok` | Confirm button clicked |
| `cancel` | Cancel button or mask clicked |
| `update:open` | Open state change |

## Comparison with Ant Design Modal

| Feature | Ant Design Modal | ProModal |
| --- | --- | --- |
| Dragging | Not supported | Supported |
| Edge resizing | Not supported | Supported (8 directions) |
| Fullscreen toggle | Not supported | Supported (animated) |
| Viewport constraint | Not supported | Supported |
| Native props | All supported | All supported |
