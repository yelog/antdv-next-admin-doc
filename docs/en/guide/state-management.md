# State Management

This document details the Pinia state management solution used in the Antdv Next Admin project, including the role of each Store, usage methods, and best practices.

## Table of Contents

- [Pinia Basics](#pinia-basics)
- [Auth Store](#auth-store)
- [Permission Store](#permission-store)
- [Theme Store](#theme-store)
- [Tabs Store](#tabs-store)
- [Layout Store](#layout-store)
- [Other Stores](#other-stores)
- [Store Composition](#store-composition)
- [Best Practices](#best-practices)

---

## Pinia Basics

The project uses Pinia's **Setup Store** syntax, which is a state management approach in Vue 3 Composition API style.

### Setup Store Pattern

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Define Store
export const useExampleStore = defineStore('example', () => {
  // State: define state using ref
  const count = ref(0)
  const user = ref<User | null>(null)
  
  // Getters: define computed properties using computed
  const doubleCount = computed(() => count.value * 2)
  const isLoggedIn = computed(() => !!user.value)
  
  // Actions: define methods using regular functions
  const increment = () => {
    count.value++
  }
  
  const setUser = (userData: User) => {
    user.value = userData
  }
  
  // Must return all content to be exposed
  return {
    count,
    user,
    doubleCount,
    isLoggedIn,
    increment,
    setUser,
  }
})
```

### Using Stores

```vue
<script setup lang="ts">
import { useExampleStore } from '@/stores/example'
import { storeToRefs } from 'pinia'

// Get Store instance
const exampleStore = useExampleStore()

// Use storeToRefs to destructure while maintaining reactivity
const { count, doubleCount } = storeToRefs(exampleStore)

// Directly destructure methods
const { increment } = exampleStore
</script>
```

---

## Auth Store

Manages user authentication information, including login status, tokens, and user information.

### Location

`src/stores/auth.ts`

### State

```typescript
const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
const refreshTokenValue = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY))
const user = ref<User | null>(null)
const roles = ref<Role[]>([])
const permissions = ref<Permission[]>([])
```

### Getters

```typescript
// Is logged in
const isLoggedIn = computed(() => !!token.value && !!user.value)

// User role list (string array)
const userRoles = computed(() => roles.value.map(role => role.code))

// User permission list (string array)
const userPermissions = computed(() => permissions.value.map(perm => perm.code))
```

### Actions

#### Login

```typescript
// Login (automatically detects Demo/production mode)
await authStore.login(username, password)

// After successful login, automatically:
// 1. Save token to localStorage
// 2. Get user information
// 3. Update roles and permissions
```

#### Logout

```typescript
// Clear all authentication information
authStore.logout()

// Automatically clears:
// 1. Token and RefreshToken
// 2. User information
// 3. Data in localStorage
```

#### Permission Check

```typescript
// Check if has a role
const hasRole = (role: string): boolean

// Check if has any role
const hasAnyRole = (roleList: string[]): boolean

// Check if has all roles
const hasAllRoles = (roleList: string[]): boolean

// Check if has a permission
const hasPermission = (permission: string): boolean

// Check if has any permission
const hasAnyPermission = (permissionList: string[]): boolean

// Check if has all permissions
const hasAllPermissions = (permissionList: string[]): boolean
```

---

## Permission Store

Manages route permissions and dynamic menu generation.

### Location

`src/stores/permission.ts`

### Actions

#### Generate Routes

```typescript
// Generate accessible routes based on user permissions
await permissionStore.generateRoutes()

// Internal logic:
// 1. Get user permissions
// 2. Filter asyncRoutes
// 3. Generate menu tree
// 4. Add to router
```

---

## Theme Store

Manages application theme, including light/dark mode, theme colors, CSS variables, etc.

### Location

`src/stores/theme.ts`

### State

```typescript
const themeMode = ref<ThemeMode>('light')
const primaryColor = ref<string>('#1677ff')
const sidebarTheme = ref<'light' | 'dark'>('dark')
```

### Actions

```typescript
// Set theme mode
themeStore.setThemeMode('dark')     // Dark
themeStore.setThemeMode('light')    // Light
themeStore.setThemeMode('auto')     // Follow system

// Set theme color
themeStore.setPrimaryColor('#1677ff')

// Set sidebar theme
themeStore.setSidebarTheme('dark')
themeStore.setSidebarTheme('light')
```

---

## Tabs Store

Manages multi-tab navigation, including tab list, caching, and context menu.

### Location

`src/stores/tabs.ts`

### Actions

```typescript
// Add tab
tabsStore.addTab({
  path: '/dashboard',
  title: 'Dashboard',
  name: 'Dashboard',
  keepAlive: true,
  affix: false,
})

// Close tab
tabsStore.closeTab('/dashboard')

// Close other tabs
tabsStore.closeOthers('/dashboard')

// Close all tabs
tabsStore.closeAll()

// Refresh tab
tabsStore.refreshTab('/dashboard')
```

---

## Layout Store

Manages layout configuration, including sidebar state and layout mode.

### Location

`src/stores/layout.ts`

### Actions

```typescript
// Toggle sidebar collapse
layoutStore.toggleSidebar()

// Set layout mode
layoutStore.setLayoutMode('horizontal')

// Detect device type
layoutStore.detectDevice()
```

---

## Other Stores

### Settings Store

`src/stores/settings.ts` - User personalization settings

### Notification Store

`src/stores/notification.ts` - Message notification center

### Dict Store

`src/stores/dict.ts` - Dictionary data cache

---

## Store Composition

In actual development, multiple Stores often work together:

### Login Flow Example

```typescript
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'
import { useTabsStore } from '@/stores/tabs'

const handleLogin = async (values) => {
  try {
    // 1. Login authentication
    await authStore.login(values.username, values.password)
    
    // 2. Generate permission routes
    await permissionStore.generateRoutes()
    
    // 3. Clear previous tabs
    tabsStore.closeAll()
    
    // 4. Redirect to home
    router.push('/')
  } catch (error) {
    message.error('Login failed')
  }
}
```

---

## Best Practices

### 1. Use storeToRefs for Destructuring

```typescript
// ✅ Correct: Maintain reactivity
const { count, doubleCount } = storeToRefs(store)

// ❌ Incorrect: Lose reactivity
const { count, doubleCount } = store
```

### 2. Don't Modify State Outside Store

```typescript
// ✅ Correct: Modify through Action
store.increment()

// ❌ Incorrect: Direct modification
store.count++
```

### 3. Single Responsibility for Stores

Each Store should only manage state for one domain:

- `auth` - Only authentication related
- `theme` - Only theme related
- `tabs` - Only tabs related

---

## Next Steps

- Learn [Development Workflow](/en/guide/development-workflow) for project standards
- Study [API Integration](/en/guide/api-integration) for backend connection
- View [Utils](/en/guide/utils) for utility functions
