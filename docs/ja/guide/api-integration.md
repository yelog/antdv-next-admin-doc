# API 統合とリクエスト処理

本ドキュメントでは、Antdv Next Admin プロジェクトにバックエンド API を統合する方法について詳しく説明します。Axios の設定、リクエストインターセプター、エラーハンドリング、認証フローなどが含まれます。

## 目次

- [HTTP クライアント設定](#http-クライアント設定)
- [リクエストインターセプター](#リクエストインターセプター)
- [レスポンスインターセプター](#レスポンスインターセプター)
- [Token 認証とリフレッシュ](#token-認証とリフレッシュ)
- [エラーハンドリング](#エラーハンドリング)
- [Mock から実際の API への切り替え](#mock-から実際の-api-への切り替え)
- [リクエストリトライ](#リクエストリトライ)
- [ファイルアップロード・ダウンロード](#ファイルアップロードダウンロード)

---

## HTTP クライアント設定

プロジェクトの HTTP クライアント設定は `src/utils/request.ts` にあります。

### 基本設定

```typescript
import axios from 'axios'

const request = axios.create({
  // API ベースパス
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // リクエストタイムアウト時間（ミリ秒）
  timeout: 10000,
  
  // リクエストヘッダー
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 環境変数設定

```bash
# .env.development（開発環境）
VITE_API_BASE_URL=/api
VITE_USE_MOCK=true

# .env.production（本番環境）
VITE_API_BASE_URL=https://api.your-domain.com
VITE_USE_MOCK=false
```

---

## リクエストインターセプター

リクエストインターセプターは、リクエスト送信前に統一的に処理するために使用されます。Token の追加やリクエストヘッダーの設定などが含まれます。

### 認証 Token の追加

```typescript
request.interceptors.request.use(
  (config) => {
    // localStorage から Token を取得
    const token = localStorage.getItem('access_token')
    
    // Token があれば、リクエストヘッダーに追加
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // キャッシュ防止のためにタイムスタンプを追加
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
```

### リクエスト読み込み状態

```typescript
import { message } from 'antdv-next'

let requestCount = 0

const showLoading = () => {
  requestCount++
  // グローバル読み込み状態を表示
}

const hideLoading = () => {
  requestCount--
  if (requestCount <= 0) {
    // グローバル読み込み状態を非表示
  }
}

request.interceptors.request.use(
  (config) => {
    // サイレントリクエスト以外は読み込みを表示
    if (!config.silent) {
      showLoading()
    }
    return config
  }
)

request.interceptors.response.use(
  (response) => {
    if (!response.config.silent) {
      hideLoading()
    }
    return response
  },
  (error) => {
    if (!error.config?.silent) {
      hideLoading()
    }
    return Promise.reject(error)
  }
)
```

### カスタム設定オプション

```typescript
// サイレントリクエスト（読み込み状態を表示しない）
request.get('/api/config', { silent: true })

// カスタムタイムアウト
request.get('/api/large-data', { timeout: 30000 })

// カスタムリクエストヘッダー
request.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
```

---

## レスポンスインターセプター

レスポンスインターセプターは、レスポンスデータとエラーを統一的に処理するために使用されます。

### 標準レスポンス形式

プロジェクトが期待するバックエンドレスポンス形式：

```typescript
interface ApiResponse<T> {
  code: number      // ステータスコード：200 は成功を示す
  data: T          // レスポンスデータ
  message: string  // メッセージ
}
```

### レスポンスインターセプターの実装

```typescript
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 標準レスポンス形式の処理
    if (data.code !== 200) {
      // ビジネスエラー
      message.error(data.message || 'リクエスト失敗')
      return Promise.reject(new Error(data.message))
    }
    
    // データ部分を返す
    return data.data
  },
  (error) => {
    // HTTP エラーハンドリング
    return Promise.reject(error)
  }
)
```

---

## Token 認証とリフレッシュ

### デュアル Token メカニズム

プロジェクトは Access Token + Refresh Token のデュアル Token メカニズムを使用します：

- **Access Token**：短期有効（例：15分）、API 認証に使用
- **Refresh Token**：長期有効（例：7日）、新しい Access Token の取得に使用

### Token リフレッシュフロー

```typescript
// Token をリフレッシュ中かどうか
let isRefreshing = false

// リフレッシュ完了を待つリクエストキュー
let refreshSubscribers: Array<(token: string) => void> = []

// Token リフレッシュを購読
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

// すべてのサブスクライバーに通知
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

// レスポンスインターセプターで 401 を処理
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error
    
    // Token 期限切れ（401）かつリフレッシュ Token のリクエストではない
    if (response?.status === 401 && !config.url?.includes('/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true
        
        try {
          // リフレッシュインターフェースを呼び出す
          const refreshToken = localStorage.getItem('refresh_token')
          const { data } = await axios.post('/api/auth/refresh', {
            refreshToken,
          })
          
          // 新しい Token を保存
          const newToken = data.data.token
          localStorage.setItem('access_token', newToken)
          
          // 待機中のリクエストに通知
          onTokenRefreshed(newToken)
          isRefreshing = false
          
          // 元のリクエストを再試行
          config.headers.Authorization = `Bearer ${newToken}`
          return request(config)
        } catch (refreshError) {
          // リフレッシュ失敗、ログアウト
          isRefreshing = false
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
      
      // リフレッシュ中、リクエストをキューに追加
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          config.headers.Authorization = `Bearer ${token}`
          resolve(request(config))
        })
      })
    }
    
    return Promise.reject(error)
  }
)
```

### Auth Store を使用した Token 管理

プロジェクトにはすでに Token 管理がカプセル化されており、`useAuthStore` を直接使用することをお勧めします：

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// ログイン
await authStore.login(username, password)

// ログアウト
authStore.logout()

// Token はリクエストインターセプターで自動的に追加されます
```

---

## エラーハンドリング

### グローバルエラーハンドリング

```typescript
import { message, notification } from 'antdv-next'

request.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error
    
    if (response) {
      switch (response.status) {
        case 400:
          message.error(response.data?.message || 'リクエストパラメータエラー')
          break
        case 401:
          // Token 期限切れ、上記のインターセプターで処理
          break
        case 403:
          message.error('この操作を実行する権限がありません')
          break
        case 404:
          message.error('リクエストされたリソースが存在しません')
          break
        case 500:
          notification.error({
            message: 'サーバーエラー',
            description: response.data?.message || '後で再試行してください',
          })
          break
        default:
          message.error(response.data?.message || 'リクエスト失敗')
      }
    } else if (error.request) {
      // リクエストは送信されたがレスポンスを受信しなかった
      message.error('ネットワークエラー、ネットワーク接続を確認してください')
    } else {
      // リクエスト設定エラー
      message.error('リクエスト設定エラー')
    }
    
    return Promise.reject(error)
  }
)
```

### ビジネスエラーハンドリング

API 呼び出し箇所で特定のビジネスエラーを処理：

```typescript
import { getUserList } from '@/api/user'

try {
  const data = await getUserList(params)
} catch (error: any) {
  if (error.response?.data?.code === 1001) {
    // 特定のビジネスエラーコード処理
    message.warning('ユーザーリストが空です')
  } else {
    throw error // その他のエラーは引き続き throw
  }
}
```

---

## Mock から実際の API への切り替え

### ステップ 1：環境変数の変更

```bash
# .env.development
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

### ステップ 2：Mock インターセプターの削除（MSW を使用している場合）

プロジェクトが MSW などの Mock ライブラリを使用している場合、`main.ts` で削除する必要があります：

```typescript
// main.ts
// 以下のコードを削除またはコメントアウト
// if (import.meta.env.VITE_USE_MOCK === 'true') {
//   import('./mock')
// }
```

### ステップ 3：API レスポンス形式の調整

バックエンドの返却形式が異なる場合、レスポンスインターセプターを変更します：

```typescript
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 異なるレスポンス形式に適応
    // 形式 A: { code: 200, data: {}, message: '' }
    // 形式 B: { status: 'success', result: {} }
    // 形式 C: データを直接返す
    
    if (data.code === 200 || data.status === 'success') {
      return data.data || data.result || data
    }
    
    return Promise.reject(new Error(data.message || data.error))
  }
)
```

### ステップ 4：CORS の処理

開発環境では `vite.config.ts` でプロキシを設定します：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // /api プレフィックスを削除する必要がある場合
      },
    },
  },
})
```

---

## リクエストリトライ

### 自動リトライメカニズム

```typescript
import axiosRetry from 'axios-retry'

axiosRetry(request, {
  retries: 3,                    // リトライ回数
  retryDelay: (retryCount) => {
    return retryCount * 1000     // 遅延時間（ミリ秒）
  },
  retryCondition: (error) => {
    // ネットワークエラーまたは 5xx エラーの場合のみリトライ
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.response?.status >= 500
  },
})
```

### 手動リトライ

```typescript
const fetchWithRetry = async (apiCall: Function, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}

// 使用方法
const data = await fetchWithRetry(() => getUserList(params))
```

---

## ファイルアップロード・ダウンロード

### ファイルアップロード

```typescript
// API インターフェース
export const uploadFile = (file: File, onProgress?: (percent: number) => void) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return request.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1)
      )
      onProgress?.(percent)
    },
  })
}
```

コンポーネントでの使用：

```vue
<template>
  <a-upload
    :custom-request="handleUpload"
    :show-upload-list="false"
  >
    <a-button>
      <upload-outlined />
      ファイルをアップロード
    </a-button>
  </a-upload>
</template>

<script setup>
import { uploadFile } from '@/api/file'

const handleUpload = async ({ file, onSuccess, onError }) => {
  try {
    const result = await uploadFile(file, (percent) => {
      console.log('アップロード進捗:', percent + '%')
    })
    onSuccess(result)
  } catch (error) {
    onError(error)
  }
}
</script>
```

### ファイルダウンロード

```typescript
// API インターフェース
export const downloadFile = (url: string, filename: string) => {
  return request.get(url, {
    responseType: 'blob',
  }).then((blob) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  })
}

// 使用方法
downloadFile('/api/export/users', 'ユーザーリスト.xlsx')
```

---

## ベストプラクティス

### 1. API のモジュール化

ビジネスドメインごとに API ファイルを整理します：

```
src/api/
├── auth.ts       # 認証関連
├── user.ts       # ユーザー管理
├── role.ts       # ロール・権限
├── system.ts     # システム設定
└── file.ts       # ファイル操作
```

### 2. 型安全性

すべての API にリクエストとレスポンスの型を定義します：

```typescript
// types/api.ts
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export interface User {
  id: string
  username: string
  email: string
}

// api/user.ts
export const getUserList = (params: PaginationParams) => {
  return request.get<ApiResponse<PaginatedResult<User>>>('/api/users', { params })
}
```

### 3. リクエストのキャンセル

```typescript
import axios from 'axios'

const controller = new AbortController()

request.get('/api/large-data', {
  signal: controller.signal,
})

// リクエストをキャンセル
controller.abort()
```

### 4. 並行制御

```typescript
import { throttle, debounce } from 'lodash-es'

// スロットル：リクエスト頻度を制限
const throttledSearch = throttle((keyword) => {
  return searchApi(keyword)
}, 300)

// デバウンス：入力停止を待つ
const debouncedSave = debounce((data) => {
  return saveApi(data)
}, 500)
```

---

## 次のステップ

- [状態管理](/guide/state-management) で Pinia を使用したアプリケーション状態管理を学ぶ
- [ユーティリティ関数](/guide/utils) で一般的なユーティリティメソッドを確認
- [開発ワークフロー](/guide/development-workflow) でプロジェクト開発規約を習得
