# Mock 데이터

## 개요

Antdv Next Admin은 완전한 Mock 데이터 시스템을 내장하고 있으며, `vite-plugin-mock-dev-server`와 `@faker-js/faker`를 기반으로 구현되어 개발 단계의 모의 API 인터페이스를 제공합니다.

## 활성화/비활성화

환경 변수로 Mock 데이터 스위치를 제어합니다:

```bash
# .env.development
VITE_USE_MOCK=true    # Mock 활성화
```

```bash
# .env.production
VITE_USE_MOCK=false   # 프로덕션 환경에서 비활성화
```

## 디렉토리 구조

Mock 시스템은 2층 아키텍처를 채택합니다:

```
mock/
├── data/                    # 데이터 층: 모의 데이터 생성
│   ├── auth.data.ts         # 인증 데이터(사용자, 역할, 권한)
│   ├── user.data.ts         # 사용자 목록 데이터
│   ├── role.data.ts         # 역할 목록 데이터
│   ├── dashboard.data.ts    # 대시보드 통계 데이터
│   └── ...
└── handlers/                # 처리 층: 요청 로직 처리
    ├── auth.mock.ts         # 로그인, 로그아웃, 사용자 정보
    ├── user.mock.ts         # 사용자 CRUD
    ├── role.mock.ts         # 역할 CRUD
    ├── dashboard.mock.ts    # 대시보드 데이터
    └── ...
```

### 데이터 층(data/)

`@faker-js/faker`를 사용하여 사실적인 모의 데이터를 생성합니다:

```typescript
// mock/data/user.data.ts
import { faker } from '@faker-js/faker/locale/zh_CN'

export const users = Array.from({ length: 50 }, () => ({
  id: faker.string.uuid(),
  username: faker.internet.username(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  status: faker.helpers.arrayElement(['active', 'inactive']),
  createdAt: faker.date.past().toISOString(),
}))
```

### 처리 층(handlers/)

HTTP 요청을 처리하고 모의 응답을 반환합니다:

```typescript
// mock/handlers/user.mock.ts
import { defineMock } from 'vite-plugin-mock-dev-server'
import { users } from '../data/user.data'

export default defineMock([
  {
    url: '/api/users',
    method: 'GET',
    body: (request) => {
      const { page = 1, pageSize = 10, keyword } = request.query
      // 페이징, 검색 필터링 지원
      let filtered = users
      if (keyword) {
        filtered = users.filter(u => u.name.includes(keyword))
      }
      return {
        code: 200,
        data: {
          list: filtered.slice((page - 1) * pageSize, page * pageSize),
          total: filtered.length,
        },
        message: 'success',
      }
    },
  },
])
```

## 사용 가능한 Mock 인터페이스

| 인터페이스 | 메서드 | 설명 |
| --- | --- | --- |
| `/api/auth/login` | POST | 사용자 로그인 |
| `/api/auth/logout` | POST | 사용자 로그아웃 |
| `/api/auth/userInfo` | GET | 현재 사용자 정보 조회 |
| `/api/users` | GET | 사용자 목록(페이징/검색) |
| `/api/users` | POST | 사용자 생성 |
| `/api/users/:id` | PUT | 사용자 업데이트 |
| `/api/users/:id` | DELETE | 사용자 삭제 |
| `/api/roles` | GET | 역할 목록 |
| `/api/dashboard/stats` | GET | 대시보드 통계 |

## 새 Mock 인터페이스 추가

### 1. 데이터 소스 생성

```typescript
// mock/data/product.data.ts
import { faker } from '@faker-js/faker'

export const products = Array.from({ length: 30 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
}))
```

### 2. 요청 핸들러 생성

```typescript
// mock/handlers/product.mock.ts
import { defineMock } from 'vite-plugin-mock-dev-server'
import { products } from '../data/product.data'

export default defineMock([
  {
    url: '/api/products',
    method: 'GET',
    body: { code: 200, data: { list: products, total: products.length }, message: 'success' },
  },
])
```

Mock 서버는 자동으로 핫 리로드되며, 새 인터페이스는 즉시 사용할 수 있습니다.

::: tip 응답 형식
모든 Mock 인터페이스는 통일된 응답 형식을 따릅니다: `{ code: 200, data: any, message: string }`. Axios 인터셉터가 `code` 필드를 확인합니다.
:::
