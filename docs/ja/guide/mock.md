# Mock データ

## 概要

Antdv Next Admin は完全な Mock データシステムを内蔵し、`vite-plugin-mock-dev-server` と `@faker-js/faker` をベースに実装され、開発段階の模擬 API インターフェースを提供します。

## 有効化/無効化

環境変数で Mock データのオン/オフを制御します：

```bash
# .env.development
VITE_USE_MOCK=true    # Mock を有効化
```

```bash
# .env.production
VITE_USE_MOCK=false   # 本番環境では無効化
```

## ディレクトリ構造

Mock システムは2層アーキテクチャを採用：

```
mock/
├── data/                    # データ層：模擬データの生成
│   ├── auth.data.ts         # 認証データ（ユーザー、ロール、権限）
│   ├── user.data.ts         # ユーザーリストデータ
│   ├── role.data.ts         # ロールリストデータ
│   ├── dashboard.data.ts    # ダッシュボード統計データ
│   └── ...
└── handlers/                # 処理層：リクエストロジックの処理
    ├── auth.mock.ts         # ログイン、ログアウト、ユーザー情報
    ├── user.mock.ts         # ユーザー CRUD
    ├── role.mock.ts         # ロール CRUD
    ├── dashboard.mock.ts    # ダッシュボードデータ
    └── ...
```

### データ層（data/）

`@faker-js/faker` を使用してリアルな模擬データを生成します：

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

### 処理層（handlers/）

HTTP リクエストを処理し、模擬レスポンスを返します：

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
      // ページング、検索フィルタリングをサポート
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

## 利用可能な Mock インターフェース

| インターフェース | メソッド | 説明 |
| --- | --- | --- |
| `/api/auth/login` | POST | ユーザーログイン |
| `/api/auth/logout` | POST | ユーザーログアウト |
| `/api/auth/userInfo` | GET | 現在のユーザー情報取得 |
| `/api/users` | GET | ユーザーリスト（ページング/検索） |
| `/api/users` | POST | ユーザー作成 |
| `/api/users/:id` | PUT | ユーザー更新 |
| `/api/users/:id` | DELETE | ユーザー削除 |
| `/api/roles` | GET | ロールリスト |
| `/api/dashboard/stats` | GET | ダッシュボード統計 |

## 新しい Mock インターフェースの追加

### 1. データソースの作成

```typescript
// mock/data/product.data.ts
import { faker } from '@faker-js/faker'

export const products = Array.from({ length: 30 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
}))
```

### 2. リクエストハンドラの作成

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

Mock サーバーは自動的にホットリロードされ、新しいインターフェースはすぐに利用可能になります。

::: tip レスポンス形式
すべての Mock インターフェースは統一されたレスポンス形式に従います：`{ code: 200, data: any, message: string }`。Axios インターセプターが `code` フィールドをチェックします。
:::
