# Common Components

This document introduces other commonly used components in the Antdv Next Admin project besides Pro components.

## Table of Contents

- [IconPicker](#iconpicker)
- [Captcha](#captcha)
- [Editor](#editor)
- [Watermark](#watermark)
- [PermissionButton](#permissionbutton)

---

## IconPicker

A popup component for selecting icons with search and category browsing support.

### Location

`src/components/IconPicker/`

### Basic Usage

```vue
<template>
  <IconPicker v-model:value="iconName" />
</template>

<script setup>
import { ref } from 'vue'
import IconPicker from '@/components/IconPicker/index.vue'

const iconName = ref('HomeOutlined')
</script>
```

### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | string | - | Currently selected icon name |
| placeholder | string | 'Select icon' | Placeholder text |
| readonly | boolean | false | Read only |

---

## Captcha

Provides multiple verification code types: slider, puzzle, rotate, and point selection.

### Slider Captcha

```vue
<template>
  <SliderCaptcha
    v-model:visible="visible"
    @success="handleSuccess"
    @fail="handleFail"
  />
</template>

<script setup>
import { ref } from 'vue'
import SliderCaptcha from '@/components/Captcha/SliderCaptcha.vue'

const visible = ref(false)

const handleSuccess = () => {
  message.success('Verification passed')
}

const handleFail = () => {
  message.error('Verification failed, please try again')
}
</script>
```

---

## Editor

Rich text editor component based on TipTap.

### Basic Usage

```vue
<template>
  <Editor v-model="content" :height="400" />
</template>

<script setup>
import { ref } from 'vue'
import Editor from '@/components/Editor/index.vue'

const content = ref('<p>Initial content</p>')
</script>
```

### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| modelValue | string | '' | Editor content (HTML) |
| height | number | 300 | Editor height |
| placeholder | string | 'Enter content...' | Placeholder text |
| disabled | boolean | false | Disabled state |

---

## Watermark

Used to add tamper-proof watermarks on pages.

### Basic Usage

```vue
<template>
  <Watermark content="Confidential" :fullscreen="true" />
</template>

<script setup>
import Watermark from '@/components/Watermark/index.vue'
</script>
```

### Using Store

```typescript
import { useWatermarkStore } from '@/stores/watermark'

const watermarkStore = useWatermarkStore()

// Set watermark
watermarkStore.setWatermark({
  content: `${userStore.userInfo?.username} - ${formatDate(new Date())}`,
})

// Clear watermark
watermarkStore.clearWatermark()
```

---

## PermissionButton

Button component wrapped with permission checking.

### Basic Usage

```vue
<template>
  <PermissionButton permission="user.create">
    Add User
  </PermissionButton>
</template>

<script setup>
import PermissionButton from '@/components/Permission/PermissionButton.vue'
</script>
```

### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| permission | string \| string[] | - | Required permission |
| all | boolean | false | Require all permissions |

---

## Next Steps

- Learn [Composables](/en/guide/composables)
- View [Utils](/en/guide/utils)
- Read [State Management](/en/guide/state-management)
