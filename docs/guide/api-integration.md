# API 集成与请求处理

本文档详细介绍如何在 Antdv Next Admin 项目中集成后端 API，包括 Axios 配置、请求拦截器、错误处理、认证流程等。

## 目录

- [HTTP 客户端配置](#http-客户端配置)
- [请求拦截器](#请求拦截器)
- [响应拦截器](#响应拦截器)
- [Token 认证与刷新](#token-认证与刷新)
- [错误处理](#错误处理)
- [从 Mock 切换到真实 API](#从-mock-切换到真实-api)
- [请求重试](#请求重试)
- [文件上传下载](#文件上传下载)

---

## HTTP 客户端配置

项目的 HTTP 客户端配置位于 `src/utils/request.ts`。

### 基础配置

```typescript
import axios from 'axios'

const request = axios.create({
  // API 基础路径
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // 请求超时时间（毫秒）
  timeout: 10000,
  
  // 请求头
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 环境变量配置

```bash
# .env.development（开发环境）
VITE_API_BASE_URL=/api
VITE_USE_MOCK=true

# .env.production（生产环境）
VITE_API_BASE_URL=https://api.your-domain.com
VITE_USE_MOCK=false
```

---

## 请求拦截器

请求拦截器用于在请求发送前统一处理，如添加 Token、设置请求头等。

### 添加认证 Token

```typescript
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 Token
    const token = localStorage.getItem('access_token')
    
    // 如果有 Token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
```

### 请求加载状态

```typescript
import { message } from 'antdv-next'

let requestCount = 0

const showLoading = () => {
  requestCount++
  // 显示全局加载状态
}

const hideLoading = () => {
  requestCount--
  if (requestCount <= 0) {
    // 隐藏全局加载状态
  }
}

request.interceptors.request.use(
  (config) => {
    // 非静默请求显示加载
    if (!config.silent) {
      showLoading()
    }
    return config
  }
)

request.interceptors.response.use(
  (response) => {
    if (!response.config.silent) {
      hideLoading()
    }
    return response
  },
  (error) => {
    if (!error.config?.silent) {
      hideLoading()
    }
    return Promise.reject(error)
  }
)
```

### 自定义配置选项

```typescript
// 静默请求（不显示加载状态）
request.get('/api/config', { silent: true })

// 自定义超时
request.get('/api/large-data', { timeout: 30000 })

// 自定义请求头
request.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
```

---

## 响应拦截器

响应拦截器用于统一处理响应数据和错误。

### 标准响应格式

项目期望的后端响应格式：

```typescript
interface ApiResponse<T> {
  code: number      // 状态码：200 表示成功
  data: T          // 响应数据
  message: string  // 提示信息
}
```

### 响应拦截器实现

```typescript
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 处理标准响应格式
    if (data.code !== 200) {
      // 业务错误
      message.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message))
    }
    
    // 返回数据部分
    return data.data
  },
  (error) => {
    // HTTP 错误处理
    return Promise.reject(error)
  }
)
```

---

## Token 认证与刷新

### 双 Token 机制

项目使用 Access Token + Refresh Token 的双 Token 机制：

- **Access Token**：短期有效（如 15 分钟），用于 API 认证
- **Refresh Token**：长期有效（如 7 天），用于获取新的 Access Token

### Token 刷新流程

```typescript
// 是否在刷新 Token
let isRefreshing = false

// 等待刷新完成的请求队列
let refreshSubscribers: Array<(token: string) => void> = []

// 订阅 Token 刷新
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

// 通知所有订阅者
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

// 响应拦截器中处理 401
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error
    
    // Token 过期（401）且不是刷新 Token 的请求
    if (response?.status === 401 && !config.url?.includes('/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true
        
        try {
          // 调用刷新接口
          const refreshToken = localStorage.getItem('refresh_token')
          const { data } = await axios.post('/api/auth/refresh', {
            refreshToken,
          })
          
          // 保存新 Token
          const newToken = data.data.token
          localStorage.setItem('access_token', newToken)
          
          // 通知等待的请求
          onTokenRefreshed(newToken)
          isRefreshing = false
          
          // 重试原请求
          config.headers.Authorization = `Bearer ${newToken}`
          return request(config)
        } catch (refreshError) {
          // 刷新失败，登出
          isRefreshing = false
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
      
      // 正在刷新，将请求加入队列
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          config.headers.Authorization = `Bearer ${token}`
          resolve(request(config))
        })
      })
    }
    
    return Promise.reject(error)
  }
)
```

### 使用 Auth Store 管理 Token

项目中已封装好 Token 管理，推荐直接使用 `useAuthStore`：

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 登录
await authStore.login(username, password)

// 登出
authStore.logout()

// Token 会自动在请求拦截器中添加
```

---

## 错误处理

### 全局错误处理

