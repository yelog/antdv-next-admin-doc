# API Integration

This document details how to integrate backend APIs in the Antdv Next Admin project, including Axios configuration, request/response interceptors, error handling, authentication flow, and more.

## Table of Contents

- [HTTP Client Configuration](#http-client-configuration)
- [Request Interceptors](#request-interceptors)
- [Response Interceptors](#response-interceptors)
- [Token Authentication and Refresh](#token-authentication-and-refresh)
- [Error Handling](#error-handling)
- [Switching from Mock to Real API](#switching-from-mock-to-real-api)
- [Request Retry](#request-retry)
- [File Upload and Download](#file-upload-and-download)

---

## HTTP Client Configuration

The HTTP client configuration is located at `src/utils/request.ts`.

### Basic Configuration

```typescript
import axios from 'axios'

const request = axios.create({
  // API base path
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // Request timeout (milliseconds)
  timeout: 10000,
  
  // Request headers
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### Environment Variable Configuration

```bash
# .env.development (Development environment)
VITE_API_BASE_URL=/api
VITE_USE_MOCK=true

# .env.production (Production environment)
VITE_API_BASE_URL=https://api.your-domain.com
VITE_USE_MOCK=false
```

---

## Request Interceptors

Request interceptors are used to process requests uniformly before they are sent, such as adding tokens, setting request headers, etc.

### Adding Authentication Token

```typescript
request.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token')
    
    // Add to request header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add timestamp to prevent caching
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

### Request Loading State

```typescript
import { message } from 'antdv-next'

let requestCount = 0

const showLoading = () => {
  requestCount++
  // Show global loading state
}

const hideLoading = () => {
  requestCount--
  if (requestCount <= 0) {
    // Hide global loading state
  }
}

request.interceptors.request.use(
  (config) => {
    // Show loading for non-silent requests
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

---

## Response Interceptors

Response interceptors are used to process response data and errors uniformly.

### Standard Response Format

The expected backend response format:

```typescript
interface ApiResponse<T> {
  code: number      // Status code: 200 means success
  data: T          // Response data
  message: string  // Message
}
```

### Response Interceptor Implementation

```typescript
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // Handle standard response format
    if (data.code !== 200) {
      // Business error
      message.error(data.message || 'Request failed')
      return Promise.reject(new Error(data.message))
    }
    
    // Return data portion
    return data.data
  },
  (error) => {
    // HTTP error handling
    return Promise.reject(error)
  }
)
```

---

## Token Authentication and Refresh

### Dual Token Mechanism

The project uses a dual token mechanism with Access Token and Refresh Token:

- **Access Token**: Short-term valid (e.g., 15 minutes), used for API authentication
- **Refresh Token**: Long-term valid (e.g., 7 days), used to obtain a new Access Token

### Token Refresh Flow

```typescript
// Is refreshing token
let isRefreshing = false

// Request queue waiting for refresh
let refreshSubscribers: Array<(token: string) => void> = []

// Subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

// Notify all subscribers
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

// Handle 401 in response interceptor
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error
    
    // Token expired (401) and not a refresh token request
    if (response?.status === 401 && !config.url?.includes('/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true
        
        try {
          // Call refresh endpoint
          const refreshToken = localStorage.getItem('refresh_token')
          const { data } = await axios.post('/api/auth/refresh', {
            refreshToken,
          })
          
          // Save new token
          const newToken = data.data.token
          localStorage.setItem('access_token', newToken)
          
          // Notify waiting requests
          onTokenRefreshed(newToken)
          isRefreshing = false
          
          // Retry original request
          config.headers.Authorization = `Bearer ${newToken}`
          return request(config)
        } catch (refreshError) {
          // Refresh failed, logout
          isRefreshing = false
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
      
      // Refreshing, add request to queue
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

### Using Auth Store

The project provides encapsulated token management, recommend using `useAuthStore` directly:

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Login
await authStore.login(username, password)

// Logout
authStore.logout()

// Token is automatically added in request interceptor
```

---

## Error Handling

### Global Error Handling

```typescript
import { message, notification } from 'antdv-next'

request.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error
    
    if (response) {
      switch (response.status) {
        case 400:
          message.error(response.data?.message || 'Bad request')
          break
        case 401:
          // Token expired, handled by interceptor above
          break
        case 403:
          message.error('Permission denied')
          break
        case 404:
          message.error('Resource not found')
          break
        case 500:
          notification.error({
            message: 'Server error',
            description: response.data?.message || 'Please try again later',
          })
          break
        default:
          message.error(response.data?.message || 'Request failed')
      }
    } else if (error.request) {
      // Request sent but no response received
      message.error('Network error, please check your connection')
    } else {
      // Request configuration error
      message.error('Request configuration error')
    }
    
    return Promise.reject(error)
  }
)
```

---

## Switching from Mock to Real API

### Step 1: Modify Environment Variables

```bash
# .env.development
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

### Step 2: Configure Proxy

Configure proxy in `vite.config.ts` for development environment:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

---

## File Upload and Download

### File Upload

```typescript
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

### File Download

```typescript
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
```

---

## Best Practices

### 1. Modular API Organization

Organize API files by business domain:

```
src/api/
├── auth.ts       # Authentication
├── user.ts       # User management
├── role.ts       # Roles and permissions
├── system.ts     # System settings
└── file.ts       # File operations
```

### 2. Type Safety

Define request and response types for all APIs:

```typescript
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export const getUserList = (params: PaginationParams) => {
  return request.get<ApiResponse<PaginatedResult<User>>>('/api/users', { params })
}
```

### 3. Request Cancellation

```typescript
import axios from 'axios'

const controller = new AbortController()

request.get('/api/large-data', {
  signal: controller.signal,
})

// Cancel request
controller.abort()
```

---

## Next Steps

- Read [State Management](/en/guide/state-management) to understand Pinia
- View [Utils](/en/guide/utils) to learn about utility functions
- Learn [Development Workflow](/en/guide/development-workflow) for project standards
