# Mock Data

## Overview

Antdv Next Admin includes a complete mock data system powered by `vite-plugin-mock-dev-server` and `@faker-js/faker`, providing simulated API endpoints for development.

## Enable / Disable

Control mock data via environment variables:

```bash
# .env.development
VITE_USE_MOCK=true    # Enable mock
```

```bash
# .env.production
VITE_USE_MOCK=false   # Disable in production
```

## Directory Structure

The mock system uses a two-layer architecture:

```
mock/
├── data/                    # Data layer: generate mock data
│   ├── auth.data.ts         # Auth data (users, roles, permissions)
│   ├── user.data.ts         # User list data
│   ├── role.data.ts         # Role list data
│   ├── dashboard.data.ts    # Dashboard statistics
│   └── ...
└── handlers/                # Handler layer: process requests
    ├── auth.mock.ts         # Login, logout, user info
    ├── user.mock.ts         # User CRUD
    ├── role.mock.ts         # Role CRUD
    ├── dashboard.mock.ts    # Dashboard data
    └── ...
```

### Data Layer (data/)

Uses `@faker-js/faker` to generate realistic mock data:

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

### Handler Layer (handlers/)

Processes HTTP requests and returns mock responses:

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
      // Supports pagination and search filtering
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

## Available Mock Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/userInfo` | GET | Get current user info |
| `/api/users` | GET | User list (paginated/searchable) |
| `/api/users` | POST | Create user |
| `/api/users/:id` | PUT | Update user |
| `/api/users/:id` | DELETE | Delete user |
| `/api/roles` | GET | Role list |
| `/api/dashboard/stats` | GET | Dashboard statistics |

## Adding New Mock Endpoints

### 1. Create the Data Source

```typescript
// mock/data/product.data.ts
import { faker } from '@faker-js/faker'

export const products = Array.from({ length: 30 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
}))
```

### 2. Create the Request Handler

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

The mock server hot-reloads automatically — new endpoints are available instantly.

::: tip Response Format
All mock endpoints follow a unified response format: `{ code: 200, data: any, message: string }`. The Axios interceptor checks the `code` field.
:::
