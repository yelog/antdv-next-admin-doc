# ProStepForm

## Overview

`ProStepForm` is a step form component that encapsulates `a-steps` + step content + navigation buttons. Each step's content is provided via named slots, supporting async validation and draft save scenarios.

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProStepForm from '@/components/Pro/ProStepForm/index.vue'
import type { ProStepFormStep } from '@/types/pro'

const currentStep = ref(0)

const steps: ProStepFormStep[] = [
  { title: 'Basic Info' },
  { title: 'Configuration' },
  { title: 'Confirm' },
]

const handleNext = async (step: number) => {
  // Validate current step here
  currentStep.value = step + 1
}

const handleSubmit = () => {
  console.log('Submit form')
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
      <p>Step 1 content</p>
    </template>
    <template #step-1>
      <p>Step 2 content</p>
    </template>
    <template #step-2>
      <p>Step 3 content</p>
    </template>
  </ProStepForm>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `ProStepFormStep[]` | — | Step configuration |
| `modelValue` | `number` | `0` | Current step index (v-model) |
| `loading` | `boolean` | `false` | Button loading state |
| `prevText` | `string` | `'Previous'` | Previous button text |
| `nextText` | `string` | `'Next'` | Next button text |
| `submitText` | `string` | `'Submit'` | Submit button text |

## ProStepFormStep

```typescript
interface ProStepFormStep {
  title: string
  description?: string
  icon?: Component
}
```

## Events

| Event | Params | Description |
| --- | --- | --- |
| `update:modelValue` | `(step: number)` | Step changed |
| `next` | `(currentStep: number)` | Next clicked, advance step manually after validation |
| `prev` | `(currentStep: number)` | Previous clicked |
| `submit` | — | Submit clicked |

## Slots

| Slot | Description |
| --- | --- |
| `step-{index}` | Content for step at `index` |
| `extra-actions` | Extra action buttons (e.g. save draft, reset) |

## Methods (via ref)

| Method | Description |
| --- | --- |
| `prev()` | Go to previous step |
| `goTo(step)` | Jump to a specific step |
