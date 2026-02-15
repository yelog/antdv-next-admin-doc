# ProStepForm 步骤表单

## 概述

`ProStepForm` 是步骤表单组件，封装了 `a-steps` + 步骤内容 + 导航按钮的三段式布局。通过插槽提供每个步骤的内容，支持异步校验、草稿保存等场景。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProStepForm from '@/components/Pro/ProStepForm/index.vue'
import type { ProStepFormStep } from '@/types/pro'

const currentStep = ref(0)

const steps: ProStepFormStep[] = [
  { title: '基本信息' },
  { title: '详细配置' },
  { title: '确认提交' },
]

const handleNext = async (step: number) => {
  // 在这里进行当前步骤的校验
  currentStep.value = step + 1
}

const handleSubmit = () => {
  console.log('提交表单')
}
</script>

<template>
  <ProStepForm
    v-model="currentStep"
    :steps="steps"
    @next="handleNext"
    @submit="handleSubmit"
  >
    <template #step-0>
      <p>第一步内容</p>
    </template>
    <template #step-1>
      <p>第二步内容</p>
    </template>
    <template #step-2>
      <p>第三步内容</p>
    </template>
  </ProStepForm>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `steps` | `ProStepFormStep[]` | — | 步骤配置 |
| `modelValue` | `number` | `0` | 当前步骤索引（v-model） |
| `loading` | `boolean` | `false` | 按钮加载状态 |
| `prevText` | `string` | `'上一步'` | 上一步按钮文案 |
| `nextText` | `string` | `'下一步'` | 下一步按钮文案 |
| `submitText` | `string` | `'提交'` | 提交按钮文案 |

## ProStepFormStep

```typescript
interface ProStepFormStep {
  title: string
  description?: string
  icon?: Component
}
```

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(step: number)` | 步骤变化 |
| `next` | `(currentStep: number)` | 点击下一步，在回调中完成校验后手动推进步骤 |
| `prev` | `(currentStep: number)` | 点击上一步 |
| `submit` | — | 点击提交 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `step-{index}` | 第 `index` 步的内容 |
| `extra-actions` | 额外操作按钮（如保存草稿、重置） |

## Methods (via ref)

| 方法 | 说明 |
| --- | --- |
| `prev()` | 回到上一步 |
| `goTo(step)` | 跳转到指定步骤 |
