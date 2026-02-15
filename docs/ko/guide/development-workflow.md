# 개발 워크플로우

본 문서는 Antdv Next Admin 프로젝트에서 일상적인 개발의 표준 워크플로우를 설명합니다. 새 페이지 추가, 컴포넌트 생성, Mock API 추가 등의 일반적인 작업이 포함됩니다.

## 목차

- [새 페이지 추가하기](#새-페이지-추가하기)
- [새로운 Pro 컴포넌트 만들기](#새로운-pro-컴포넌트-만들기)
- [Mock API 추가하기](#mock-api-추가하기)
- [라우트와 권한 추가하기](#라우트와-권한-추가하기)
- [코드 커밋 규칙](#코드-커밋-규칙)
- [디버깅 팁](#디버깅-팁)

---

## 새 페이지 추가하기

### 1. 페이지 컴포넌트 생성

`src/views/` 디렉토리에 새 폴더와 `index.vue` 파일을 생성합니다:

```
src/views/
└── your-module/
    └── index.vue
```

페이지 컴포넌트 템플릿:

```vue
<template>
  <div class="your-module-container">
    <!-- 페이지 콘텐츠 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'antdv-next'

// 라우트 정보
const route = useRoute()

// 반응형 데이터
const loading = ref(false)
const dataList = ref([])

// 메서드
const fetchData = async () => {
  loading.value = true
  try {
    // API 호출
  } catch (error) {
    message.error('데이터 가져오기 실패')
  } finally {
    loading.value = false
  }
}

// 라이프사이클
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

### 2. 라우트 추가

`src/router/routes.ts`를 편집하고, 페이지 타입에 따라 해당 라우트 배열에 추가합니다:

#### 정적 라우트 (로그인 불필요)

```typescript
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/your-page',
    name: 'YourPage',
    component: () => import('@/views/your-module/index.vue'),
    meta: {
      title: '페이지 제목',
      hidden: true, // 메뉴에 표시하지 않음
    },
  },
]
```

#### 기본 라우트 (로그인 필요)

```typescript
export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/your-page',
    name: 'YourPage',
    component: () => import('@/views/your-module/index.vue'),
    meta: {
      title: '페이지 제목',
      icon: 'DashboardOutlined', // Ant Design 아이콘명
      requiresAuth: true,
    },
  },
]
```

#### 비동기 라우트 (특정 권한 필요)

```typescript
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system/your-module',
    name: 'YourModule',
    component: () => import('@/views/system/your-module/index.vue'),
    meta: {
      title: '모듈 관리',
      icon: 'SettingOutlined',
      requiresAuth: true,
      requiredPermissions: ['system.module.view'], // 필요한 권한
      keepAlive: true, // 페이지를 캐시할지 여부
    },
  },
]
```

### 3. 국제화 추가

`src/locales/zh-CN.ts`와 `src/locales/en-US.ts`에 번역을 추가합니다:

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

### 4. Mock 데이터 추가 (선택사항)

Mock 데이터 지원이 필요한 경우 [Mock API 추가하기](#mock-api-추가하기) 섹션을 참조하세요.

---

## 새로운 Pro 컴포넌트 만들기

### 1. 컴포넌트 디렉토리 구조

```
src/components/Pro/ProYourComponent/
├── index.vue          # 메인 컴포넌트
├── types.ts           # 타입 정의 (선택사항)
├── utils.ts           # 유틸리티 함수 (선택사항)
└── style.scss         # 스타일 파일 (선택사항)
```

### 2. 컴포넌트 템플릿

```vue
<template>
  <div class="pro-your-component">
    <!-- 컴포넌트 콘텐츠 -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props 정의
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

// Emits 정의
const emit = defineEmits<{
  click: [item: any]
  change: [value: any]
}>()

// 계산된 속성
const displayData = computed(() => {
  return props.data.filter(item => item.visible)
})

// 메서드
const handleClick = (item: any) => {
  emit('click', item)
}
</script>

<style scoped lang="scss">
.pro-your-component {
  // 컴포넌트 스타일
}
</style>
```

### 3. 타입 정의

`src/types/pro.ts`에 컴포넌트 타입을 추가합니다:

```typescript
// Pro 컴포넌트 타입 정의
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

### 4. 컴포넌트 내보내기

`src/components/Pro/index.ts`에서 내보냅니다:

```typescript
export { default as ProYourComponent } from './ProYourComponent/index.vue'
```

---

## Mock API 추가하기

### 1. 데이터 파일 생성

`mock/data/` 디렉토리에 데이터 파일을 생성합니다:

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

### 2. Mock 핸들러 생성

`mock/handlers/` 디렉토리에 핸들러를 생성합니다:

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
      
      // 필터링
      let list = [...yourModuleData]
      if (name) {
        list = list.filter(item => item.name.includes(name))
      }
      if (status) {
        list = list.filter(item => item.status === status)
      }
      
      // 페이지네이션
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
        message: '생성 성공',
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
          message: '업데이트 성공',
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
          message: '삭제 성공',
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

### 3. API 인터페이스 생성

`src/api/` 디렉토리에 인터페이스 파일을 생성합니다:

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

## 라우트와 권한 추가하기

### 라우트 권한 설정

라우트의 `meta` 필드에서 권한을 설정합니다:

