# FAQ 및 문제 해결

본 문서는 Antdv Next Admin 프로젝트에서 자주 발생하는 문제와 해결 방법을 정리합니다.

## 목차

- [의존성 설치 문제](#의존성-설치-문제)
- [개발 환경 문제](#개발-환경-문제)
- [라우팅 문제](#라우팅-문제)
- [권한 문제](#권한-문제)
- [Mock 데이터 문제](#mock-데이터-문제)
- [빌드 배포 문제](#빌드-배포-문제)
- [TypeScript 문제](#typescript-문제)
- [성능 최적화 권장 사항](#성능-최적화-권장-사항)

---

## 의존성 설치 문제

### Q: 의존성 설치 시 중단되거나 타임아웃

**해결 방법:**

```bash
# 국내 미러 사용
npm config set registry https://registry.npmmirror.com

# 또는 pnpm 사용
pnpm install
```

### Q: 의존성 충돌 경고

**해결 방법:**

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 개발 환경 문제

### Q: 개발 서버 시작 후 백화면

**가능한 원인 및 해결 방법:**

1. **포트가 사용 중**
```bash
# 포트 변경
npm run dev -- --port 3001
```

2. **환경 변수가 적용되지 않음**
```bash
# 개발 서버 재시작
# .env 파일 수정 후 재시작 필요
```

3. **브라우저 캐시**
```bash
# 강제 새로고침: Cmd/Ctrl + Shift + R
# 또는 브라우저 캐시 삭제
```

### Q: 핫 리로드(HMR)가 작동하지 않음

**해결 방법:**

```bash
# 1. Vite 설정 확인
# vite.config.ts에서 hmr 설정이 올바른지 확인

server: {
  hmr: {
    overlay: true,
  },
}

# 2. 개발 서버 재시작
# 3. 브라우저 콘솔에서 WebSocket 연결 오류 확인
```

### Q: 로그인 후 빈 페이지로 이동

**가능한 원인:**
1. 권한 라우트가 올바르게 생성되지 않음
2. KeepAlive 캐시 문제

**해결 방법:**

```typescript
// permission store가 라우트를 올바르게 생성했는지 확인
const permissionStore = usePermissionStore()
await permissionStore.generateRoutes()

// 캐시 삭제 후 재시도
localStorage.clear()
location.reload()
```

---

## 라우팅 문제

### Q: 페이지 새로고침 시 404

**원인:** 프론트엔드 라우팅 모드가 history일 경우 서버 설정 필요

**해결 방법:**

**Nginx 설정:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Vercel:**
```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Q: 새 페이지 추가 후 메뉴가 표시되지 않음

**체크리스트:**

1. 라우트가 `routes.ts`에 올바르게 추가되었는지
2. 라우트 meta에 `title`이 설정되었는지
3. 해당 라우트에 접근 권한이 있는지
4. 재로그인(권한 라우트는 재생성 필요)

### Q: KeepAlive 캐시가 작동하지 않음

**가능한 원인:**

```typescript
// 1. 라우트 설정 확인
{
  meta: {
    keepAlive: true,  // true로 설정되었는지 확인
    title: '페이지 제목' // title 설정 필수
  }
}

// 2. 컴포넌트 이름이 라우트 이름과 일치하는지 확인
export default {
  name: 'Dashboard',  // 라우트 이름과 일치해야 함
}

// 3. 캐시 목록 확인
tabsStore.cachedViews.includes('Dashboard')
```

---

## 권한 문제

### Q: 버튼 권한 디렉티브가 작동하지 않음

**조사 단계:**

```typescript
// 1. 권한 코드가 올바른지 확인
<a-button v-permission="'user.create'">신규</a-button>

// 2. 사용자가 해당 권한을 가지고 있는지 확인
const authStore = useAuthStore()
console.log(authStore.userPermissions) // 사용자 권한 목록 확인

// 3. 사용자가 로그인되어 있는지 확인
console.log(authStore.isLoggedIn)
```

### Q: 라우트 가드 무한 루프

**원인:** 라우트 가드 내 로직 오류로 인한 순환 이동

**해결 방법:**

```typescript
// 라우트 가드 내에서 올바르게 판단
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // ✅ 올바름: 로그인 상태 먼저 판단
  if (!authStore.isLoggedIn && to.path !== '/login') {
    next('/login')
    return
  }
  
  // ✅ 올바름: 로그인 상태에서 로그인 페이지 접근 시 홈으로 이동
  if (authStore.isLoggedIn && to.path === '/login') {
    next('/')
    return
  }
  
  next()
})
```

---

## Mock 데이터 문제

### Q: Mock 인터페이스가 작동하지 않음

**조사 단계:**

1. **환경 변수 확인**
```bash
# .env.development
VITE_USE_MOCK=true
```

2. **인터페이스 주소 확인**
```typescript
// /api로 시작해야 함
request.get('/api/users')  // ✅ 올바름
request.get('/users')       // ❌ 오류
```

3. **Mock 파일 확인**
```typescript
// mock/handlers/*.mock.ts
export default defineMock([
  {
    url: '/api/users',  // /api로 시작해야 함
    method: 'GET',
    // ...
  }
])
```

4. **개발 서버 재시작**

### Q: Mock 데이터 수정 후 반영되지 않음

**해결 방법:**

Mock 서버는 핫 리로드를 지원하지만 때때로 재시작이 필요합니다:

```bash
# 개발 서버 재시작
npm run dev
```

---

## 빌드 배포 문제

### Q: 빌드 실패

**일반적인 오류 및 해결 방법:**

1. **TypeScript 오류**
```bash
# 타입 검사를 실행하여 구체적인 오류 확인
npm run type-check

# 타입 오류 수정
```

2. **메모리 부족**
```bash
# Node 메모리 제한 증가
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

3. **경로 오류**
```typescript
// vite.config.ts에서 base 설정 확인
export default {
  base: '/',  // 배포 환경에 따라 조정
}
```

### Q: 배포 후 리소스 404

**가능한 원인:**

1. **Base 경로 설정 오류**
```typescript
// 하위 디렉토리에 배포하는 경우
export default {
  base: '/admin/',  // 하위 디렉토리 경로
}
```

2. **서버 설정 문제**
- 정적 리소스 디렉토리 설정이 올바른지 확인
- 파일 권한 확인

### Q: 배포 후 백화면

**조사 단계:**

1. **브라우저 콘솔 오류 확인**
2. **네트워크 요청이 성공했는지 확인**
3. **환경 변수가 올바른지 확인**
```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
```

---

## TypeScript 문제

### Q: 타입 오류: Cannot find module '@/components/xxx'

**해결 방법:**

```json
// tsconfig.json에서 paths 설정이 올바른지 확인
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

VS Code 또는 TypeScript 서비스 재시작

### Q: Vue 파일 타입 오류

**해결 방법:**

```typescript
// Vue 타입이 설치되었는지 확인
npm install -D vue-tsc

// tsconfig.json에 Vue 파일 포함
{
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
```

### Q: Ref 타입 추론 오류

**해결 방법:**

```typescript
// ✅ 올바름: 타입 명시적으로 지정
const count = ref<number>(0)
const user = ref<User | null>(null)

// ✅ 올바름: 초기값에서 추론
const count = ref(0)  // Ref<number>로 추론
```

---

## 성능 최적화 권장 사항

### 1. 초기 로드 최적화

```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 패키지 분할 로드
          'vendor': ['vue', 'vue-router', 'pinia'],
          'antdv': ['antdv-next'],
        },
      },
    },
  },
}
```

### 2. 컴포넌트 지연 로딩

```typescript
const Dashboard = () => import('@/views/dashboard/index.vue')
```

### 3. 이미지 최적화

```vue
<!-- WebP 형식 사용 -->
<img src="@/assets/logo.webp" alt="logo">

<!-- 또는 지연 로딩 -->
<img v-lazy="imageSrc" alt="image">
```

### 4. 메모리 누수 방지

```typescript
// 타이머 정리
onUnmounted(() => {
  clearInterval(timer)
})

// 이벤트 리스너 정리
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Store 구독 정리
const unsubscribe = store.$subscribe(() => {})
onUnmounted(() => {
  unsubscribe()
})
```

---

## 도움 받는 방법

1. **문서 확인**: 해당 기능 모듈의 문서를 자세히 읽기
2. **예제 확인**: `src/views/examples/`의 예제 코드 참조
3. **Issue 검색**: GitHub Issues에서 유사한 문제 검색
4. **Issue 제출**: 문제가 해결되지 않으면 Issue를 제출하고 다음을 첨부:
   - 문제 설명
   - 재현 단계
   - 오류 스크린샷 또는 로그
   - 환경 정보(Node 버전, OS 등)

---

## 디버깅 팁 모음

### Vue DevTools

1. [Vue DevTools 브라우저 확장](https://devtools.vuejs.org/) 설치
2. 컴포넌트 트리와 Props 확인
3. Pinia Store 상태 검사
4. 라우트 정보 확인

### 콘솔 디버깅

```typescript
// 라우트 정보 출력
console.log('Current route:', router.currentRoute.value)

// Store 상태 출력
console.log('Auth store:', authStore.$state)

// 환경 변수 출력
console.log('Env:', import.meta.env)
```

### Network 패널

1. API 요청이 성공했는지 확인
2. 요청 매개변수와 응답 데이터 확인
3. CORS 오류가 있는지 확인

---

## 다음 단계

- [개발 워크플로우](/guide/development-workflow)에서 프로젝트 개발 규범 확인
- [API 통합](/guide/api-integration)에서 백엔드 연동 학습
- [예제와 실전](/guide/examples)에서 완전한 사례 확인
