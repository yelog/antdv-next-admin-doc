# Composables

본 문서는 Antdv Next Admin 프로젝트에서 제공하는 컴포저블 함수(Composables)에 대해 설명합니다.

## 목차

- [usePermission 권한 검사](#usepermission-권한-검사)
- [useFullscreen 전체 화면 제어](#usefullscreen-전체-화면-제어)
- [useWatermark 워터마크 관리](#usewatermark-워터마크-관리)

---

## usePermission 권한 검사

컴포넌트 내에서 권한 검사를 수행하는 컴포저블 함수.

### 위치

`src/composables/usePermission.ts`

### 기본 사용법

```typescript
import { usePermission } from '@/composables/usePermission'

const { can, canAll, hasRole, hasAnyRole } = usePermission()

// 단일 권한 체크
if (can('user.create')) {
  console.log('사용자를 생성할 수 있습니다')
}

// 여러 권한 체크 (하나라도 만족)
if (can(['user.edit', 'user.admin'])) {
  console.log('편집 또는 관리자 권한이 있습니다')
}

// 여러 권한 체크 (모두 만족)
if (canAll(['user.edit', 'user.approve'])) {
  console.log('편집과 승인 권한이 있습니다')
}

// 역할 체크
if (hasRole('admin')) {
  console.log('관리자입니다')
}

// 여러 역할 체크 (하나라도 만족)
if (hasAnyRole(['admin', 'supervisor'])) {
  console.log('관리자 또는 감독자입니다')
}
```

### 반환 값

| 속성 | 타입 | 설명 |
|------|------|------|
| can | (permission: string \| string[]) => boolean | 권한이 있는지 체크 |
| canAll | (permissions: string[]) => boolean | 모든 권한이 있는지 체크 |
| hasRole | (role: string) => boolean | 역할이 있는지 체크 |
| hasAnyRole | (roles: string[]) => boolean | 역할 중 하나라도 있는지 체크 |

### 템플릿에서 사용

```vue
<template>
  <div>
    <a-button v-if="can('user.create')">추가</a-button>
    <a-tag v-if="hasRole('admin')">관리자</a-tag>
  </div>
</template>

<script setup>
import { usePermission } from '@/composables/usePermission'

const { can, hasRole } = usePermission()
</script>
```

---

## useFullscreen 전체 화면 제어

요소 또는 페이지의 전체 화면 표시를 제어하는 컴포저블 함수.

### 위치

`src/composables/useFullscreen.ts`

### 기본 사용법

```typescript
import { useFullscreen } from '@/composables/useFullscreen'

// 페이지 전체를 전체 화면으로
const { isFullscreen, enter, exit, toggle } = useFullscreen()

// 특정 요소를 전체 화면으로
const elementRef = ref<HTMLElement>()
const { isFullscreen, toggle } = useFullscreen(elementRef)
```

### 반환 값

| 속성 | 타입 | 설명 |
|------|------|------|
| isFullscreen | Ref<boolean> | 전체 화면인지 여부 |
| enter | () => Promise<void> | 전체 화면 진입 |
| exit | () => Promise<void> | 전체 화면 종료 |
| toggle | () => Promise<void> | 전체 화면 토글 |

### 예제

```vue
<template>
  <div ref="containerRef">
    <a-button @click="toggle">
      {{ isFullscreen ? '전체 화면 종료' : '전체 화면' }}
    </a-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFullscreen } from '@/composables/useFullscreen'

const containerRef = ref()
const { isFullscreen, toggle } = useFullscreen(containerRef)
</script>
```

---

## useWatermark 워터마크 관리

페이지 워터마크를 관리하는 컴포저블 함수.

### 위치

`src/composables/useWatermark.ts`

### 기본 사용법

```typescript
import { useWatermark } from '@/composables/useWatermark'

const { setWatermark, clearWatermark } = useWatermark()

// 워터마크 설정
setWatermark('내부 자료 - 홍길동')

// 옵션이 있는 워터마크 설정
setWatermark({
  content: '기밀 문서',
  fontSize: 16,
  color: '#ff0000',
  rotate: -45,
})

// 워터마크 제거
clearWatermark()
```

### 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| content | string | - | 워터마크 텍스트 |
| fontSize | number | 14 | 폰트 크기 |
| color | string | '#000' | 폰트 색상 |
| opacity | number | 0.15 | 투명도 |
| rotate | number | -30 | 회전 각도 |
| gap | [number, number] | [100, 100] | 간격 |

### 변조 방지

워터마크 컴포넌트에는 변조 방지 기능이 있어, 사용자가 워터마크 요소를 삭제하려고 하면 자동으로 재생성됩니다.

---

## 커스텀 Composable 만들기

### 템플릿

```typescript
// src/composables/useXXX.ts
import { ref, computed } from 'vue'

export function useXXX() {
  // State
  const state = ref(0)
  
  // Getters
  const double = computed(() => state.value * 2)
  
  // Actions
  const increment = () => {
    state.value++
  }
  
  return {
    state,
    double,
    increment,
  }
}
```

### 명명 규칙

- `camelCase` 사용
- `use`로 시작
- 기능 설명, 예: `usePermission`, `useFullscreen`

### 모범 사례

1. **재사용 가능한 로직을 Composable로 추출**

```typescript
// ✅ 좋음: 재사용 가능한 로직 추출
export function useCount() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}

// 여러 컴포넌트에서 사용
const { count, increment } = useCount()
```

2. **매개변수는 객체 형식 사용**

```typescript
// ✅ 좋음: 객체 매개변수 사용
export function useFetch(options: {
  url: string
  method?: 'GET' | 'POST'
  immediate?: boolean
}) {
  // ...
}

// 사용
useFetch({
  url: '/api/user',
  method: 'GET',
})
```

3. **반응형 참조 반환**

```typescript
// ✅ 좋음: ref 반환
const data = ref(null)
return { data }

// 사용 시 반응형 유지
const { data } = useFetch()
console.log(data.value)
```

---

## 다음 단계

- [유틸리티 함수](/guide/utils)에서 헬퍼 메서드 학습
- [공통 컴포넌트](/guide/common-components)에서 재사용 가능한 컴포넌트 확인
- [상태 관리](/guide/state-management)에서 Pinia 사용법 습득
