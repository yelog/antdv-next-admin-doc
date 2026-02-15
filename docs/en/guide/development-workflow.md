# 开发工作流

本文档介绍在 Antdv Next Admin 项目中进行日常开发的标准工作流程，包括如何添加新页面、创建组件、添加 Mock API 等常见任务。

## 目录

- [添加新页面](#添加新页面)
- [创建新的 Pro 组件](#创建新的-pro-组件)
- [添加 Mock API](#添加-mock-api)
- [添加路由和权限](#添加路由和权限)
- [代码提交规范](#代码提交规范)
- [调试技巧](#调试技巧)

---

## 添加新页面

### 1. 创建页面组件

在 `src/views/` 目录下创建新的文件夹和 `index.vue` 文件：

```
src/views/
└── your-module/
    └── index.vue
```

页面组件模板：

```vue
<template>
  <div class="your-module-container">
    <!-- 页面内容 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'antdv-next'

// 路由信息
const route = useRoute()

// 响应式数据
const loading = ref(false)
const dataList = ref([])

// 方法
const fetchData = async () => {
  loading.value = true
  try {
    // 调用 API
  } catch (error) {
    message.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
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

### 2. 添加路由

编辑 `src/router/routes.ts`，根据页面类型添加到对应的路由数组：

#### 静态路由（无需登录）

```typescript
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/your-page',
    name: 'YourPage',
    component: () => import('@/views/your-module/index.vue'),
    meta: {
      title: '页面标题',
      hidden: true, // 不在菜单中显示
    },
  },
]
```

#### 基础路由（需要登录）

```typescript
export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/your-page',
    name: 'YourPage',
    component: () => import('@/views/your-module/index.vue'),
    meta: {
      title: '页面标题',
      icon: 'DashboardOutlined', // Ant Design 图标名
      requiresAuth: true,
    },
  },
]
```

#### 异步路由（需要特定权限）

```typescript
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system/your-module',
    name: 'YourModule',
    component: () => import('@/views/system/your-module/index.vue'),
    meta: {
      title: '模块管理',
      icon: 'SettingOutlined',
      requiresAuth: true,
      requiredPermissions: ['system.module.view'], // 所需权限
      keepAlive: true, // 是否缓存页面
    },
  },
]
```

### 3. 添加国际化

在 `src/locales/zh-CN.ts` 和 `src/locales/en-US.ts` 中添加翻译：

```typescript
// zh-CN.ts
export default {
  menu: {
    yourModule: '模块管理',
  },
  yourModule: {
    title: '页面标题',
    description: '页面描述',
  },
}

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

### 4. 添加 Mock 数据（可选）

