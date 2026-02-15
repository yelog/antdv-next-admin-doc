# 通用组件

本文档介绍 Antdv Next Admin 项目中除 Pro 组件外的其他常用组件。

## 目录

- [IconPicker 图标选择器](#iconpicker-图标选择器)
- [Captcha 验证码](#captcha-验证码)
- [Editor 富文本编辑器](#editor-富文本编辑器)
- [Watermark 水印组件](#watermark-水印组件)
- [PermissionButton 权限按钮](#permissionbutton-权限按钮)

---

## IconPicker 图标选择器

用于选择图标的弹出式组件，支持搜索和分类浏览。

### 位置

`src/components/IconPicker/`

### 基础用法

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

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | - | 当前选中的图标名 |
| placeholder | string | '请选择图标' | 占位文字 |
| readonly | boolean | false | 是否只读 |

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | icon: string | 选择图标时触发 |

---

## Captcha 验证码

提供多种验证码类型：滑块、拼图、旋转、点选。

### 位置

`src/components/Captcha/`

### 滑块验证码

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
  message.success('验证通过')
  // 执行登录等操作
}

const handleFail = () => {
  message.error('验证失败，请重试')
}
</script>
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | boolean | false | 是否显示 |
| width | number | 300 | 宽度 |
| height | number | 200 | 高度 |

---

## Editor 富文本编辑器

基于 TipTap 的富文本编辑器组件。

### 位置

`src/components/Editor/`

### 基础用法

```vue
<template>
  <Editor v-model="content" :height="400" />
</template>

<script setup>
import { ref } from 'vue'
import Editor from '@/components/Editor/index.vue'

const content = ref('<p>初始内容</p>')
</script>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string | '' | 编辑器内容（HTML） |
| height | number | 300 | 编辑器高度 |
| placeholder | string | '请输入内容...' | 占位文字 |
| disabled | boolean | false | 是否禁用 |
| toolbar | string[] | 全部 | 显示的工具栏按钮 |

### 工具栏配置

```vue
<Editor
  v-model="content"
  :toolbar="['bold', 'italic', 'heading', 'link', 'image', 'code']"
/>
```

可用工具：
- `bold` - 粗体
- `italic` - 斜体
- `heading` - 标题
- `link` - 链接
- `image` - 图片
- `code` - 代码块
- `blockquote` - 引用
- `bulletList` - 无序列表
- `orderedList` - 有序列表

---

## Watermark 水印组件

用于在页面上添加防篡改水印。

### 位置

`src/components/Watermark/`

### 基础用法

```vue
<template>
  <Watermark content="内部资料" :fullscreen="true" />
</template>

<script setup>
import Watermark from '@/components/Watermark/index.vue'
</script>
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | string | - | 水印文字 |
| fullscreen | boolean | false | 是否全屏显示 |
| opacity | number | 0.15 | 透明度 |
| fontSize | number | 14 | 字体大小 |
| color | string | '#000' | 字体颜色 |
| rotate | number | -30 | 旋转角度 |
| gap | number[] | [100, 100] | 水印间距 |

### 使用 Store 管理

项目中可通过 `useWatermarkStore` 管理水印：

```typescript
import { useWatermarkStore } from '@/stores/watermark'

const watermarkStore = useWatermarkStore()

// 设置水印
watermarkStore.setWatermark({
  content: `${userStore.userInfo?.username} - ${formatDate(new Date())}`,
})

// 清除水印
watermarkStore.clearWatermark()
```

---

## PermissionButton 权限按钮

封装了权限检查的按钮组件。

### 位置

`src/components/Permission/PermissionButton.vue`

### 基础用法

```vue
<template>
  <PermissionButton permission="user.create">
    新增用户
  </PermissionButton>
  
  <PermissionButton :permission="['user.edit', 'user.admin']">
    编辑
  </PermissionButton>
</template>

<script setup>
import PermissionButton from '@/components/Permission/PermissionButton.vue'
</script>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| permission | string \| string[] | - | 所需权限 |
| all | boolean | false | 是否需要全部权限 |

---

## 使用建议

### 1. 按需引入

这些组件在需要时引入，不需要全局注册：

```typescript
import IconPicker from '@/components/IconPicker/index.vue'
```

### 2. 与 Pro 组件配合

在 ProForm 中使用这些组件：

```typescript
const formItems = [
  {
    name: 'icon',
    label: '图标',
    type: 'custom',
    render: () => h(IconPicker),
  },
]
```

### 3. 权限控制

结合权限系统使用：

```vue
<PermissionButton permission="user.export">
  <ExportOutlined />
  导出数据
</PermissionButton>
```

---

## 下一步

- 学习 [Composables](/guide/composables) 了解组合式函数
- 阅读 [工具函数](/guide/utils) 了解辅助方法
- 查看 [状态管理](/guide/state-management) 掌握 Pinia 使用
