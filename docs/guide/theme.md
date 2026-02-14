# 主题系统

## 概述

Antdv Next Admin 提供了灵活的主题系统，通过 CSS 变量和 Pinia Store 实现动态主题切换，支持多种主题色和明暗模式。

## 主题模式

支持三种主题模式：

| 模式 | 说明 |
| --- | --- |
| `light` | 亮色模式 |
| `dark` | 暗色模式（使用 Ant Design `darkAlgorithm`） |
| `auto` | 跟随系统设置自动切换 |

### 切换主题模式

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

themeStore.setThemeMode('dark')   // 切换到暗色
themeStore.setThemeMode('light')  // 切换到亮色
themeStore.setThemeMode('auto')   // 跟随系统
```

## 主题色

内置 6 种预设主题色：

| 颜色 | 色值 | 名称 |
| --- | --- | --- |
| 🔵 蓝色 | `#1677ff` | 默认 |
| 🟢 绿色 | `#52c41a` | — |
| 🟣 紫色 | `#722ed1` | — |
| 🔴 红色 | `#f5222d` | — |
| 🟠 橙色 | `#fa8c16` | — |
| 🔵 青色 | `#13c2c2` | — |

### 设置主题色

```typescript
themeStore.setPrimaryColor('#1677ff')  // 任意有效颜色值
```

## CSS 变量

主题系统的核心是 `src/assets/styles/variables.css` 中定义的 100+ CSS 设计变量：

```css
:root {
  /* 主色 */
  --ant-primary-color: #1677ff;

  /* 背景色 */
  --bg-color: #ffffff;
  --bg-color-secondary: #f5f5f5;

  /* 文字颜色 */
  --text-color: rgba(0, 0, 0, 0.88);
  --text-color-secondary: rgba(0, 0, 0, 0.65);

  /* 侧边栏 */
  --sidebar-bg-color: #001529;
  --sidebar-text-color: rgba(255, 255, 255, 0.65);

  /* 更多变量... */
}
```

Theme Store 在主题切换时动态更新 `document.documentElement` 上的 CSS 变量。

### 使用 CSS 变量

在组件样式中直接使用：

```css
.my-component {
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}
```

::: tip 最佳实践
优先使用 CSS 变量而非硬编码颜色值，确保组件在所有主题模式下正确显示。
:::

## 侧边栏主题

侧边栏支持独立的深浅主题设置，不受全局主题模式影响：

- **深色侧边栏**：深蓝色背景（`#001529`），适合搭配亮色主内容区
- **浅色侧边栏**：白色背景，整体风格更加统一

侧边栏主题通过独立的 CSS 变量控制（`--sidebar-bg-color`、`--sidebar-text-color` 等）。

## 自定义主题

### 添加新的预设颜色

在 Theme Store 的颜色预设数组中添加新颜色即可。

### 修改默认 CSS 变量

编辑 `src/assets/styles/variables.css`，修改或添加 CSS 变量定义。修改后所有使用该变量的组件都会自动更新。

### Ant Design 主题

暗色模式通过 Ant Design Vue 的 `darkAlgorithm` 实现，确保所有 Ant Design 组件在暗色模式下正确渲染。