如果需要 Mock 数据支持，参考 [添加 Mock API](#添加-mock-api) 章节。

---

## 创建新的 Pro 组件

### 1. 组件目录结构

```
src/components/Pro/ProYourComponent/
├── index.vue          # 主组件
├── types.ts           # 类型定义（可选）
├── utils.ts           # 工具函数（可选）
└── style.scss         # 样式文件（可选）
```

### 2. 组件模板

```vue
<template>
  <div class="pro-your-component">
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props 定义
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

// Emits 定义
const emit = defineEmits<{
  click: [item: any]
  change: [value: any]
}>()

// 计算属性
const displayData = computed(() => {
  return props.data.filter(item => item.visible)
})

// 方法
const handleClick = (item: any) => {
  emit('click', item)
}
</script>

<style scoped lang="scss">
.pro-your-component {
  // 组件样式
}
</style>
```

### 3. 类型定义

在 `src/types/pro.ts` 中添加组件类型：

```typescript
// Pro 组件类型定义
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

### 4. 导出组件

在 `src/components/Pro/index.ts` 中导出：

```typescript
export { default as ProYourComponent } from './ProYourComponent/index.vue'
```

---

## 添加 Mock API

### 1. 创建数据文件

在 `mock/data/` 目录下创建数据文件：

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

### 2. 创建 Mock 处理器

在 `mock/handlers/` 目录下创建处理器：

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
      
      // 筛选
      let list = [...yourModuleData]
      if (name) {
        list = list.filter(item => item.name.includes(name))
      }
      if (status) {
        list = list.filter(item => item.status === status)
      }
      
      // 分页
      const start = (current - 1) * pageSize
      const end = start + parseInt(pageSize)
      const paginatedList = list.slice(start, end)
      
      return {
        code: 200,
        data: {
          list: paginatedList,
          total: list.length,
        },
        message: 'success',
      }
    },
  },
  {
    url: '/api/your-module/:id',
    method: 'GET',
    response: ({ params }) => {
      const item = yourModuleData.find(item => item.id === params.id)
      return {
        code: item ? 200 : 404,
        data: item || null,
        message: item ? 'success' : 'Not found',
      }
    },
  },
  {
    url: '/api/your-module',
    method: 'POST',
    response: ({ body }) => {
      const newItem = {
        id: `module_${yourModuleData.length + 1}`,
        ...body,
        createdAt: new Date().toISOString(),
      }
      yourModuleData.unshift(newItem)
      return {
        code: 200,
        data: newItem,
        message: '创建成功',
      }
    },
  },
  {
    url: '/api/your-module/:id',
    method: 'PUT',
    response: ({ params, body }) => {
      const index = yourModuleData.findIndex(item => item.id === params.id)
      if (index > -1) {
        yourModuleData[index] = { ...yourModuleData[index], ...body }
        return {
          code: 200,
          data: yourModuleData[index],
          message: '更新成功',
        }
      }
      return {
        code: 404,
        message: 'Not found',
      }
    },
  },
  {
    url: '/api/your-module/:id',
    method: 'DELETE',
    response: ({ params }) => {
      const index = yourModuleData.findIndex(item => item.id === params.id)
      if (index > -1) {
        yourModuleData.splice(index, 1)
        return {
          code: 200,
          message: '删除成功',
        }
      }
      return {
        code: 404,
        message: 'Not found',
      }
    },
  },
])
```

### 3. 创建 API 接口

在 `src/api/` 目录下创建接口文件：

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

export interface GetYourModuleListResult {
  list: YourModuleItem[]
  total: number
}

export const getYourModuleList = (params: GetYourModuleListParams) => {
  return request.get<GetYourModuleListResult>('/api/your-module/list', { params })
}

export const getYourModuleDetail = (id: string) => {
  return request.get<YourModuleItem>(`/api/your-module/${id}`)
}

export const createYourModule = (data: Partial<YourModuleItem>) => {
  return request.post<YourModuleItem>('/api/your-module', data)
}

export const updateYourModule = (id: string, data: Partial<YourModuleItem>) => {
  return request.put<YourModuleItem>(`/api/your-module/${id}`, data)
}

export const deleteYourModule = (id: string) => {
  return request.delete(`/api/your-module/${id}`)
}
```

---

## 添加路由和权限

### 路由权限配置

在路由的 `meta` 字段中配置权限：

```typescript
{
  path: '/system/users',
  component: () => import('@/views/system/users/index.vue'),
  meta: {
    // 基础信息
    title: '用户管理',
    icon: 'UserOutlined',
    
    // 权限控制
    requiresAuth: true,                    // 需要登录
    requiredPermissions: ['user.view'],    // 需要特定权限
    requiredRoles: ['admin'],              // 需要特定角色（可选）
    
    // 缓存配置
    keepAlive: true,                       // 启用 KeepAlive 缓存
    affix: false,                          // 是否在标签栏固定
    
    // 显示控制
    hidden: false,                         // 是否在菜单中隐藏
    hiddenInBreadcrumb: false,             // 是否在面包屑中隐藏
  },
}
```

### 按钮级权限

在页面中使用权限指令：

```vue
<template>
  <div>
    <!-- 单个权限 -->
    <a-button v-permission="'user.create'">新增用户</a-button>
    
    <!-- 多个权限（满足任一） -->
    <a-button v-permission="['user.edit', 'user.admin']">编辑</a-button>
    
    <!-- 多个权限（全部满足） -->
    <a-button v-permission.all="['user.edit', 'user.approve']">审核</a-button>
  </div>
</template>
```

使用组合式函数：

```typescript
import { usePermission } from '@/composables/usePermission'

const { can, canAll } = usePermission()

// 检查单个权限
if (can('user.edit')) {
  // 有权限
}

// 检查多个权限（全部）
if (canAll(['user.edit', 'user.delete'])) {
  // 有全部权限
}
```

---

## 代码提交规范

### Conventional Commits

提交信息格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| 类型 | 说明 | 示例 |
| --- | --- | --- |
| `feat` | 新功能 | `feat(user): 添加用户批量导入功能` |
| `fix` | 修复 Bug | `fix(auth): 修复 Token 过期未跳转问题` |
| `docs` | 文档更新 | `docs(readme): 更新部署说明` |
| `style` | 代码格式 | `style(button): 统一按钮间距` |
| `refactor` | 重构 | `refactor(table): 优化表格渲染性能` |
| `perf` | 性能优化 | `perf(list): 虚拟滚动优化` |
| `test` | 测试 | `test(api): 添加用户接口测试` |
| `chore` | 构建/工具 | `chore(deps): 升级 Vue 版本` |

### Scope 范围

| 范围 | 说明 |
| --- | --- |
| `user` | 用户模块 |
| `auth` | 认证授权 |
| `table` | ProTable 组件 |
| `form` | ProForm 组件 |
| `router` | 路由系统 |
| `store` | 状态管理 |
| `api` | 接口相关 |
| `docs` | 文档 |
| `deps` | 依赖升级 |

### 示例

```bash
# 新功能
git commit -m "feat(user): 添加用户批量导入功能

- 支持 Excel 文件上传
- 实时显示导入进度
- 导入结果导出"

# Bug 修复
git commit -m "fix(auth): 修复 Token 过期未自动跳转登录页"

# 文档更新
git commit -m "docs(deploy): 添加 Docker 部署说明"
```

---

## 调试技巧

### Vue DevTools

1. 安装 [Vue DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 浏览器扩展
2. 检查组件层次结构和 Props
3. 查看 Pinia Store 状态
4. 监控事件触发

### 网络请求调试

```typescript
// 在 request.ts 中开启调试
const request = axios.create({
  // ... 其他配置
})

// 添加请求拦截器日志
request.interceptors.request.use(
  (config) => {
    console.log('[Request]', config.method?.toUpperCase(), config.url, config.params || config.data)
    return config
  }
)

// 添加响应拦截器日志
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

### Mock 数据调试

检查 Mock 是否生效：

1. 查看浏览器控制台 Network 标签
2. 确认请求 URL 是否以 `/api` 开头
3. 检查 `.env.development` 中 `VITE_USE_MOCK=true`
4. 查看 Mock 服务器日志

### 路由调试

```typescript
// 在 router/index.ts 中添加导航守卫日志
router.beforeEach((to, from, next) => {
  console.log('[Router] Navigate to:', to.path, 'from:', from.path)
  console.log('[Router] Meta:', to.meta)
  next()
})
```

### 性能调试

```typescript
// 测量组件渲染时间
import { onMounted, onUpdated } from 'vue'

let startTime: number

onMounted(() => {
  startTime = performance.now()
})

onUpdated(() => {
  const endTime = performance.now()
  console.log(`[Performance] Component render time: ${endTime - startTime}ms`)
})
```

---

## 下一步

- 了解 [API 集成](/guide/api-integration) 学习如何连接后端服务
- 阅读 [状态管理](/guide/state-management) 掌握 Pinia 使用
- 查看 [工具函数](/guide/utils) 了解常用工具方法
