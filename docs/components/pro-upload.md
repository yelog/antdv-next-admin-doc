# ProUpload 上传组件

## 概述

`ProUpload` 是增强型上传组件，支持按钮上传、拖拽上传、图片墙和头像上传四种模式，内置文件大小和类型校验。同时集成到 ProForm，支持 `upload`、`imageUpload`、`avatarUpload` 三种表单项类型。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProUpload from '@/components/Pro/ProUpload/index.vue'

const files = ref([])
</script>

<template>
  <!-- 按钮上传 -->
  <ProUpload v-model:value="files" mode="button" />

  <!-- 拖拽上传 -->
  <ProUpload v-model:value="files" mode="dragger" hint="支持 jpg、png 格式" />

  <!-- 图片墙 -->
  <ProUpload v-model:value="files" mode="image" :max-count="3" />

  <!-- 头像上传 -->
  <ProUpload v-model:value="files" mode="avatar" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `UploadFile[]` | `[]` | 文件列表（v-model） |
| `mode` | `'button' \| 'dragger' \| 'image' \| 'avatar'` | `'button'` | 上传模式 |
| `accept` | `string` | — | 接受的文件类型 |
| `maxSize` | `number` | `10` | 文件大小上限（MB） |
| `maxCount` | `number` | — | 最大文件数量 |
| `action` | `string` | — | 上传地址 |
| `buttonText` | `string` | — | 按钮/提示文字 |
| `hint` | `string` | — | 帮助文字（dragger 模式下显示） |

## 模式说明

### button — 按钮上传

标准的按钮触发上传，适合一般文件上传场景。

### dragger — 拖拽上传

拖拽区域上传，适合大文件或批量上传场景。

### image — 图片墙

图片卡片列表，支持预览，适合多图上传场景。

### avatar — 头像上传

圆形头像上传，带有 hover 遮罩效果，限制单张。

## 在 ProForm 中使用

```typescript
const formItems: ProFormItem[] = [
  { name: 'avatar', label: '头像', type: 'avatarUpload' },
  { name: 'images', label: '图片', type: 'imageUpload', props: { maxCount: 3 } },
  { name: 'attachment', label: '附件', type: 'upload' },
]
```

## Events

| 事件 | 说明 |
| --- | --- |
| `update:value` | 文件列表变化 |
| `change` | 文件列表变化 |
