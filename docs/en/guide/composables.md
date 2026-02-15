# Composables

This document introduces the composable functions provided in the Antdv Next Admin project.

## Table of Contents

- [usePermission](#usepermission)
- [useFullscreen](#usefullscreen)
- [useWatermark](#usewatermark)

---

## usePermission

Composable function for permission checking in components.

### Location

`src/composables/usePermission.ts`

### Basic Usage

```typescript
import { usePermission } from '@/composables/usePermission'

const { can, canAll, hasRole, hasAnyRole } = usePermission()

// Check single permission
if (can('user.create')) {
  console.log('Can create user')
}

// Check multiple permissions (any match)
if (can(['user.edit', 'user.admin'])) {
  console.log('Can edit or admin')
}

// Check multiple permissions (all match)
if (canAll(['user.edit', 'user.approve'])) {
  console.log('Has edit and approve permissions')
}

// Check role
if (hasRole('admin')) {
  console.log('Is admin')
}
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| can | (permission: string \| string[]) => boolean | Check if has permission |
| canAll | (permissions: string[]) => boolean | Check if has all permissions |
| hasRole | (role: string) => boolean | Check if has role |
| hasAnyRole | (roles: string[]) => boolean | Check if has any role |

---

## useFullscreen

Composable function for controlling fullscreen of elements or page.

### Basic Usage

```typescript
import { useFullscreen } from '@/composables/useFullscreen'

// Fullscreen entire page
const { isFullscreen, enter, exit, toggle } = useFullscreen()

// Fullscreen specific element
const elementRef = ref<HTMLElement>()
const { isFullscreen, toggle } = useFullscreen(elementRef)
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| isFullscreen | Ref<boolean> | Is fullscreen |
| enter | () => Promise<void> | Enter fullscreen |
| exit | () => Promise<void> | Exit fullscreen |
| toggle | () => Promise<void> | Toggle fullscreen |

---

## useWatermark

Composable function for managing page watermarks.

### Basic Usage

```typescript
import { useWatermark } from '@/composables/useWatermark'

const { setWatermark, clearWatermark } = useWatermark()

// Set watermark
setWatermark('Confidential')

// Set with options
setWatermark({
  content: 'Confidential',
  fontSize: 16,
  color: '#ff0000',
  rotate: -45,
})

// Clear watermark
clearWatermark()
```

---

## Creating Custom Composables

### Template

```typescript
// src/composables/useXXX.ts
import { ref, computed } from 'vue'

export function useXXX() {
  const state = ref(0)
  const double = computed(() => state.value * 2)
  
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

---

## Next Steps

- View [Utils](/en/guide/utils)
- Learn [Common Components](/en/guide/common-components)
- Read [State Management](/en/guide/state-management)
