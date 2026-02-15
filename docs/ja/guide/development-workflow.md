# 開発ワークフロー

本ドキュメントでは、Antdv Next Admin プロジェクトにおける日常的な開発の標準ワークフローについて説明します。新しいページの追加、コンポーネントの作成、Mock API の追加などの一般的なタスクが含まれます。

## 目次

- [新しいページの追加](#新しいページの追加)
- [新しい Pro コンポーネントの作成](#新しい-pro-コンポーネントの作成)
- [Mock API の追加](#mock-api-の追加)
- [ルートと権限の追加](#ルートと権限の追加)
- [コードコミット規約](#コードコミット規約)
- [デバッグのヒント](#デバッグのヒント)

---

## 新しいページの追加

### 1. ページコンポーネントの作成

`src/views/` ディレクトリに新しいフォルダと `index.vue` ファイルを作成します：

```
src/views/
└── your-module/
    └── index.vue
```

ページコンポーネントのテンプレート：

```vue
<template>
  <div class="your-module-container">
    <!-- ページコンテンツ -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'antdv-next'

// ルート情報
const route = useRoute()

// リアクティブデータ
const loading = ref(false)
const dataList = ref([])

// メソッド
const fetchData = async () => {
  loading.value = true
  try {
    // API 呼び出し
  } catch (error) {
    message.error('データの取得に失敗しました')
  } finally {
    loading.value = false
  }
}

// ライフサイクル
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

### 2. ルートの追加

`src/router/routes.ts` を編集し、ページタイプに応じて対応するルート配列に追加します：

#### 静的ルート（ログイン不要）

```typescript
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/your-page',
    name: 'YourPage',
    component: () => import('@/views/your-module/index.vue'),
    meta: {
      title: 'ページタイトル',
      hidden: true, // メニューに表示しない
    },
  },
]
```

#### 基本ルート（ログイン必要）

```typescript
export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/your-page',
    name: 'YourPage',
    component: () => import('@/views/your-module/index.vue'),
    meta: {
      title: 'ページタイトル',
      icon: 'DashboardOutlined', // Ant Design アイコン名
      requiresAuth: true,
    },
  },
]
```

#### 非同期ルート（特定の権限が必要）

```typescript
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system/your-module',
    name: 'YourModule',
    component: () => import('@/views/system/your-module/index.vue'),
    meta: {
      title: 'モジュール管理',
      icon: 'SettingOutlined',
      requiresAuth: true,
      requiredPermissions: ['system.module.view'], // 必要な権限
      keepAlive: true, // ページをキャッシュするかどうか
    },
  },
]
```

### 3. 国際化の追加

`src/locales/zh-CN.ts` と `src/locales/en-US.ts` に翻訳を追加します：

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

### 4. Mock データの追加（オプション）

Mock データサポートが必要な場合は、[Mock API の追加](#mock-api-の追加) セクションを参照してください。

---

## 新しい Pro コンポーネントの作成

### 1. コンポーネントディレクトリ構造

```
src/components/Pro/ProYourComponent/
├── index.vue          # メインコンポーネント
├── types.ts           # 型定義（オプション）
├── utils.ts           # ユーティリティ関数（オプション）
└── style.scss         # スタイルファイル（オプション）
```

### 2. コンポーネントテンプレート

```vue
<template>
  <div class="pro-your-component">
    <!-- コンポーネントコンテンツ -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props 定義
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

// Emits 定義
const emit = defineEmits<{
  click: [item: any]
  change: [value: any]
}>()

// 算出プロパティ
const displayData = computed(() => {
  return props.data.filter(item => item.visible)
})

// メソッド
const handleClick = (item: any) => {
  emit('click', item)
}
</script>

<style scoped lang="scss">
.pro-your-component {
  // コンポーネントスタイル
}
</style>
```

### 3. 型定義

`src/types/pro.ts` にコンポーネント型を追加します：

```typescript
// Pro コンポーネント型定義
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

### 4. コンポーネントのエクスポート

`src/components/Pro/index.ts` でエクスポートします：

```typescript
export { default as ProYourComponent } from './ProYourComponent/index.vue'
```

---

## Mock API の追加

### 1. データファイルの作成

`mock/data/` ディレクトリにデータファイルを作成します：

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

### 2. Mock ハンドラーの作成

`mock/handlers/` ディレクトリにハンドラーを作成します：

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
      
      // フィルター
      let list = [...yourModuleData]
      if (name) {
        list = list.filter(item => item.name.includes(name))
      }
      if (status) {
        list = list.filter(item => item.status === status)
      }
      
      // ページネーション
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
        message: '創建成功',
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
          message: '更新成功',
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
          message: '削除成功',
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

### 3. API インターフェースの作成

`src/api/` ディレクトリにインターフェースファイルを作成します：

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

## ルートと権限の追加

### ルート権限設定

ルートの `meta` フィールドで権限を設定します：

