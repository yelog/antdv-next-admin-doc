# Mock 数据

## 概述

Antdv Next Admin 内置了完整的 Mock 数据系统，基于 `vite-plugin-mock-dev-server` 和 `@faker-js/faker` 实现，提供开发阶段的模拟 API 接口。

## 启用/禁用

通过环境变量控制 Mock 数据的开关：

```bash
# .env.development
VITE_USE_MOCK=true    # 启用 Mock
```

```bash
# .env.production
VITE_USE_MOCK=false   # 生产环境禁用
```

## 目录结构

Mock 系统采用双层架构：

```
mock/
├── data/                    # 数据层：生成模拟数据
│   ├── auth.data.ts         # 认证数据（用户、角色、权限）
│   ├── user.data.ts         # 用户列表数据
│   ├── role.data.ts         # 角色列表数据
│   ├── dashboard.data.ts    # 仪表盘统计数据
│   └── ...
└── handlers/                # 处理层：处理请求逻辑
    ├── auth.mock.ts         # 登录、登出、用户信息
    ├── user.mock.ts         # 用户 CRUD
    ├── role.mock.ts         # 角色 CRUD
    ├── dashboard.mock.ts    # 仪表盘数据
    └── ...
```

### 数据层（data/）

使用 `@faker-js/faker` 生成逼真的模拟数据：

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

### 处理层（handlers/）

处理 HTTP 请求并返回模拟响应：

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
      // 支持分页、搜索过滤
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

## 可用的 Mock 接口

| 接口 | 方法 | 说明 |
| --- | --- | --- |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/logout` | POST | 用户登出 |
| `/api/auth/userInfo` | GET | 获取当前用户信息 |
| `/api/users` | GET | 用户列表（分页/搜索） |
| `/api/users` | POST | 创建用户 |
| `/api/users/:id` | PUT | 更新用户 |
| `/api/users/:id` | DELETE | 删除用户 |
| `/api/roles` | GET | 角色列表 |
| `/api/dashboard/stats` | GET | 仪表盘统计 |

## 添加新的 Mock 接口

### 1. 创建数据源

```typescript
// mock/data/product.data.ts
import { faker } from '@faker-js/faker'

export const products = Array.from({ length: 30 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
}))
```

### 2. 创建请求处理器

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

Mock 服务器会自动热重载，新接口即刻可用。

::: tip 响应格式
所有 Mock 接口遵循统一的响应格式：`{ code: 200, data: any, message: string }`。Axios 拦截器会检查 `code` 字段。
:::