```typescript
{
  path: '/system/users',
  component: () => import('@/views/system/users/index.vue'),
  meta: {
    // 기본 정보
    title: '사용자 관리',
    icon: 'UserOutlined',
    
    // 권한 제어
    requiresAuth: true,                    // 로그인 필요
    requiredPermissions: ['user.view'],    // 특정 권한 필요
    requiredRoles: ['admin'],              // 특정 역할 필요 (선택사항)
    
    // 캐시 설정
    keepAlive: true,                       // KeepAlive 캐시 활성화
    affix: false,                          // 탭바에 고정할지 여부
    
    // 표시 제어
    hidden: false,                         // 메뉴에서 숨길지 여부
    hiddenInBreadcrumb: false,             // 브레드크럼에서 숨길지 여부
  },
}
```

### 버튼 레벨 권한

페이지에서 권한 디렉티브를 사용합니다:

```vue
<template>
  <div>
    <!-- 단일 권한 -->
    <a-button v-permission="'user.create'">사용자 추가</a-button>
    
    <!-- 여러 권한 (하나라도 만족) -->
    <a-button v-permission="['user.edit', 'user.admin']">편집</a-button>
    
    <!-- 여러 권한 (모두 만족) -->
    <a-button v-permission.all="['user.edit', 'user.approve']">승인</a-button>
  </div>
</template>
```

컴포저블 함수 사용:

```typescript
import { usePermission } from '@/composables/usePermission'

const { can, canAll } = usePermission()

// 단일 권한 체크
if (can('user.edit')) {
  // 권한 있음
}

// 여러 권한 체크 (모두)
if (canAll(['user.edit', 'user.delete'])) {
  // 모든 권한 있음
}
```

---

## 코드 커밋 규칙

### Conventional Commits

커밋 메시지 형식:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 타입

| 타입 | 설명 | 예시 |
| --- | --- | --- |
| `feat` | 새 기능 | `feat(user): 사용자 일괄 가져오기 기능 추가` |
| `fix` | 버그 수정 | `fix(auth): Token 만료 시 리다이렉트 문제 수정` |
| `docs` | 문서 업데이트 | `docs(readme): 배포 가이드 업데이트` |
| `style` | 코드 포맷 | `style(button): 버튼 간격 통일` |
| `refactor` | 리팩토링 | `refactor(table): 테이블 렌더링 성능 최적화` |
| `perf` | 성능 최적화 | `perf(list): 가상 스크롤 최적화` |
| `test` | 테스트 | `test(api): 사용자 인터페이스 테스트 추가` |
| `chore` | 빌드/도구 | `chore(deps): Vue 버전 업그레이드` |

### Scope 범위

| 범위 | 설명 |
| --- | --- |
| `user` | 사용자 모듈 |
| `auth` | 인증·인가 |
| `table` | ProTable 컴포넌트 |
| `form` | ProForm 컴포넌트 |
| `router` | 라우팅 시스템 |
| `store` | 상태 관리 |
| `api` | 인터페이스 관련 |
| `docs` | 문서 |
| `deps` | 의존성 업그레이드 |

### 예시

```bash
# 새 기능
git commit -m "feat(user): 사용자 일괄 가져오기 기능 추가

- Excel 파일 업로드 지원
- 실시간 가져오기 진행 상황 표시
- 가져오기 결과 내보내기"

# 버그 수정
git commit -m "fix(auth): Token 만료 시 로그인 페이지로 자동 리다이렉트되지 않는 문제 수정"

# 문서 업데이트
git commit -m "docs(deploy): Docker 배포 가이드 추가"
```

---

## 디버깅 팁

### Vue DevTools

1. [Vue DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 브라우저 확장 프로그램 설치
2. 컴포넌트 계층 구조와 Props 확인
3. Pinia Store 상태 확인
4. 이벤트 트리거 모니터링

### 네트워크 요청 디버깅

```typescript
// request.ts에서 디버깅 활성화
const request = axios.create({
  // ... 기타 설정
})

// 요청 인터셉터 로그 추가
request.interceptors.request.use(
  (config) => {
    console.log('[Request]', config.method?.toUpperCase(), config.url, config.params || config.data)
    return config
  }
)

// 응답 인터셉터 로그 추가
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

### Mock 데이터 디버깅

Mock이 활성화되어 있는지 확인:

1. 브라우저 콘솔의 Network 탭 확인
2. 요청 URL이 `/api`로 시작하는지 확인
3. `.env.development`의 `VITE_USE_MOCK=true` 확인
4. Mock 서버 로그 확인

### 라우팅 디버깅

```typescript
// router/index.ts에 네비게이션 가드 로그 추가
router.beforeEach((to, from, next) => {
  console.log('[Router] Navigate to:', to.path, 'from:', from.path)
  console.log('[Router] Meta:', to.meta)
  next()
})
```

### 성능 디버깅

```typescript
// 컴포넌트 렌더링 시간 측정
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

## 다음 단계

- [API 통합](/guide/api-integration)에서 백엔드 서비스 연결 방법 학습
- [상태 관리](/guide/state-management)에서 Pinia 사용법 습득
- [유틸리티 함수](/guide/utils)에서 일반적인 유틸리티 메서드 확인
