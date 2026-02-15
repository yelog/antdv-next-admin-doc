# 状態管理

本ドキュメントでは、Antdv Next Admin プロジェクトで使用される Pinia 状態管理ソリューション、各 Store の役割、使用方法、ベストプラクティスについて詳しく説明します。

## 目次

- [Pinia 基礎](#pinia-基礎)
- [認証状態 (auth)](#認証状態-auth)
- [権限状態 (permission)](#権限状態-permission)
- [テーマ状態 (theme)](#テーマ状態-theme)
- [タブ状態 (tabs)](#タブ状態-tabs)
- [レイアウト状態 (layout)](#レイアウト状態-layout)
- [その他の Store](#その他の-store)
- [Store の組み合わせ使用](#store-の組み合わせ使用)
- [ベストプラクティス](#ベストプラクティス)

---

## Pinia 基礎

プロジェクトでは Pinia の **Setup Store** 構文を使用しています。これは Vue 3 Composition API スタイルの状態管理方式です。

### Setup Store モード

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Store の定義
export const useExampleStore = defineStore('example', () => {
  // State: ref を使用して状態を定義
  const count = ref(0)
  const user = ref<User | null>(null)
  
  // Getters: computed を使用して計算プロパティを定義
  const doubleCount = computed(() => count.value * 2)
  const isLoggedIn = computed(() => !!user.value)
  
  // Actions: 通常の関数でメソッドを定義
  const increment = () => {
    count.value++
  }
  
  const setUser = (userData: User) => {
    user.value = userData
  }
  
  // 公開するすべての内容を返す必要がある
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

### Store の使用

```vue
<script setup lang="ts">
import { useExampleStore } from '@/stores/example'
import { storeToRefs } from 'pinia'

// Store インスタンスを取得
const exampleStore = useExampleStore()

// storeToRefs を使用して分割代入でリアクティブ性を保持
const { count, doubleCount } = storeToRefs(exampleStore)

// メソッドを直接分割代入
const { increment } = exampleStore

// テンプレート内で直接使用
// {{ count }} - リアクティブ
// {{ doubleCount }} - 計算プロパティ
// @click="increment" - メソッド
</script>
```

### Setup Store と Options Store の比較

| 機能 | Setup Store | Options Store |
|------|-------------|---------------|
| 構文 | Composition API | Options API |
| TypeScript | より良い型推論 | 追加設定が必要 |
| コード再利用 | コンポジション関数を抽出可能 | mixins を通じて |
| 推奨度 | ✅ **推奨** | 既存プロジェクトとの互換性 |

---

## 認証状態 (auth)

ユーザー認証情報を管理します。ログイン状態、Token、ユーザー情報などを含みます。

### 配置場所

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
// ログイン済みかどうか
const isLoggedIn = computed(() => !!token.value && !!user.value)

// ユーザーロールリスト（文字列配列）
const userRoles = computed(() => roles.value.map(role => role.code))

// ユーザー権限リスト（文字列配列）
const userPermissions = computed(() => permissions.value.map(perm => perm.code))
```

### Actions

#### ログイン

```typescript
// ログイン（Demo/本番モードを自動判定）
await authStore.login(username, password)

// ログイン成功後に自動的に：
// 1. Token を localStorage に保存
// 2. ユーザー情報を取得
// 3. roles と permissions を更新
```

#### ログアウト

```typescript
// すべての認証情報をクリア
authStore.logout()

// 自動的にクリアされるもの：
// 1. Token と RefreshToken
// 2. ユーザー情報
// 3. localStorage 内のデータ
```

#### 権限チェック

```typescript
// 特定のロールを持っているかチェック
const hasRole = (role: string): boolean

// いずれかのロールを持っているかチェック
const hasAnyRole = (roleList: string[]): boolean

// すべてのロールを持っているかチェック
const hasAllRoles = (roleList: string[]): boolean

// 特定の権限を持っているかチェック
const hasPermission = (permission: string): boolean

// いずれかの権限を持っているかチェック
const hasAnyPermission = (permissionList: string[]): boolean

// すべての権限を持っているかチェック
const hasAllPermissions = (permissionList: string[]): boolean
```

### 使用例

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user, isLoggedIn, userRoles, userPermissions } = storeToRefs(authStore)

// 権限チェック
const canEdit = computed(() => authStore.hasPermission('user.edit'))
const isAdmin = computed(() => authStore.hasRole('admin'))

// ログイン処理
const handleLogin = async (values: { username: string; password: string }) => {
  try {
    await authStore.login(values.username, values.password)
    message.success('登录成功')
    router.push('/')
  } catch (error) {
    message.error('登录失败')
  }
}

// ログアウト処理
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <!-- ユーザー情報を表示 -->
    <span v-if="isLoggedIn">欢迎, {{ user?.realName }}</span>
    
    <!-- 権限制御 -->
    <a-button v-if="canEdit">编辑</a-button>
    <a-tag v-if="isAdmin">管理员</a-tag>
  </div>
</template>
```

---

## 権限状態 (permission)

ルート権限と動的メニュー生成を管理します。

### 配置場所

`src/stores/permission.ts`

### State

```typescript
const routes = ref<RouteRecordRaw[]>([])        // アクセス可能なルートリスト
const menuTree = ref<MenuItem[]>([])           // メニューツリー
const loaded = ref(false)                       // 権限がロード済みか
```

### Getters

```typescript
// サイドバーメニュー
const sidebarMenu = computed(() => menuTree.value)

// パンくずナビゲーション
const breadcrumbList = computed(() => {
  // 現在のルートに基づいてパンくずを生成
})
```

### Actions

#### ルート生成

```typescript
// ユーザー権限に基づいてアクセス可能なルートを生成
await permissionStore.generateRoutes()

// 内部ロジック：
// 1. ユーザー権限を取得
// 2. asyncRoutes をフィルタリング
// 3. メニューツリーを生成
// 4. router に追加
```

### 使用例

```vue
<script setup lang="ts">
import { usePermissionStore } from '@/stores/permission'

const permissionStore = usePermissionStore()

// メニューデータはサイドバーのレンダリングに使用
const menuList = computed(() => permissionStore.sidebarMenu)
</script>
```

---

## テーマ状態 (theme)

アプリケーションテーマを管理します。ライト/ダークモード、テーマカラー、CSS変数などを含みます。

### 配置場所

`src/stores/theme.ts`

### State

```typescript
const themeMode = ref<ThemeMode>('light')           // テーマモード
const primaryColor = ref<string>('#1677ff')        // テーマカラー
const sidebarTheme = ref<'light' | 'dark'>('dark') // サイドバーテーマ
```

### 使用可能なテーマカラー

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

#### テーマモードの設定

```typescript
// テーマモードを設定
themeStore.setThemeMode('dark')     // ダーク
themeStore.setThemeMode('light')    // ライト
themeStore.setThemeMode('auto')     // システムに追従
```

#### テーマカラーの設定

```typescript
// テーマカラーを設定（プリセットまたはカスタム）
themeStore.setPrimaryColor('#1677ff')
```

#### サイドバーテーマの設定

```typescript
themeStore.setSidebarTheme('dark')   // ダークサイドバー
themeStore.setSidebarTheme('light')  // ライトサイドバー
```

### 使用例

```vue
<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { themeMode, primaryColor, sidebarTheme } = storeToRefs(themeStore)

// テーマ切り替え
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

## タブ状態 (tabs)

マルチタブナビゲーションを管理します。タブリスト、キャッシュ、右クリックメニューなどを含みます。

### 配置場所

`src/stores/tabs.ts`

### State

```typescript
const tabList = ref<TabItem[]>([])        // タブリスト
const cachedViews = ref<string[]>([])     // KeepAlive でキャッシュされたビュー
const activeKey = ref<string>('')         // 現在アクティブなタブ
```

### Actions

#### タブの追加

```typescript
// タブページを追加
tabsStore.addTab({
  path: '/dashboard',
  title: '仪表盘',
  name: 'Dashboard',
  affix: true,              // 固定するか（閉じられない）
  keepAlive: true,          // キャッシュするか
})
```

#### タブを閉じる

```typescript
// 指定したタブを閉じる
tabsStore.closeTab('/dashboard')

// 他のタブを閉じる
tabsStore.closeOthers('/dashboard')

// すべてのタブを閉じる
tabsStore.closeAll()
```

#### タブをリフレッシュ

```typescript
// 現在のタブをリフレッシュ（キャッシュをクリアして再読み込み）
tabsStore.refreshTab('/dashboard')
```

### 使用例

```vue
<script setup lang="ts">
import { useTabsStore } from '@/stores/tabs'
import { useRoute } from 'vue-router'

const tabsStore = useTabsStore()
const route = useRoute()

// ルート変更を監視して自動的にタブを追加
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

// タブを閉じる
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

## レイアウト状態 (layout)

レイアウト設定を管理します。サイドバー状態、レイアウトモードなどを含みます。

### 配置場所

`src/stores/layout.ts`

### State

```typescript
const sidebarCollapsed = ref(false)          // サイドバーが折りたたまれているか
const layoutMode = ref<'vertical' | 'horizontal'>('vertical')  // レイアウトモード
const isMobile = ref(false)                  // モバイルデバイスか
```

### Actions

```typescript
// サイドバーの折りたたみ状態を切り替え
layoutStore.toggleSidebar()

// レイアウトモードを設定
layoutStore.setLayoutMode('horizontal')

// デバイスタイプを検出
layoutStore.detectDevice()
```

---

## その他の Store

### 設定 (settings)

`src/stores/settings.ts` - ユーザーのパーソナライズ設定

```typescript
const showBreadcrumb = ref(true)        // パンくずを表示
const showTabs = ref(true)              // タブバーを表示
const enableAnimation = ref(true)       // アニメーションを有効化
const grayMode = ref(false)             // グレーモード
```

### 通知 (notification)

`src/stores/notification.ts` - メッセージ通知センター

```typescript
const unreadCount = ref(0)              // 未読メッセージ数
const noticeList = ref<Notice[]>([])    // 通知リスト

// Actions
fetchUnreadCount()                      // 未読数を取得
markAsRead(id)                          // 既読にする
markAllAsRead()                         // すべて既読にする
```

### 辞書 (dict)

`src/stores/dict.ts` - 辞書データキャッシュ

```typescript
const dictData = ref<Record<string, DictItem[]>>({})

// Actions
getDict(type: string)                   // 辞書を取得
setDict(type: string, data)             // 辞書を設定
```

---

## Store の組み合わせ使用

実際の開発では、複数の Store が協調して動作する必要があることがよくあります：

### ログインフローの例

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
    // 1. ログイン認証
    await authStore.login(values.username, values.password)
    
    // 2. 権限ルートを生成
    await permissionStore.generateRoutes()
    
    // 3. 以前のタブをクリア
    tabsStore.closeAll()
    
    // 4. ホームページにジャンプ
    router.push('/')
    
    message.success('登录成功')
  } catch (error) {
    message.error('登录失败')
  }
}
```

### コンポーネント内で複数の Store を使用

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

## ベストプラクティス

### 1. storeToRefs を使用して分割代入

```typescript
// ✅ 正しい：リアクティブ性を保持
const { count, doubleCount } = storeToRefs(store)

// ❌ 間違い：リアクティブ性を失う
const { count, doubleCount } = store
```

### 2. Store の外で State を変更しない

```typescript
// ✅ 正しい：Action を通じて変更
store.increment()

// ❌ 間違い：直接変更
store.count++
```

### 3. Store の責任は単一に

各 Store は1つのドメインの状態のみを管理：

- `auth` - 認証関連のみを管理
- `theme` - テーマ関連のみを管理
- `tabs` - タブページ関連のみを管理

### 4. 状態の永続化

永続化が必要な状態は `localStorage` を使用：

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

### 5. 型安全性

Store に完全な型を定義：

```typescript
import type { Store } from 'pinia'

export interface UserState {
  token: string | null
  user: User | null
}

export type UserStore = Store<'user', UserState>
```

---

## 次のステップ

- [開発ワークフロー](/guide/development-workflow) を理解してプロジェクト開発規範を習得
- [API 統合](/guide/api-integration) を学んでバックエンドサービスに接続
- [ユーティリティ関数](/guide/utils) を確認して一般的なユーティリティメソッドを理解