```typescript
import { message, notification } from 'antdv-next'

request.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error
    
    if (response) {
      switch (response.status) {
        case 400:
          message.error(response.data?.message || '请求参数错误')
          break
        case 401:
          // Token 过期，由上面的拦截器处理
          break
        case 403:
          message.error('没有权限执行此操作')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          notification.error({
            message: '服务器错误',
            description: response.data?.message || '请稍后重试',
          })
          break
        default:
          message.error(response.data?.message || '请求失败')
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      message.error('网络错误，请检查网络连接')
    } else {
      // 请求配置出错
      message.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)
```

### 业务错误处理

在 API 调用处处理特定业务错误：

```typescript
import { getUserList } from '@/api/user'

try {
  const data = await getUserList(params)
} catch (error: any) {
  if (error.response?.data?.code === 1001) {
    // 特定业务错误码处理
    message.warning('用户列表为空')
  } else {
    throw error // 其他错误继续抛出
  }
}
```

---

## 从 Mock 切换到真实 API

### 步骤 1：修改环境变量

```bash
# .env.development
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

### 步骤 2：移除 Mock 拦截器（如使用 MSW）

如果项目使用了 MSW 等 Mock 库，需要在 `main.ts` 中移除：

```typescript
// main.ts
// 移除或注释掉以下代码
// if (import.meta.env.VITE_USE_MOCK === 'true') {
//   import('./mock')
// }
```

### 步骤 3：调整 API 响应格式

如果后端返回格式不同，修改响应拦截器：

```typescript
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 适配不同的响应格式
    // 格式 A: { code: 200, data: {}, message: '' }
    // 格式 B: { status: 'success', result: {} }
    // 格式 C: 直接返回数据
    
    if (data.code === 200 || data.status === 'success') {
      return data.data || data.result || data
    }
    
    return Promise.reject(new Error(data.message || data.error))
  }
)
```

### 步骤 4：处理跨域

开发环境在 `vite.config.ts` 中配置代理：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // 如需移除 /api 前缀
      },
    },
  },
})
```

---

## 请求重试

### 自动重试机制

```typescript
import axiosRetry from 'axios-retry'

axiosRetry(request, {
  retries: 3,                    // 重试次数
  retryDelay: (retryCount) => {
    return retryCount * 1000     // 延迟时间（毫秒）
  },
  retryCondition: (error) => {
    // 只在网络错误或 5xx 错误时重试
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.response?.status >= 500
  },
})
```

### 手动重试

```typescript
const fetchWithRetry = async (apiCall: Function, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}

// 使用
const data = await fetchWithRetry(() => getUserList(params))
```

---

## 文件上传下载

### 文件上传

```typescript
// API 接口
export const uploadFile = (file: File, onProgress?: (percent: number) => void) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return request.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1)
      )
      onProgress?.(percent)
    },
  })
}
```

组件中使用：

```vue
<template>
  <a-upload
    :custom-request="handleUpload"
    :show-upload-list="false"
  >
    <a-button>
      <upload-outlined />
      上传文件
    </a-button>
  </a-upload>
</template>

<script setup>
import { uploadFile } from '@/api/file'

const handleUpload = async ({ file, onSuccess, onError }) => {
  try {
    const result = await uploadFile(file, (percent) => {
      console.log('上传进度:', percent + '%')
    })
    onSuccess(result)
  } catch (error) {
    onError(error)
  }
}
</script>
```

### 文件下载

```typescript
// API 接口
export const downloadFile = (url: string, filename: string) => {
  return request.get(url, {
    responseType: 'blob',
  }).then((blob) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  })
}

// 使用
downloadFile('/api/export/users', '用户列表.xlsx')
```

---

## 最佳实践

### 1. API 模块化组织

按业务领域组织 API 文件：

```
src/api/
├── auth.ts       # 认证相关
├── user.ts       # 用户管理
├── role.ts       # 角色权限
├── system.ts     # 系统设置
└── file.ts       # 文件操作
```

### 2. 类型安全

为所有 API 定义请求和响应类型：

```typescript
// types/api.ts
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export interface User {
  id: string
  username: string
  email: string
}

// api/user.ts
export const getUserList = (params: PaginationParams) => {
  return request.get<ApiResponse<PaginatedResult<User>>>('/api/users', { params })
}
```

### 3. 取消请求

```typescript
import axios from 'axios'

const controller = new AbortController()

request.get('/api/large-data', {
  signal: controller.signal,
})

// 取消请求
controller.abort()
```

### 4. 并发控制

```typescript
import { throttle, debounce } from 'lodash-es'

// 节流：限制请求频率
const throttledSearch = throttle((keyword) => {
  return searchApi(keyword)
}, 300)

// 防抖：等待输入停止
const debouncedSave = debounce((data) => {
  return saveApi(data)
}, 500)
```

---

## 下一步

- 阅读 [状态管理](/guide/state-management) 了解如何使用 Pinia 管理应用状态
- 查看 [工具函数](/guide/utils) 了解常用的工具方法
- 了解 [开发工作流](/guide/development-workflow) 掌握项目开发规范
