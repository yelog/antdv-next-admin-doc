# Development Workflow

This document describes the standard development workflow in the Antdv Next Admin project, including how to add new pages, create components, add Mock APIs, and other common tasks.

## Table of Contents

- [Adding a New Page](#adding-a-new-page)
- [Creating a New Pro Component](#creating-a-new-pro-component)
- [Adding Mock APIs](#adding-mock-apis)
- [Adding Routes and Permissions](#adding-routes-and-permissions)
- [Code Commit Guidelines](#code-commit-guidelines)
- [Debugging Tips](#debugging-tips)

---

## Adding a New Page

### 1. Create the Page Component

Create a new folder and `index.vue` file in the `src/views/` directory:

```
src/views/
└── your-module/
    └── index.vue
```

Page component template:

```vue
<template>
  <div class="your-module-container">
    <!-- Page content -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'antdv-next'

// Route info
const route = useRoute()

// Reactive data
const loading = ref(false)
const dataList = ref([])

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    // Call API
  } catch (error) {
    message.error('Failed to fetch data')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.your-module-container {
  padding: 24px;
}
</style>
```

### 2. Add Routes

Edit `src/router/routes.ts` and add to the appropriate route array based on page type:

#### Static Routes (No login required)

```typescript
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/your-page',
    name: 'YourPage',
    component: () => import('@/views/your-module/index.vue'),
    meta: {
      title: 'Page Title',
      hidden: true, // Don't show in menu
    },
  },
]
```

#### Basic Routes (Login required)

```typescript
export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/your-page',
    name: 'YourPage',
    component: () => import('@/views/your-module/index.vue'),
    meta: {
      title: 'Page Title',
      icon: 'DashboardOutlined', // Ant Design icon name
      requiresAuth: true,
    },
  },
]
```

#### Async Routes (Requires specific permissions)

```typescript
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system/your-module',
    name: 'YourModule',
    component: () => import('@/views/system/your-module/index.vue'),
    meta: {
      title: 'Module Management',
      icon: 'SettingOutlined',
      requiresAuth: true,
      requiredPermissions: ['system.module.view'], // Required permission
      keepAlive: true, // Enable page caching
    },
  },
]
```

### 3. Add Internationalization

Add translations in `src/locales/zh-CN.ts` and `src/locales/en-US.ts`:

```typescript
// en-US.ts
export default {
  menu: {
    yourModule: 'Module Management',
  },
  yourModule: {
    title: 'Page Title',
    description: 'Page Description',
  },
}
```

### 4. Add Mock Data (Optional)

If Mock data support is needed, refer to the [Adding Mock APIs](#adding-mock-apis) section.

---

## Creating a New Pro Component

### 1. Component Directory Structure

```
src/components/Pro/ProYourComponent/
├── index.vue          # Main component
├── types.ts           # Type definitions (optional)
├── utils.ts           # Utility functions (optional)
└── style.scss         # Style file (optional)
```

### 2. Component Template

```vue
<template>
  <div class="pro-your-component">
    <!-- Component content -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props definition
interface Props {
  title?: string
  data?: any[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  data: () => [],
  loading: false,
})

// Emits definition
const emit = defineEmits<{
  click: [item: any]
  change: [value: any]
}>()

// Computed properties
const displayData = computed(() => {
  return props.data.filter(item => item.visible)
})

// Methods
const handleClick = (item: any) => {
  emit('click', item)
}
</script>

<style scoped lang="scss">
.pro-your-component {
  // Component styles
}
</style>
```

### 3. Type Definitions

Add component types in `src/types/pro.ts`:

```typescript
// Pro component type definitions
export interface ProYourComponentProps {
  title?: string
  data?: ProYourComponentItem[]
  loading?: boolean
}

export interface ProYourComponentItem {
  id: string
  label: string
  value: any
  visible?: boolean
}
```

### 4. Export Component

Export in `src/components/Pro/index.ts`:

```typescript
export { default as ProYourComponent } from './ProYourComponent/index.vue'
```

---

## Adding Mock APIs

### 1. Create Data File

Create a data file in the `mock/data/` directory:

```typescript
// mock/data/your-module.data.ts
import { faker } from '@faker-js/faker/locale/zh_CN'

export interface YourModuleItem {
  id: string
  name: string
  status: 'active' | 'inactive'
  createdAt: string
}

export const yourModuleData: YourModuleItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: `module_${i + 1}`,
  name: faker.commerce.productName(),
  status: faker.helpers.arrayElement(['active', 'inactive']),
  createdAt: faker.date.past().toISOString(),
}))
```

### 2. Create Mock Handler

Create a handler in the `mock/handlers/` directory:

```typescript
// mock/handlers/your-module.mock.ts
import { defineMock } from 'vite-plugin-mock-dev-server'
import { yourModuleData } from '../data/your-module.data'

export default defineMock([
  {
    url: '/api/your-module/list',
    method: 'GET',
    response: ({ query }) => {
      const { current = 1, pageSize = 10, name, status } = query
      
      // Filter
      let list = [...yourModuleData]
      if (name) {
        list = list.filter(item => item.name.includes(name))
      }
      if (status) {
        list = list.filter(item => item.status === status)
      }
      
      // Pagination
      const start = (current - 1) * pageSize
      const end = start + parseInt(pageSize)
      
      return {
        code: 200,
        data: {
          list: list.slice(start, end),
          total: list.length,
        },
        message: 'success',
      }
    },
  },
  // ... POST, PUT, DELETE handlers
])
```

### 3. Create API Interface

Create an interface file in the `src/api/` directory:

```typescript
// src/api/your-module.ts
import request from '@/utils/request'
import type { YourModuleItem } from '@/types/your-module'

export interface GetYourModuleListParams {
  current?: number
  pageSize?: number
  name?: string
  status?: string
}

export const getYourModuleList = (params: GetYourModuleListParams) => {
  return request.get('/api/your-module/list', { params })
}

export const createYourModule = (data: Partial<YourModuleItem>) => {
  return request.post('/api/your-module', data)
}

export const updateYourModule = (id: string, data: Partial<YourModuleItem>) => {
  return request.put(`/api/your-module/${id}`, data)
}

export const deleteYourModule = (id: string) => {
  return request.delete(`/api/your-module/${id}`)
}
```

---

## Adding Routes and Permissions

### Route Permission Configuration

Configure permissions in the route's `meta` field:

```typescript
{
  path: '/system/users',
  component: () => import('@/views/system/users/index.vue'),
  meta: {
    title: 'User Management',
    icon: 'UserOutlined',
    requiresAuth: true,
    requiredPermissions: ['user.view'],
    keepAlive: true,
  },
}
```

### Button-level Permissions

Use permission directives in pages:

```vue
<template>
  <div>
    <a-button v-permission="'user.create'">Add User</a-button>
    <a-button v-permission="['user.edit', 'user.admin']">Edit</a-button>
    <a-button v-permission.all="['user.edit', 'user.approve']">Approve</a-button>
  </div>
</template>
```

Use composable function:

```typescript
import { usePermission } from '@/composables/usePermission'

const { can, canAll } = usePermission()

if (can('user.edit')) {
  // Has permission
}

if (canAll(['user.edit', 'user.delete'])) {
  // Has all permissions
}
```

---

## Code Commit Guidelines

### Conventional Commits

Commit message format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(user): add user batch import feature` |
| `fix` | Bug fix | `fix(auth): fix token expiration redirect issue` |
| `docs` | Documentation update | `docs(readme): update deployment instructions` |
| `style` | Code style | `style(button): unify button spacing` |
| `refactor` | Code refactoring | `refactor(table): optimize table rendering performance` |
| `perf` | Performance optimization | `perf(list): virtual scroll optimization` |
| `test` | Tests | `test(api): add user API tests` |
| `chore` | Build/tools | `chore(deps): upgrade Vue version` |

### Examples

```bash
# New feature
git commit -m "feat(user): add user batch import feature

- Support Excel file upload
- Real-time import progress display
- Export import results"

# Bug fix
git commit -m "fix(auth): fix token expiration not redirecting to login page"

# Documentation update
git commit -m "docs(deploy): add Docker deployment instructions"
```

---

## Debugging Tips

### Vue DevTools

1. Install [Vue DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) browser extension
2. Inspect component hierarchy and Props
3. View Pinia Store state
4. Monitor event triggering

### Network Request Debugging

```typescript
// Add request interceptor logging
request.interceptors.request.use(
  (config) => {
    console.log('[Request]', config.method?.toUpperCase(), config.url)
    return config
  }
)

// Add response interceptor logging
request.interceptors.response.use(
  (response) => {
    console.log('[Response]', response.config.url, response.data)
    return response
  },
  (error) => {
    console.error('[Error]', error.config?.url, error.message)
    return Promise.reject(error)
  }
)
```

### Route Debugging

```typescript
// Add navigation guard logging in router/index.ts
router.beforeEach((to, from, next) => {
  console.log('[Router] Navigate to:', to.path, 'from:', from.path)
  console.log('[Router] Meta:', to.meta)
  next()
})
```

---

## Next Steps

- Learn about [API Integration](/en/guide/api-integration) for backend service connection
- Read [State Management](/en/guide/state-management) to master Pinia usage
- View [Utils](/en/guide/utils) to learn about utility functions