```typescript
{
  path: '/system/users',
  component: () => import('@/views/system/users/index.vue'),
  meta: {
    // 基本情報
    title: 'ユーザー管理',
    icon: 'UserOutlined',
    
    // 権限制御
    requiresAuth: true,                    // ログインが必要
    requiredPermissions: ['user.view'],    // 特定の権限が必要
    requiredRoles: ['admin'],              // 特定のロールが必要（オプション）
    
    // キャッシュ設定
    keepAlive: true,                       // KeepAlive キャッシュを有効化
    affix: false,                          // タブバーに固定するかどうか
    
    // 表示制御
    hidden: false,                         // メニューで非表示にするかどうか
    hiddenInBreadcrumb: false,             // パンくずリストで非表示にするかどうか
  },
}
```

### ボタンレベルの権限

ページで権限ディレクティブを使用します：

```vue
<template>
  <div>
    <!-- 単一権限 -->
    <a-button v-permission="'user.create'">ユーザーを追加</a-button>
    
    <!-- 複数権限（いずれか満たす） -->
    <a-button v-permission="['user.edit', 'user.admin']">編集</a-button>
    
    <!-- 複数権限（すべて満たす） -->
    <a-button v-permission.all="['user.edit', 'user.approve']">承認</a-button>
  </div>
</template>
```

コンポーザブル関数を使用：

```typescript
import { usePermission } from '@/composables/usePermission'

const { can, canAll } = usePermission()

// 単一権限をチェック
if (can('user.edit')) {
  // 権限あり
}

// 複数権限をチェック（すべて）
if (canAll(['user.edit', 'user.delete'])) {
  // すべての権限あり
}
```

---

## コードコミット規約

### Conventional Commits

コミットメッセージの形式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type タイプ

| タイプ | 説明 | 例 |
| --- | --- | --- |
| `feat` | 新機能 | `feat(user): ユーザーバッチインポート機能を追加` |
| `fix` | バグ修正 | `fix(auth): Token 期限切れ時の遷移問題を修正` |
| `docs` | ドキュメント更新 | `docs(readme): デプロイ手順を更新` |
| `style` | コードフォーマット | `style(button): ボタンの間隔を統一` |
| `refactor` | リファクタリング | `refactor(table): テーブルレンダリングパフォーマンスを最適化` |
| `perf` | パフォーマンス最適化 | `perf(list): 仮想スクロールを最適化` |
| `test` | テスト | `test(api): ユーザーインターフェーステストを追加` |
| `chore` | ビルド/ツール | `chore(deps): Vue バージョンをアップグレード` |

### Scope 範囲

| 範囲 | 説明 |
| --- | --- |
| `user` | ユーザーモジュール |
| `auth` | 認証・認可 |
| `table` | ProTable コンポーネント |
| `form` | ProForm コンポーネント |
| `router` | ルーティングシステム |
| `store` | 状態管理 |
| `api` | インターフェース関連 |
| `docs` | ドキュメント |
| `deps` | 依存関係のアップグレード |

### 例

```bash
# 新機能
git commit -m "feat(user): ユーザーバッチインポート機能を追加

- Excel ファイルアップロードをサポート
- インポート進捗をリアルタイム表示
- インポート結果をエクスポート"

# バグ修正
git commit -m "fix(auth): Token 期限切れ時に自動的にログインページへ遷移しない問題を修正"

# ドキュメント更新
git commit -m "docs(deploy): Docker デプロイ手順を追加"
```

---

## デバッグのヒント

### Vue DevTools

1. [Vue DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) ブラウザ拡張機能をインストール
2. コンポーネント階層と Props を確認
3. Pinia Store の状態を確認
4. イベントトリガーを監視

### ネットワークリクエストのデバッグ

```typescript
// request.ts でデバッグを有効化
const request = axios.create({
  // ... その他の設定
})

// リクエストインターセプターログを追加
request.interceptors.request.use(
  (config) => {
    console.log('[Request]', config.method?.toUpperCase(), config.url, config.params || config.data)
    return config
  }
)

// レスポンスインターセプターログを追加
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

### Mock データのデバッグ

Mock が有効かどうかを確認：

1. ブラウザコンソールの Network タブを確認
2. リクエスト URL が `/api` で始まるかを確認
3. `.env.development` の `VITE_USE_MOCK=true` を確認
4. Mock サーバーログを確認

### ルーティングのデバッグ

```typescript
// router/index.ts にナビゲーションガードログを追加
router.beforeEach((to, from, next) => {
  console.log('[Router] Navigate to:', to.path, 'from:', from.path)
  console.log('[Router] Meta:', to.meta)
  next()
})
```

### パフォーマンスのデバッグ

```typescript
// コンポーネントレンダリング時間を測定
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

## 次のステップ

- [API 統合](/guide/api-integration) でバックエンドサービスとの接続方法を学ぶ
- [状態管理](/guide/state-management) で Pinia の使用方法を習得
- [ユーティリティ関数](/guide/utils) で一般的なユーティリティメソッドを確認
