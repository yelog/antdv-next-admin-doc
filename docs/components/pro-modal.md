# ProModal 高级弹窗

## 概述

`ProModal` 是基于 Ant Design Vue Modal 的增强组件，在保留原有功能的基础上增加了拖拽移动、边缘缩放和全屏切换能力。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProModal from '@/components/Pro/ProModal/index.vue'

const open = ref(false)

const handleOk = () => {
  // 处理确认逻辑
  open.value = false
}
</script>

<template>
  <a-button @click="open = true">打开弹窗</a-button>

  <ProModal
    v-model:open="open"
    title="编辑用户"
    :width="600"
    @ok="handleOk"
  >
    <p>弹窗内容</p>
  </ProModal>
</template>
```

## Props

除了支持所有 Ant Design Vue Modal 的原生属性外，`ProModal` 额外提供以下属性：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `draggable` | `boolean` | `true` | 是否可拖拽移动 |
| `resizable` | `boolean` | `true` | 是否可边缘缩放 |
| `fullscreenable` | `boolean` | `true` | 是否显示全屏切换按钮 |
| `minWidth` | `number` | `360` | 最小宽度（px） |
| `minHeight` | `number` | `260` | 最小高度（px） |

::: tip
所有 Ant Design Vue Modal 的属性（如 `title`、`width`、`centered`、`maskClosable` 等）均可直接传入。
:::

## 功能说明

### 拖拽移动

- 在标题栏区域按下鼠标即可拖拽移动弹窗
- 弹窗会被约束在视口范围内，不会拖出屏幕
- 设置 `draggable: false` 可禁用

### 边缘缩放

- 鼠标移至弹窗边缘（8px 检测区域）时会显示缩放光标
- 支持 8 个方向的缩放：上、下、左、右、左上、右上、左下、右下
- 缩放时会尊重 `minWidth` 和 `minHeight` 的限制
- 设置 `resizable: false` 可禁用

### 全屏切换

- 标题栏右侧显示全屏切换按钮（在关闭按钮左侧）
- 切换时带有平滑动画效果
- 全屏状态下再次点击恢复到原始尺寸和位置
- 设置 `fullscreenable: false` 可隐藏按钮

## 配合 ProForm 使用

`ProModal` 常与 `ProForm` 配合实现表单弹窗：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProModal from '@/components/Pro/ProModal/index.vue'
import ProForm from '@/components/Pro/ProForm/index.vue'
import type { ProFormItem } from '@/types/pro'

const open = ref(false)
const formRef = ref()

const formItems: ProFormItem[] = [
  { name: 'name', label: '姓名', type: 'input', required: true },
  { name: 'email', label: '邮箱', type: 'input' },
  { name: 'role', label: '角色', type: 'select', options: [
    { label: '管理员', value: 'admin' },
    { label: '用户', value: 'user' },
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
    title="新增用户"
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

| 插槽名 | 说明 |
| --- | --- |
| `default` | 弹窗内容 |
| `title` | 自定义标题 |
| `footer` | 自定义底部按钮区域 |

## Events

| 事件 | 说明 |
| --- | --- |
| `ok` | 点击确认按钮 |
| `cancel` | 点击取消按钮或遮罩层 |
| `update:open` | 弹窗显示/隐藏状态变化 |

## 与 Ant Design Modal 的区别

| 特性 | Ant Design Modal | ProModal |
| --- | --- | --- |
| 拖拽移动 | 不支持 | 支持 |
| 边缘缩放 | 不支持 | 支持（8 方向） |
| 全屏切换 | 不支持 | 支持（带动画） |
| 视口约束 | 不支持 | 支持 |
| 原生属性 | 全部支持 | 全部支持 |
