# API 통합과 요청 처리

본 문서는 Antdv Next Admin 프로젝트에 백엔드 API를 통합하는 방법에 대해 자세히 설명합니다. Axios 설정, 요청 인터셉터, 오류 처리, 인증 흐름 등이 포함됩니다.

## 목차

- [HTTP 클라이언트 설정](#http-클라이언트-설정)
- [요청 인터셉터](#요청-인터셉터)
- [응답 인터셉터](#응답-인터셉터)
- [Token 인증과 갱신](#token-인증과-갱신)
- [오류 처리](#오류-처리)
- [Mock에서 실제 API로 전환](#mock에서-실제-api로-전환)
- [요청 재시도](#요청-재시도)
- [파일 업로드/다운로드](#파일-업로드다운로드)

---

## HTTP 클라이언트 설정

프로젝트의 HTTP 클라이언트 설정은 `src/utils/request.ts`에 있습니다.

### 기본 설정

```typescript
import axios from 'axios'

const request = axios.create({
  // API 기본 경로
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // 요청 타임아웃 시간(밀리초)
  timeout: 10000,
  
  // 요청 헤더
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 환경 변수 설정

```bash
# .env.development (개발 환경)
VITE_API_BASE_URL=/api
VITE_USE_MOCK=true

# .env.production (프로덕션 환경)
VITE_API_BASE_URL=https://api.your-domain.com
VITE_USE_MOCK=false
```

---

## 요청 인터셉터

요청 인터셉터는 요청 전송 전에 통합적으로 처리하는 데 사용됩니다. Token 추가, 요청 헤더 설정 등이 포함됩니다.

### 인증 Token 추가

```typescript
request.interceptors.request.use(
  (config) => {
    // localStorage에서 Token 가져오기
    const token = localStorage.getItem('access_token')
    
    // Token이 있으면 요청 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 캐시 방지를 위한 타임스탬프 추가
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

### 요청 로딩 상태

```typescript
import { message } from 'antdv-next'

let requestCount = 0

const showLoading = () => {
  requestCount++
  // 전역 로딩 상태 표시
}

const hideLoading = () => {
  requestCount--
  if (requestCount <= 0) {
    // 전역 로딩 상태 숨김
  }
}

request.interceptors.request.use(
  (config) => {
    // 사일런트 요청이 아닌 경우 로딩 표시
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

### 커스텀 설정 옵션

```typescript
// 사일런트 요청 (로딩 상태를 표시하지 않음)
request.get('/api/config', { silent: true })

// 커스텀 타임아웃
request.get('/api/large-data', { timeout: 30000 })

// 커스텀 요청 헤더
request.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
```

---

## 응답 인터셉터

응답 인터셉터는 응답 데이터와 오류를 통합적으로 처리하는 데 사용됩니다.

### 표준 응답 형식

프로젝트가 기대하는 백엔드 응답 형식:

```typescript
interface ApiResponse<T> {
  code: number      // 상태 코드: 200은 성공을 나타냄
  data: T          // 응답 데이터
  message: string  // 메시지
}
```

### 응답 인터셉터 구현

```typescript
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 표준 응답 형식 처리
    if (data.code !== 200) {
      // 비즈니스 오류
      message.error(data.message || '요청 실패')
      return Promise.reject(new Error(data.message))
    }
    
    // 데이터 부분 반환
    return data.data
  },
  (error) => {
    // HTTP 오류 처리
    return Promise.reject(error)
  }
)
```

---

## Token 인증과 갱신

### 이중 Token 메커니즘

프로젝트는 Access Token + Refresh Token의 이중 Token 메커니즘을 사용합니다:

- **Access Token**: 단기 유효 (예: 15분), API 인증에 사용
- **Refresh Token**: 장기 유효 (예: 7일), 새 Access Token 획득에 사용

### Token 갱신 플로우

```typescript
// Token을 갱신 중인지 여부
let isRefreshing = false

// 갱신 완료를 기다리는 요청 큐
let refreshSubscribers: Array<(token: string) => void> = []

// Token 갱신 구독
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

// 모든 구독자에게 알림
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

// 응답 인터셉터에서 401 처리
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error
    
    // Token 만료 (401) 및 갱신 Token 요청이 아님
    if (response?.status === 401 && !config.url?.includes('/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true
        
        try {
          // 갱신 인터페이스 호출
          const refreshToken = localStorage.getItem('refresh_token')
          const { data } = await axios.post('/api/auth/refresh', {
            refreshToken,
          })
          
          // 새 Token 저장
          const newToken = data.data.token
          localStorage.setItem('access_token', newToken)
          
          // 대기 중인 요청에 알림
          onTokenRefreshed(newToken)
          isRefreshing = false
          
          // 원래 요청 재시도
          config.headers.Authorization = `Bearer ${newToken}`
          return request(config)
        } catch (refreshError) {
          // 갱신 실패, 로그아웃
          isRefreshing = false
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
      
      // 갱신 중, 요청을 큐에 추가
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

### Auth Store를 사용한 Token 관리

프로젝트에는 이미 Token 관리가 캡슐화되어 있으며, `useAuthStore`를 직접 사용하는 것이 좋습니다:

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 로그인
await authStore.login(username, password)

// 로그아웃
authStore.logout()

// Token은 요청 인터셉터에서 자동으로 추가됩니다
```

---

## 오류 처리

### 전역 오류 처리

```typescript
import { message, notification } from 'antdv-next'

request.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error
    
    if (response) {
      switch (response.status) {
        case 400:
          message.error(response.data?.message || '요청 매개변수 오류')
          break
        case 401:
          // Token 만료, 위 인터셉터에서 처리
          break
        case 403:
          message.error('이 작업을 실행할 권한이 없습니다')
          break
        case 404:
          message.error('요청한 리소스가 존재하지 않습니다')
          break
        case 500:
          notification.error({
            message: '서버 오류',
            description: response.data?.message || '나중에 다시 시도하세요',
          })
          break
        default:
          message.error(response.data?.message || '요청 실패')
      }
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못함
      message.error('네트워크 오류, 네트워크 연결을 확인하세요')
    } else {
      // 요청 설정 오류
      message.error('요청 설정 오류')
    }
    
    return Promise.reject(error)
  }
)
```

### 비즈니스 오류 처리

API 호출 위치에서 특정 비즈니스 오류 처리:

```typescript
import { getUserList } from '@/api/user'

try {
  const data = await getUserList(params)
} catch (error: any) {
  if (error.response?.data?.code === 1001) {
    // 특정 비즈니스 오류 코드 처리
    message.warning('사용자 목록이 비어 있습니다')
  } else {
    throw error // 다른 오류는 계속 throw
  }
}
```

---

## Mock에서 실제 API로 전환

### 단계 1: 환경 변수 수정

```bash
# .env.development
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

### 단계 2: Mock 인터셉터 제거 (MSW 사용 시)

프로젝트가 MSW와 같은 Mock 라이브러리를 사용하는 경우 `main.ts`에서 제거해야 합니다:

```typescript
// main.ts
// 다음 코드를 제거하거나 주석 처리
// if (import.meta.env.VITE_USE_MOCK === 'true') {
//   import('./mock')
// }
```

### 단계 3: API 응답 형식 조정

백엔드 반환 형식이 다른 경우 응답 인터셉터를 수정합니다:

```typescript
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 다양한 응답 형식에 적응
    // 형식 A: { code: 200, data: {}, message: '' }
    // 형식 B: { status: 'success', result: {} }
    // 형식 C: 데이터를 직접 반환
    
    if (data.code === 200 || data.status === 'success') {
      return data.data || data.result || data
    }
    
    return Promise.reject(new Error(data.message || data.error))
  }
)
```

### 단계 4: CORS 처리

개발 환경에서 `vite.config.ts`에서 프록시를 설정합니다:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // /api 접두사를 제거해야 하는 경우
      },
    },
  },
})
```

---

## 요청 재시도

### 자동 재시도 메커니즘

```typescript
import axiosRetry from 'axios-retry'

axiosRetry(request, {
  retries: 3,                    // 재시도 횟수
  retryDelay: (retryCount) => {
    return retryCount * 1000     // 지연 시간 (밀리초)
  },
  retryCondition: (error) => {
    // 네트워크 오류 또는 5xx 오류인 경우에만 재시도
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.response?.status >= 500
  },
})
```

### 수동 재시도

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

// 사용
const data = await fetchWithRetry(() => getUserList(params))
```

---

## 파일 업로드/다운로드

### 파일 업로드

```typescript
// API 인터페이스
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

컴포넌트에서 사용:

```vue
<template>
  <a-upload
    :custom-request="handleUpload"
    :show-upload-list="false"
  >
    <a-button>
      <upload-outlined />
      파일 업로드
    </a-button>
  </a-upload>
</template>

<script setup>
import { uploadFile } from '@/api/file'

const handleUpload = async ({ file, onSuccess, onError }) => {
  try {
    const result = await uploadFile(file, (percent) => {
      console.log('업로드 진행률:', percent + '%')
    })
    onSuccess(result)
  } catch (error) {
    onError(error)
  }
}
</script>
```

### 파일 다운로드

```typescript
// API 인터페이스
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

// 사용
downloadFile('/api/export/users', '사용자목록.xlsx')
```

---

## 모범 사례

### 1. API 모듈화 구성

비즈니스 도메인별로 API 파일 구성:

```
src/api/
├── auth.ts       # 인증 관련
├── user.ts       # 사용자 관리
├── role.ts       # 역할·권한
├── system.ts     # 시스템 설정
└── file.ts       # 파일 작업
```

### 2. 타입 안전성

모든 API에 대한 요청 및 응답 타입 정의:

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

### 3. 요청 취소

```typescript
import axios from 'axios'

const controller = new AbortController()

request.get('/api/large-data', {
  signal: controller.signal,
})

// 요청 취소
controller.abort()
```

### 4. 동시성 제어

```typescript
import { throttle, debounce } from 'lodash-es'

// 쓰로틀: 요청 빈도 제한
const throttledSearch = throttle((keyword) => {
  return searchApi(keyword)
}, 300)

// 디바운스: 입력 중지를 기다림
const debouncedSave = debounce((data) => {
  return saveApi(data)
}, 500)
```

---

## 다음 단계

- [상태 관리](/guide/state-management)에서 Pinia를 사용한 애플리케이션 상태 관리 학습
- [유틸리티 함수](/guide/utils)에서 일반적인 유틸리티 메서드 확인
- [개발 워크플로우](/guide/development-workflow)에서 프로젝트 개발 규칙 습득
