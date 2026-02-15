# Composables

本文档介绍 Antdv Next Admin 项目中提供的组合式函数（Composables）。

## 目录

- [usePermission 权限检查](#usepermission-权限检查)
- [useFullscreen 全屏控制](#usefullscreen-全屏控制)
- [useWatermark 水印管理](#usewatermark-水印管理)

---

## usePermission 权限检查

用于在组件中进行权限检查的组合式函数。

### 位置

`src/composables/usePermission.ts`

### 基础用法

```typescript
import { usePermission } from '@/composables/usePermission'

const { can, canAll, hasRole, hasAnyRole } = usePermission()

// 检查单个权限
if (can('user.create')) {
  console.log('可以创建用户')
}

// 检查多个权限（满足任一）
if (can(['user.edit', 'user.admin'])) {
  console.log('可以编辑或管理员权限')
}

// 检查多个权限（全部满足）
if (canAll(['user.edit', 'user.approve'])) {
  console.log('有编辑和审核权限')
}

// 检查角色
if (hasRole('admin')) {
  console.log('是管理员')
}

// 检查多个角色（满足任一）
if (hasAnyRole(['admin', 'supervisor'])) {
  console.log('是管理员或主管')
}
```

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| can | (permission: string \| string[]) => boolean | 检查是否有权限 |
| canAll | (permissions: string[]) => boolean | 检查是否有全部权限 |
| hasRole | (role: string) => boolean | 检查是否有角色 |
| hasAnyRole | (roles: string[]) => boolean | 检查是否有任意角色 |

### 在模板中使用

```vue
<template>
  <div>
    <a-button v-if="can('user.create')">新增</a-button>
    <a-tag v-if="hasRole('admin')">管理员</a-tag>
  </div>
</template>

<script setup>
import { usePermission } from '@/composables/usePermission'

const { can, hasRole } = usePermission()
</script>
```

---

## useFullscreen 全屏控制

用于控制元素或页面全屏的组合式函数。

### 位置

`src/composables/useFullscreen.ts`

### 基础用法

```typescript
import { useFullscreen } from '@/composables/useFullscreen'

// 全屏整个页面
const { isFullscreen, enter, exit, toggle } = useFullscreen()

// 全屏特定元素
const elementRef = ref<HTMLElement>()
const { isFullscreen, toggle } = useFullscreen(elementRef)
```

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| isFullscreen | Ref<boolean> | 是否全屏 |
| enter | () => Promise<void> | 进入全屏 |
| exit | () => Promise<void> | 退出全屏 |
| toggle | () => Promise<void> | 切换全屏 |

### 示例

```vue
<template>
  <div ref="containerRef">
    <a-button @click="toggle">
      {{ isFullscreen ? '退出全屏' : '全屏' }}
    </a-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFullscreen } from '@/composables/useFullscreen'

const containerRef = ref()
const { isFullscreen, toggle } = useFullscreen(containerRef)
</script>
```

---

## useWatermark 水印管理

用于管理页面水印的组合式函数。

### 位置

`src/composables/useWatermark.ts`

### 基础用法

```typescript
import { useWatermark } from '@/composables/useWatermark'

const { setWatermark, clearWatermark } = useWatermark()

// 设置水印
setWatermark('内部资料 - 张三')

// 设置带选项的水印
setWatermark({
  content: '机密文件',
  fontSize: 16,
  color: '#ff0000',
  rotate: -45,
})

// 清除水印
clearWatermark()
```

### 选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | string | - | 水印文字 |
| fontSize | number | 14 | 字体大小 |
| color | string | '#000' | 字体颜色 |
| opacity | number | 0.15 | 透明度 |
| rotate | number | -30 | 旋转角度 |
| gap | [number, number] | [100, 100] | 间距 |

### 防篡改

水印组件具有防篡改机制，如果用户尝试删除水印元素，会自动重新生成。

---

## 创建自定义 Composable

### 模板

```typescript
// src/composables/useXXX.ts
import { ref, computed } from 'vue'

export function useXXX() {
  // State
  const state = ref(0)
  
  // Getters
  const double = computed(() => state.value * 2)
  
  // Actions
  const increment = () => {
    state.value++
  }
  
  return {
    state,
    double,
    increment,
  }
}
```

### 命名规范

- 使用 `camelCase`
- 以 `use` 开头
- 描述功能，如 `usePermission`, `useFullscreen`

### 最佳实践

1. **可复用逻辑提取到 Composable**

```typescript
// ✅ 好：提取可复用逻辑
export function useCount() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}

// 在多个组件中使用
const { count, increment } = useCount()
```

2. **参数使用对象形式**

```typescript
// ✅ 好：使用对象参数
export function useFetch(options: {
  url: string
  method?: 'GET' | 'POST'
  immediate?: boolean
}) {
  // ...
}

// 使用
useFetch({
  url: '/api/user',
  method: 'GET',
})
```

3. **返回响应式引用**

```typescript
// ✅ 好：返回 ref
const data = ref(null)
return { data }

// 使用时保持响应式
const { data } = useFetch()
console.log(data.value)
```

---

## 下一步

- 了解 [工具函数](/guide/utils) 学习辅助方法
- 查看 [通用组件](/guide/common-components) 了解可复用组件
- 阅读 [状态管理](/guide/state-management) 掌握 Pinia 使用
