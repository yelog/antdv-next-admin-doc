# 권한 시스템

## 개요

Antdv Next Admin은 완전한 RBAC(역할 기반 액세스 제어) 권한 시스템을 구현하여 라우트 레벨부터 버튼 레벨까지의 세밀한 권한 제어를 지원합니다.

## 권한 검증 방식

시스템은 3가지 동등한 권한 검증 방식을 제공하며, 상황에 따라 유연하게 선택할 수 있습니다:

### 1. 디렉티브 방식(v-permission)

템플릿에서 커스텀 디렉티브를 사용하여 요소의 표시를 제어합니다:

```vue
<!-- 단일 권한: 하나만 가지고 있으면 됨(OR 로직) -->
<a-button v-permission="'user.create'">신규 사용자</a-button>

<!-- 복수 권한: 하나만 가지고 있으면 됨(OR 로직) -->
<a-button v-permission="['user.edit', 'user.delete']">작업</a-button>

<!-- 모든 권한: 전부 가지고 있어야 함(AND 로직) -->
<a-button v-permission.all="['user.edit', 'user.approve']">승인</a-button>
```

::: tip 설명
`v-permission`은 기본적으로 **OR** 로직을 사용하며, 배열을 전달할 때 하나의 권한만 만족하면 됩니다. `.all` 수정자를 사용하여 **AND** 로직으로 전환합니다.
:::

### 2. 컴포저블 함수(usePermission)

`<script setup>` 내에서 컴포저블 함수를 사용하여 프로그래밍 방식의 권한 검증을 수행합니다:

```vue
<script setup lang="ts">
import { usePermission } from '@/composables/usePermission'

const { can, canAll, hasRole } = usePermission()

// 단일 권한 확인
if (can('user.create')) {
  // 권한이 있을 때의 로직
}

// 복수 권한 확인(모두 만족해야 함)
if (canAll(['user.edit', 'user.approve'])) {
  // 두 권한 모두 보유
}

// 역할 확인
if (hasRole('admin')) {
  // 관리자 로직
}
</script>
```

### 3. 컴포넌트 방식(PermissionButton)

권한 버튼 컴포넌트를 사용하여 권한 제어가 필요한 콘텐츠를 래핑합니다:

```vue
<template>
  <PermissionButton permission="user.create">
    <a-button type="primary">신규 사용자</a-button>
  </PermissionButton>
</template>
```

## 라우트 레벨 권한

라우트 `meta` 필드를 통해 페이지 레벨 권한을 설정합니다:

```typescript
{
  path: '/organization/user',
  meta: {
    title: 'menu.user',
    // 다음 권한 중 하나 필요
    requiredPermissions: ['system.user.view'],
    // 또는 특정 역할 요구
    requiredRoles: ['admin'],
  },
}
```

라우트 레벨 권한은 `permissionStore.generateRoutes()`에서 필터링되며, 권한을 만족하지 않는 라우트는 주입되지 않습니다.

## 권한 데이터 소스

권한 데이터는 사용자 로그인 후 획득한 사용자 정보에서 가져옵니다:

```typescript
// authStore의 권한 데이터
const roles = ref<string[]>([])        // 사용자 역할 목록, 예: ['admin']
const permissions = ref<string[]>([])  // 사용자 권한 목록, 예: ['system.user.view', 'system.user.create']
```

Mock 모드에서:
- **admin** 계정은 모든 권한을 보유합니다
- **user** 계정은 제한된 권한을 보유합니다

## 권한 명명 규칙

권한 코드는 점으로 구분된 계층 명명을 사용합니다:

```
모듈.리소스.작업
```

예시:
- `system.user.view` — 사용자 조회
- `system.user.create` — 사용자 생성
- `system.user.edit` — 사용자 편집
- `system.user.delete` — 사용자 삭제
- `system.role.view` — 역할 조회
