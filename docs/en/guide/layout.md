# Layout System

This document introduces the layout system in Antdv Next Admin, including vertical/horizontal layouts, sidebar configuration, and responsive adaptation.

## Table of Contents

- [Layout Overview](#layout-overview)
- [Layout Modes](#layout-modes)
- [Sidebar Configuration](#sidebar-configuration)
- [Responsive Adaptation](#responsive-adaptation)
- [Layout Components](#layout-components)

---

## Layout Overview

The project provides two main layout modes:

- **Vertical Layout** - Sidebar on the left, content on the right (default)
- **Horizontal Layout** - Menu on top, content below

---

## Layout Modes

### Vertical Layout

```
+-----------------------------------+
|  Logo    |        Header          |
|----------+------------------------|
|          |                        |
| Sidebar  |       Content          |
|          |                        |
+----------+------------------------+
```

Features:
- Fixed sidebar width (default 210px)
- Support collapse
- Suitable for admin systems

### Horizontal Layout

```
+-----------------------------------+
|  Logo  |  Menu  |     Header      |
+--------+--------------------------+
|                                   |
|           Content                 |
|                                   |
+-----------------------------------+
```

Features:
- Menu on top
- More modern design
- Suitable for systems with fewer pages

### Switch Layout

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// Switch layout mode
layoutStore.setLayoutMode('horizontal')  // or 'vertical'
```

---

## Sidebar Configuration

### Sidebar Theme

Supports light and dark themes:

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Set sidebar theme
themeStore.setSidebarTheme('dark')
themeStore.setSidebarTheme('light')
```

### Sidebar Collapse

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// Toggle collapse
layoutStore.toggleSidebar()
```

---

## Responsive Adaptation

### Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| xs | < 576px | Extra small (mobile) |
| sm | >= 576px | Small (large mobile) |
| md | >= 768px | Medium (tablet) |
| lg | >= 992px | Large (small desktop) |
| xl | >= 1200px | Extra large (desktop) |
| xxl | >= 1600px | Extra extra large |

### Mobile Adaptation

On mobile:

1. Sidebar becomes drawer
2. Tab bar can scroll horizontally
3. Tables support horizontal scroll

```typescript
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

// Check if mobile
const isMobile = computed(() => layoutStore.isMobile)
```

---

## Layout Components

### AdminLayout

Main layout component located at `src/components/Layout/`.

```vue
<template>
  <AdminLayout>
    <router-view />
  </AdminLayout>
</template>
```

---

## Next Steps

- View [Tabs System](/en/guide/tabs)
- Read [Examples](/en/guide/examples)
- Learn [Theme System](/en/guide/theme)
