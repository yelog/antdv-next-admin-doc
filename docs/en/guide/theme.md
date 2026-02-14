# Theme System

## Overview

Antdv Next Admin provides a flexible theming system using CSS variables and a Pinia Store for dynamic theme switching, supporting multiple color presets and light/dark modes.

## Theme Modes

Three theme modes are supported:

| Mode | Description |
| --- | --- |
| `light` | Light mode |
| `dark` | Dark mode (uses Ant Design `darkAlgorithm`) |
| `auto` | Follows system preference |

### Switching Theme Mode

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

themeStore.setThemeMode('dark')   // Switch to dark
themeStore.setThemeMode('light')  // Switch to light
themeStore.setThemeMode('auto')   // Follow system
```

## Primary Colors

6 built-in preset colors:

| Color | Value | Note |
| --- | --- | --- |
| Blue | `#1677ff` | Default |
| Green | `#52c41a` | — |
| Purple | `#722ed1` | — |
| Red | `#f5222d` | — |
| Orange | `#fa8c16` | — |
| Cyan | `#13c2c2` | — |

### Setting Primary Color

```typescript
themeStore.setPrimaryColor('#1677ff')  // Any valid color value
```

## CSS Variables

The core of the theme system is the 100+ CSS design tokens defined in `src/assets/styles/variables.css`:

```css
:root {
  /* Primary color */
  --ant-primary-color: #1677ff;

  /* Background */
  --bg-color: #ffffff;
  --bg-color-secondary: #f5f5f5;

  /* Text */
  --text-color: rgba(0, 0, 0, 0.88);
  --text-color-secondary: rgba(0, 0, 0, 0.65);

  /* Sidebar */
  --sidebar-bg-color: #001529;
  --sidebar-text-color: rgba(255, 255, 255, 0.65);

  /* More variables... */
}
```

The Theme Store dynamically updates CSS variables on `document.documentElement` when the theme changes.

### Using CSS Variables

Use them directly in component styles:

```css
.my-component {
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}
```

::: tip Best Practice
Prefer CSS variables over hardcoded color values to ensure components render correctly in all theme modes.
:::

## Sidebar Theme

The sidebar supports an independent light/dark theme, separate from the global theme mode:

- **Dark sidebar**: Deep blue background (`#001529`), pairs well with light main content
- **Light sidebar**: White background for a more unified look

Sidebar theming is controlled via dedicated CSS variables (`--sidebar-bg-color`, `--sidebar-text-color`, etc.).

## Customization

### Adding a New Preset Color

Add the new color to the preset colors array in the Theme Store.

### Modifying Default CSS Variables

Edit `src/assets/styles/variables.css` to modify or add CSS variable definitions. All components using those variables will update automatically.

### Ant Design Theming

Dark mode uses Ant Design Vue's `darkAlgorithm`, ensuring all Ant Design components render correctly in dark mode.
