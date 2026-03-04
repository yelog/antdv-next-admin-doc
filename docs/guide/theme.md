# 主题系统

## 概述

Antdv Next Admin 提供了灵活的主题系统，通过 CSS 变量和 Pinia Store 实现动态主题切换，支持多种主题色和明暗模式。

## 主题模式

支持三种主题模式：

| 模式 | 说明 |
| --- | --- |
| `light` | 亮色模式 |
| `dark` | 暗色模式（通过 `.dark` 类 + CSS 变量实现） |
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
| 🔵 蓝色 | `#1890ff` | 拂晓蓝（默认） |
| 🟢 绿色 | `#52c41a` | 极光绿 |
| 🟣 紫色 | `#722ed1` | 酱紫 |
| 🔴 红色 | `#f5222d` | 薄暮红 |
| 🟠 橙色 | `#fa8c16` | 日暮橙 |
| 🔵 青色 | `#13c2c2` | 明青 |

### 设置主题色

```typescript
themeStore.setPrimaryColor('#1890ff')  // 任意有效颜色值
```

## CSS 变量

主题系统的核心是 `src/assets/styles/variables.css` 中定义的 100+ CSS 设计变量：

```css
:root {
  /* 主色系列（10级色阶） */
  --color-primary-1: #e6f7ff;
  --color-primary-2: #bae7ff;
  --color-primary-3: #91d5ff;
  --color-primary-4: #69c0ff;
  --color-primary-5: #40a9ff;
  --color-primary-6: #1890ff;  /* 主色 */
  --color-primary-7: #096dd9;
  --color-primary-8: #0050b3;
  --color-primary-9: #003a8c;
  --color-primary-10: #002766;
  --color-primary: var(--color-primary-6);

  /* 背景色 */
  --color-bg-container: #ffffff;
  --color-bg-layout: #F5F7FA;

  /* 文字颜色 */
  --color-text-primary: rgba(0, 0, 0, 0.85);
  --color-text-secondary: rgba(0, 0, 0, 0.65);
  --color-text-tertiary: rgba(0, 0, 0, 0.45);

  /* 更多变量... */
}

/* 暗色模式 */
:root.dark {
  --color-text-primary: rgba(255, 255, 255, 0.85);
  --color-text-secondary: rgba(255, 255, 255, 0.65);
  --color-bg-container: #1f1f1f;
  --color-bg-layout: #141414;
}
```

Theme Store 通过设置 `data-primary-color` 属性和 `.dark` 类来切换主题：

```html
<!-- 蓝色主题 + 亮色模式 -->
<html data-primary-color="blue">

<!-- 绿色主题 + 暗色模式 -->
<html data-primary-color="green" class="dark">
```

### 使用 CSS 变量

在组件样式中直接使用：

```css
.my-component {
  background-color: var(--color-bg-container);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
```

### 预设主题色

项目通过 `data-primary-color` 属性切换预设主题色：

| 属性值 | 主色 |
|--------|------|
| `blue` | `#1890ff`（默认） |
| `green` | `#52c41a` |
| `purple` | `#722ed1` |
| `red` | `#f5222d` |
| `orange` | `#fa8c16` |
| `cyan` | `#13c2c2` |

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

暗色模式通过 CSS 变量实现，确保所有 Ant Design 组件在暗色模式下正确渲染。项目定义了完整的暗色变量覆盖：

```css
:root.dark {
  --color-text-primary: rgba(255, 255, 255, 0.85);
  --color-bg-container: #1f1f1f;
  --shadow-card: 0 8px 28px rgba(0, 0, 0, 0.28);
}
```

### 灰色模式

项目还支持灰色模式，通过在 `<html>` 元素添加 `.gray-mode` 类实现：

```css
html.gray-mode {
  filter: grayscale(100%);
}
```
