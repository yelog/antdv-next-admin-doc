# ProUpload

## Overview

`ProUpload` is an enhanced upload component with four modes: button, dragger, image wall, and avatar upload. It includes built-in file size and type validation. It also integrates with ProForm, supporting `upload`, `imageUpload`, and `avatarUpload` form item types.

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProUpload from '@/components/Pro/ProUpload/index.vue'

const files = ref([])
</script>

<template>
  <!-- Button upload -->
  <ProUpload v-model:value="files" mode="button" />

  <!-- Dragger upload -->
  <ProUpload v-model:value="files" mode="dragger" hint="Supports jpg, png" />

  <!-- Image wall -->
  <ProUpload v-model:value="files" mode="image" :max-count="3" />

  <!-- Avatar upload -->
  <ProUpload v-model:value="files" mode="avatar" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `UploadFile[]` | `[]` | File list (v-model) |
| `mode` | `'button' \| 'dragger' \| 'image' \| 'avatar'` | `'button'` | Upload mode |
| `accept` | `string` | — | Accepted file types |
| `maxSize` | `number` | `10` | Max file size (MB) |
| `maxCount` | `number` | — | Max number of files |
| `action` | `string` | — | Upload URL |
| `buttonText` | `string` | — | Button/hint text |
| `hint` | `string` | — | Help text (shown in dragger mode) |

## Modes

### button — Button Upload

Standard button-triggered upload, suitable for general file upload scenarios.

### dragger — Drag & Drop Upload

Drag-and-drop area upload, suitable for large files or batch upload.

### image — Image Wall

Picture card list with preview, suitable for multi-image upload.

### avatar — Avatar Upload

Circular avatar upload with hover overlay effect, limited to a single image.

## Usage in ProForm

```typescript
const formItems: ProFormItem[] = [
  { name: 'avatar', label: 'Avatar', type: 'avatarUpload' },
  { name: 'images', label: 'Images', type: 'imageUpload', props: { maxCount: 3 } },
  { name: 'attachment', label: 'Attachment', type: 'upload' },
]
```

## Events

| Event | Description |
| --- | --- |
| `update:value` | File list changed |
| `change` | File list changed |
