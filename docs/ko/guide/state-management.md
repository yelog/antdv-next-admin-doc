# 상태 관리

본 문서는 Antdv Next Admin 프로젝트에서 사용되는 Pinia 상태 관리 솔루션, 각 Store의 역할, 사용 방법 및 모범 사례에 대해 자세히 설명합니다.

## 목차

- [Pinia 기초](#pinia-기초)
- [인증 상태 (auth)](#인증-상태-auth)
- [권한 상태 (permission)](#권한-상태-permission)
- [테마 상태 (theme)](#테마-상태-theme)
- [탭 상태 (tabs)](#탭-상태-tabs)
- [레이아웃 상태 (layout)](#레이아웃-상태-layout)
- [기타 Store](#기타-store)
- [Store 조합 사용](#store-조합-사용)
- [모범 사례](#모범-사례)

---

## Pinia 기초

프로젝트는 Pinia의 **Setup Store** 구문을 사용합니다. 이는 Vue 3 Composition API 스타일의 상태 관리 방식입니다.

### Setup Store 모드

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Store 정의
export const useExampleStore = defineStore('example', () => {
  // State: ref를 사용하여 상태 정의
  const count = ref(0)
  const user = ref<User | null>(null)
  
  // Getters: computed를 사용하여 계산 속성 정의
  const doubleCount = computed(() => count.value * 2)
  const isLoggedIn = computed(() => !!user.value)
  
  // Actions: 일반 함수로 메서드 정의
  const increment = () => {
    count.value++
  }
  
  const setUser = (userData: User) => {
    user.value = userData
  }
  
  // 노출할 모든 내용을 반환해야 함
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

### Store 사용

```vue
<script setup lang="ts">
import { useExampleStore } from '@/stores/example'
import { storeToRefs } from 'pinia'

// Store 인스턴스 가져오기
const exampleStore = useExampleStore()

// storeToRefs를 사용하여 반응성을 유지하며 구조 분해
const { count, doubleCount } = storeToRefs(exampleStore)

// 메서드는 직접 구조 분해
const { increment } = exampleStore

// 템플릿에서 직접 사용
// {{ count }} - 반응형
// {{ doubleCount }} - 계산 속성
// @click="increment" - 메서드
</script>
```

### Setup Store와 Options Store 비교

| 특징 | Setup Store | Options Store |
|------|-------------|---------------|
| 구문 | Composition API | Options API |
| TypeScript | 더 나은 타입 추론 | 추가 구성 필요 |
| 코드 재사용 | 컴포저블 함수 추출 가능 | mixins를 통해 |
| 추천도 | ✅ **추천** | 기존 프로젝트 호환 |

---

## 인증 상태 (auth)

사용자 인증 정보를 관리합니다. 로그인 상태, Token, 사용자 정보 등을 포함합니다.

### 위치

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
// 로그인 여부
const isLoggedIn = computed(() => !!token.value && !!user.value)

// 사용자 역할 목록(문자열 배열)
const userRoles = computed(() => roles.value.map(role => role.code))

// 사용자 권한 목록(문자열 배열)
const userPermissions = computed(() => permissions.value.map(perm => perm.code))
```

### Actions

#### 로그인

```typescript
// 로그인(Demo/프로덕션 모드 자동 판단)
await authStore.login(username, password)

// 로그인 성공 후 자동으로:
// 1. Token을 localStorage에 저장
// 2. 사용자 정보 조회
// 3. roles와 permissions 업데이트
```

#### 로그아웃

```typescript
// 모든 인증 정보 제거
authStore.logout()

// 자동으로 제거되는 항목:
// 1. Token과 RefreshToken
// 2. 사용자 정보
// 3. localStorage의 데이터
```

#### 권한 확인

```typescript
// 특정 역할 보유 여부 확인
const hasRole = (role: string): boolean

// 임의의 역할 보유 여부 확인
const hasAnyRole = (roleList: string[]): boolean

// 모든 역할 보유 여부 확인
const hasAllRoles = (roleList: string[]): boolean

// 특정 권한 보유 여부 확인
const hasPermission = (permission: string): boolean

// 임의의 권한 보유 여부 확인
const hasAnyPermission = (permissionList: string[]): boolean

// 모든 권한 보유 여부 확인
const hasAllPermissions = (permissionList: string[]): boolean
```

### 사용 예시

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user, isLoggedIn, userRoles, userPermissions } = storeToRefs(authStore)

// 권한 확인
const canEdit = computed(() => authStore.hasPermission('user.edit'))
const isAdmin = computed(() => authStore.hasRole('admin'))

// 로그인 처리
const handleLogin = async (values: { username: string; password: string }) => {
  try {
    await authStore.login(values.username, values.password)
    message.success('登录成功')
    router.push('/')
  } catch (error) {
    message.error('登录失败')
  }
}

// 로그아웃 처리
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <!-- 사용자 정보 표시 -->
    <span v-if="isLoggedIn">欢迎, {{ user?.realName }}</span>
    
    <!-- 권한 제어 -->
    <a-button v-if="canEdit">编辑</a-button>
    <a-tag v-if="isAdmin">管理员</a-tag>
  </div>
</template>
```

---

## 권한 상태 (permission)

라우트 권한 및 동적 메뉴 생성을 관리합니다.

### 위치

`src/stores/permission.ts`

### State

```typescript
const routes = ref<RouteRecordRaw[]>([])        // 접근 가능한 라우트 목록
const menuTree = ref<MenuItem[]>([])           // 메뉴 트리
const loaded = ref(false)                       // 권한 로드 완료 여부
```

### Getters

```typescript
// 사이드바 메뉴
const sidebarMenu = computed(() => menuTree.value)

// 브레드크럼 네비게이션
const breadcrumbList = computed(() => {
  // 현재 라우트를 기반으로 브레드크럼 생성
})
```

### Actions

#### 라우트 생성

```typescript
// 사용자 권한을 기반으로 접근 가능한 라우트 생성
await permissionStore.generateRoutes()

// 내부 로직:
// 1. 사용자 권한 조회
// 2. asyncRoutes 필터링
// 3. 메뉴 트리 생성
// 4. router에 추가
```

### 사용 예시

```vue
<script setup lang="ts">
import { usePermissionStore } from '@/stores/permission'

const permissionStore = usePermissionStore()

// 메뉴 데이터는 사이드바 렌더링에 사용
const menuList = computed(() => permissionStore.sidebarMenu)
</script>
```

---

## 테마 상태 (theme)

애플리케이션 테마를 관리합니다. 라이트/다크 모드, 테마 색상, CSS 변수 등을 포함합니다.

### 위치

`src/stores/theme.ts`

### State

```typescript
const themeMode = ref<ThemeMode>('light')           // 테마 모드
const primaryColor = ref<string>('#1677ff')        // 테마 색상
const sidebarTheme = ref<'light' | 'dark'>('dark') // 사이드바 테마
```

### 사용 가능한 테마 색상

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

#### 테마 모드 설정

```typescript
// 테마 모드 설정
themeStore.setThemeMode('dark')     // 다크
themeStore.setThemeMode('light')    // 라이트
themeStore.setThemeMode('auto')     // 시스템 추종
```

#### 테마 색상 설정

```typescript
// 테마 색상 설정(프리셋 또는 커스텀)
themeStore.setPrimaryColor('#1677ff')
```

#### 사이드바 테마 설정

```typescript
themeStore.setSidebarTheme('dark')   // 다크 사이드바
themeStore.setSidebarTheme('light')  // 라이트 사이드바
```

### 사용 예시

```vue
<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { themeMode, primaryColor, sidebarTheme } = storeToRefs(themeStore)

// 테마 전환
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

## 탭 상태 (tabs)

멀티 탭 네비게이션을 관리합니다. 탭 목록, 캐시, 우클릭 메뉴 등을 포함합니다.

### 위치

`src/stores/tabs.ts`

### State

```typescript
const tabList = ref<TabItem[]>([])        // 탭 목록
const cachedViews = ref<string[]>([])     // KeepAlive로 캐시된 뷰
const activeKey = ref<string>('')         // 현재 활성화된 탭
```

### Actions

#### 탭 추가

```typescript
// 탭 페이지 추가
tabsStore.addTab({
  path: '/dashboard',
  title: '仪表盘',
  name: 'Dashboard',
  affix: true,              // 고정 여부(닫을 수 없음)
  keepAlive: true,          // 캐시 여부
})
```

#### 탭 닫기

```typescript
// 지정한 탭 닫기
tabsStore.closeTab('/dashboard')

// 다른 탭 닫기
tabsStore.closeOthers('/dashboard')

// 모든 탭 닫기
tabsStore.closeAll()
```

#### 탭 새로고침

```typescript
// 현재 탭 새로고침(캐시 제거 후 재로드)
tabsStore.refreshTab('/dashboard')
```

### 사용 예시

```vue
<script setup lang="ts">
import { useTabsStore } from '@/stores/tabs'
import { useRoute } from 'vue-router'

const tabsStore = useTabsStore()
const route = useRoute()

// 라우트 변경 감지하여 자동으로 탭 추가
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

// 탭 닫기
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

## 레이아웃 상태 (layout)

레이아웃 설정을 관리합니다. 사이드바 상태, 레이아웃 모드 등을 포함합니다.

### 위치

`src/stores/layout.ts`

### State

```typescript
const sidebarCollapsed = ref(false)          // 사이드바 접힘 여부
const layoutMode = ref<'vertical' | 'horizontal'>('vertical')  // 레이아웃 모드
const isMobile = ref(false)                  // 모바일 디바이스 여부
```

### Actions

```typescript
// 사이드바 접힘 상태 전환
layoutStore.toggleSidebar()

// 레이아웃 모드 설정
layoutStore.setLayoutMode('horizontal')

// 디바이스 유형 감지
layoutStore.detectDevice()
```

---

## 기타 Store

### 설정 (settings)

`src/stores/settings.ts` - 사용자 개인화 설정

```typescript
const showBreadcrumb = ref(true)        // 브레드크럼 표시
const showTabs = ref(true)              // 탭바 표시
const enableAnimation = ref(true)       // 애니메이션 활성화
const grayMode = ref(false)             // 그레이 모드
```

### 알림 (notification)

`src/stores/notification.ts` - 메시지 알림 센터

```typescript
const unreadCount = ref(0)              // 읽지 않은 메시지 수
const noticeList = ref<Notice[]>([])    // 알림 목록

// Actions
fetchUnreadCount()                      // 읽지 않은 수 조회
markAsRead(id)                          // 읽음 표시
markAllAsRead()                         // 모두 읽음 표시
```

### 사전 (dict)

`src/stores/dict.ts` - 사전 데이터 캐시

```typescript
const dictData = ref<Record<string, DictItem[]>>({})

// Actions
getDict(type: string)                   // 사전 조회
setDict(type: string, data)             // 사전 설정
```

---

## Store 조합 사용

실제 개발에서는 여러 Store가 협력해야 하는 경우가 많습니다:

### 로그인 플로우 예시

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
    // 1. 로그인 인증
    await authStore.login(values.username, values.password)
    
    // 2. 권한 라우트 생성
    await permissionStore.generateRoutes()
    
    // 3. 이전 탭 제거
    tabsStore.closeAll()
    
    // 4. 홈페이지로 이동
    router.push('/')
    
    message.success('登录成功')
  } catch (error) {
    message.error('登录失败')
  }
}
```

### 컴포넌트에서 여러 Store 사용

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

## 모범 사례

### 1. storeToRefs를 사용하여 구조 분해

```typescript
// ✅ 올바름: 반응성 유지
const { count, doubleCount } = storeToRefs(store)

// ❌ 잘못됨: 반응성 손실
const { count, doubleCount } = store
```

### 2. Store 외부에서 State 수정하지 않기

```typescript
// ✅ 올바름: Action을 통해 수정
store.increment()

// ❌ 잘못됨: 직접 수정
store.count++
```

### 3. Store 책임 단일화

각 Store는 하나의 도메인 상태만 관리:

- `auth` - 인증 관련만 관리
- `theme` - 테마 관련만 관리
- `tabs` - 탭 페이지 관련만 관리

### 4. 상태 영속화

영속화가 필요한 상태는 `localStorage` 사용:

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

### 5. 타입 안정성

Store에 완전한 타입 정의:

```typescript
import type { Store } from 'pinia'

export interface UserState {
  token: string | null
  user: User | null
}

export type UserStore = Store<'user', UserState>
```

---

## 다음 단계

- [개발 워크플로우](/guide/development-workflow)를 이해하여 프로젝트 개발 규범 습득
- [API 통합](/guide/api-integration)을 학습하여 백엔드 서비스 연결
- [유틸리티 함수](/guide/utils)를 확인하여 자주 사용하는 유틸리티 메서드 이해
