# 状态管理

本文档详细介绍 Antdv Next Admin 项目中使用的 Pinia 状态管理方案，包括各个 Store 的作用、使用方法和最佳实践。

## 目录

- [Pinia 基础](#pinia-基础)
- [认证状态 (auth)](#认证状态-auth)
- [权限状态 (permission)](#权限状态-permission)
- [主题状态 (theme)](#主题状态-theme)
- [标签页状态 (tabs)](#标签页状态-tabs)
- [布局状态 (layout)](#布局状态-layout)
- [其他 Store](#其他-store)
- [Store 组合使用](#store-组合使用)
- [最佳实践](#最佳实践)

---

## Pinia 基础

项目使用 Pinia 的 **Setup Store** 语法，这是 Vue 3 Composition API 风格的状态管理方式。

### Setup Store 模式

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义 Store
export const useExampleStore = defineStore('example', () => {
  // State: 使用 ref 定义状态
  const count = ref(0)
  const user = ref<User | null>(null)
  
  // Getters: 使用 computed 定义计算属性
  const doubleCount = computed(() => count.value * 2)
  const isLoggedIn = computed(() => !!user.value)
  
  // Actions: 普通函数定义方法
  const increment = () => {
    count.value++
  }
  
  const setUser = (userData: User) => {
    user.value = userData
  }
  
  // 必须返回所有需要暴露的内容
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

### 使用 Store

```vue
<script setup lang="ts">
import { useExampleStore } from '@/stores/example'
import { storeToRefs } from 'pinia'

// 获取 Store 实例
const exampleStore = useExampleStore()

// 使用 storeToRefs 解构保持响应式
const { count, doubleCount } = storeToRefs(exampleStore)

// 直接解构方法
const { increment } = exampleStore

// 在模板中直接使用
// {{ count }} - 响应式
// {{ doubleCount }} - 计算属性
// @click="increment" - 方法
</script>
```

### Store 与 Options Store 对比

| 特性 | Setup Store | Options Store |
|------|-------------|---------------|
| 语法 | Composition API | Options API |
| TypeScript | 更好的类型推断 | 需要额外配置 |
| 代码复用 | 可提取组合式函数 | 通过 mixins |
| 推荐度 | ✅ **推荐** | 兼容旧项目 |

---

## 认证状态 (auth)

管理用户认证信息，包括登录状态、Token、用户信息等。

### 位置

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
// 是否已登录
const isLoggedIn = computed(() => !!token.value && !!user.value)

// 用户角色列表（字符串数组）
const userRoles = computed(() => roles.value.map(role => role.code))

// 用户权限列表（字符串数组）
const userPermissions = computed(() => permissions.value.map(perm => perm.code))
```

### Actions

#### 登录

```typescript
// 登录（自动判断 Demo/生产模式）
await authStore.login(username, password)

// 登录成功后会自动：
// 1. 保存 Token 到 localStorage
// 2. 获取用户信息
// 3. 更新 roles 和 permissions
```

#### 登出

```typescript
// 清除所有认证信息
authStore.logout()

// 会自动清除：
// 1. Token 和 RefreshToken
// 2. 用户信息
// 3. localStorage 中的数据
```

#### 权限检查

```typescript
// 检查是否有某个角色
const hasRole = (role: string): boolean

// 检查是否有任意角色
const hasAnyRole = (roleList: string[]): boolean

// 检查是否有所有角色
const hasAllRoles = (roleList: string[]): boolean

// 检查是否有某个权限
const hasPermission = (permission: string): boolean

// 检查是否有任意权限
const hasAnyPermission = (permissionList: string[]): boolean

// 检查是否有所有权限
const hasAllPermissions = (permissionList: string[]): boolean
```

### 使用示例

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user, isLoggedIn, userRoles, userPermissions } = storeToRefs(authStore)

// 检查权限
const canEdit = computed(() => authStore.hasPermission('user.edit'))
const isAdmin = computed(() => authStore.hasRole('admin'))

// 登录处理
const handleLogin = async (values: { username: string; password: string }) => {
  try {
    await authStore.login(values.username, values.password)
    message.success('登录成功')
    router.push('/')
  } catch (error) {
    message.error('登录失败')
  }
}

// 登出处理
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <!-- 显示用户信息 -->
    <span v-if="isLoggedIn">欢迎, {{ user?.realName }}</span>
    
    <!-- 权限控制 -->
    <a-button v-if="canEdit">编辑</a-button>
    <a-tag v-if="isAdmin">管理员</a-tag>
  </div>
</template>
```

---

## 权限状态 (permission)

管理路由权限和动态菜单生成。

### 位置

`src/stores/permission.ts`

### State

```typescript
const routes = ref<RouteRecordRaw[]>([])        // 可访问的路由列表
const menuTree = ref<MenuItem[]>([])           // 菜单树
const loaded = ref(false)                       // 是否已加载权限
```

### Getters

```typescript
// 侧边栏菜单
const sidebarMenu = computed(() => menuTree.value)

// 面包屑导航
const breadcrumbList = computed(() => {
  // 根据当前路由生成面包屑
})
```

### Actions

#### 生成路由

```typescript
// 根据用户权限生成可访问路由
await permissionStore.generateRoutes()

// 内部逻辑：
// 1. 获取用户权限
// 2. 过滤 asyncRoutes
// 3. 生成菜单树
// 4. 添加到 router
```

### 使用示例

```vue
<script setup lang="ts">
import { usePermissionStore } from '@/stores/permission'

const permissionStore = usePermissionStore()

// 菜单数据用于渲染侧边栏
const menuList = computed(() => permissionStore.sidebarMenu)
</script>
```

---

## 主题状态 (theme)

管理应用主题，包括亮色/暗色模式、主题色、CSS 变量等。

### 位置

`src/stores/theme.ts`

### State

```typescript
const themeMode = ref<ThemeMode>('light')           // 主题模式
const primaryColor = ref<string>('#1677ff')        // 主题色
const sidebarTheme = ref<'light' | 'dark'>('dark') // 侧边栏主题
```

### 可选主题色

```typescript
const presetColors = [
  { name: '拂晓蓝', value: '#1677ff' },
  { name: '薄暮红', value: '#f5222d' },
  { name: '火山橙', value: '#fa541c' },
  { name: '日暮黄', value: '#faad14' },
  { name: '明青绿', value: '#13c2c2' },
  { name: '极客蓝', value: '#2f54eb' },
  { name: '酱紫紫', value: '#722ed1' },
]
```

### Actions

#### 设置主题模式

```typescript
// 设置主题模式
themeStore.setThemeMode('dark')     // 暗色
themeStore.setThemeMode('light')    // 亮色
themeStore.setThemeMode('auto')     // 跟随系统
```

#### 设置主题色

```typescript
// 设置主题色（预设或自定义）
themeStore.setPrimaryColor('#1677ff')
```

#### 设置侧边栏主题

```typescript
themeStore.setSidebarTheme('dark')   // 深色侧边栏
themeStore.setSidebarTheme('light')  // 浅色侧边栏
```

### 使用示例

```vue
<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { themeMode, primaryColor, sidebarTheme } = storeToRefs(themeStore)

// 切换主题
const toggleTheme = () => {
  const newMode = themeMode.value === 'light' ? 'dark' : 'light'
  themeStore.setThemeMode(newMode)
}
</script>

<template>
  <a-space>
    <span>当前主题: {{ themeMode }}</span>
    <a-button @click="toggleTheme">切换主题</a-button>
    
    <a-color-picker
      :value="primaryColor"
      @change="(color) => themeStore.setPrimaryColor(color)"
    />
  </a-space>
</template>
```

---

## 标签页状态 (tabs)

管理多标签页导航，包括标签列表、缓存、右键菜单等。

### 位置

`src/stores/tabs.ts`

### State

```typescript
const tabList = ref<TabItem[]>([])        // 标签列表
const cachedViews = ref<string[]>([])     // KeepAlive 缓存的视图
const activeKey = ref<string>('')         // 当前激活的标签
```

### Actions

#### 添加标签

```typescript
// 添加标签页
tabsStore.addTab({
  path: '/dashboard',
  title: '仪表盘',
  name: 'Dashboard',
  affix: true,              // 是否固定（不可关闭）
  keepAlive: true,          // 是否缓存
})
```

#### 关闭标签

```typescript
// 关闭指定标签
tabsStore.closeTab('/dashboard')

// 关闭其他标签
tabsStore.closeOthers('/dashboard')

// 关闭所有标签
tabsStore.closeAll()
```

#### 刷新标签

```typescript
// 刷新当前标签（清除缓存并重新加载）
tabsStore.refreshTab('/dashboard')
```

### 使用示例

```vue
<script setup lang="ts">
import { useTabsStore } from '@/stores/tabs'
import { useRoute } from 'vue-router'

const tabsStore = useTabsStore()
const route = useRoute()

// 监听路由变化自动添加标签
watch(
  () => route.path,
  () => {
    if (route.meta.title) {
      tabsStore.addTab({
        path: route.path,
        title: route.meta.title as string,
        name: route.name as string,
        affix: route.meta.affix as boolean,
        keepAlive: route.meta.keepAlive as boolean,
      })
    }
  },
  { immediate: true }
)

// 关闭标签
const handleClose = (path: string) => {
  tabsStore.closeTab(path)
}
</script>

<template>
  <div class="tabs-bar">
    <a-tag
      v-for="tab in tabsStore.tabList"
      :key="tab.path"
      :closable="!tab.affix"
      @close="handleClose(tab.path)"
    >
      {{ tab.title }}
    </a-tag>
  </div>
</template>
```

---

## 布局状态 (layout)

管理布局配置，包括侧边栏状态、布局模式等。

### 位置

`src/stores/layout.ts`

### State

```typescript
const sidebarCollapsed = ref(false)          // 侧边栏是否折叠
const layoutMode = ref<'vertical' | 'horizontal'>('vertical')  // 布局模式
const isMobile = ref(false)                  // 是否为移动端
```

### Actions

```typescript
// 切换侧边栏折叠状态
layoutStore.toggleSidebar()

// 设置布局模式
layoutStore.setLayoutMode('horizontal')

// 检测设备类型
layoutStore.detectDevice()
```

---

## 其他 Store

### 设置 (settings)

`src/stores/settings.ts` - 用户个性化设置

```typescript
const showBreadcrumb = ref(true)        // 显示面包屑
const showTabs = ref(true)              // 显示标签栏
const enableAnimation = ref(true)       // 启用动画
const grayMode = ref(false)             // 灰色模式
```

### 通知 (notification)

`src/stores/notification.ts` - 消息通知中心

```typescript
const unreadCount = ref(0)              // 未读消息数
const noticeList = ref<Notice[]>([])    // 通知列表

// Actions
fetchUnreadCount()                      // 获取未读数
markAsRead(id)                          // 标记已读
markAllAsRead()                         // 全部已读
```

### 字典 (dict)

`src/stores/dict.ts` - 字典数据缓存

```typescript
const dictData = ref<Record<string, DictItem[]>>({})

// Actions
getDict(type: string)                   // 获取字典
setDict(type: string, data)             // 设置字典
```

---

## Store 组合使用

在实际开发中，经常需要多个 Store 协同工作：

### 登录流程示例

```typescript
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'
import { useTabsStore } from '@/stores/tabs'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()
const tabsStore = useTabsStore()

const handleLogin = async (values) => {
  try {
    // 1. 登录认证
    await authStore.login(values.username, values.password)
    
    // 2. 生成权限路由
    await permissionStore.generateRoutes()
    
    // 3. 清空之前的标签
    tabsStore.closeAll()
    
    // 4. 跳转到首页
    router.push('/')
    
    message.success('登录成功')
  } catch (error) {
    message.error('登录失败')
  }
}
```

### 在组件中使用多个 Store

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useLayoutStore } from '@/stores/layout'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const layoutStore = useLayoutStore()

const { user } = storeToRefs(authStore)
const { themeMode, primaryColor } = storeToRefs(themeStore)
const { sidebarCollapsed } = storeToRefs(layoutStore)
</script>
```

---

## 最佳实践

### 1. 使用 storeToRefs 解构

```typescript
// ✅ 正确：保持响应式
const { count, doubleCount } = storeToRefs(store)

// ❌ 错误：失去响应式
const { count, doubleCount } = store
```

### 2. 不要在 Store 外修改 State

```typescript
// ✅ 正确：通过 Action 修改
store.increment()

// ❌ 错误：直接修改
store.count++
```

### 3. Store 职责单一

每个 Store 只管理一个领域的状态：

- `auth` - 只管理认证相关
- `theme` - 只管理主题相关
- `tabs` - 只管理标签页相关

### 4. 持久化状态

需要持久化的状态使用 `localStorage`：

```typescript
const token = ref(localStorage.getItem('token'))

watch(token, (newVal) => {
  if (newVal) {
    localStorage.setItem('token', newVal)
  } else {
    localStorage.removeItem('token')
  }
})
```

### 5. 类型安全

为 Store 定义完整的类型：

```typescript
import type { Store } from 'pinia'

export interface UserState {
  token: string | null
  user: User | null
}

export type UserStore = Store<'user', UserState>
```

---

## 下一步

- 了解 [开发工作流](/guide/development-workflow) 掌握项目开发规范
- 学习 [API 集成](/guide/api-integration) 连接后端服务
- 查看 [工具函数](/guide/utils) 了解常用工具方法
