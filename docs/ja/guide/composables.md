# Composables

本ドキュメントでは、Antdv Next Admin プロジェクトで提供されるコンポジション関数（Composables）について説明します。

## 目次

- [usePermission 権限チェック](#usepermission-権限チェック)
- [useFullscreen 全画面制御](#usefullscreen-全画面制御)
- [useWatermark 透かし管理](#usewatermark-透かし管理)

---

## usePermission 権限チェック

コンポーネント内で権限チェックを行うためのコンポジション関数。

### 場所

`src/composables/usePermission.ts`

### 基本的な使い方

```typescript
import { usePermission } from '@/composables/usePermission'

const { can, canAll, hasRole, hasAnyRole } = usePermission()

// 単一権限をチェック
if (can('user.create')) {
  console.log('ユーザーを作成できます')
}

// 複数権限をチェック（いずれか満たす）
if (can(['user.edit', 'user.admin'])) {
  console.log('編集または管理者権限があります')
}

// 複数権限をチェック（すべて満たす）
if (canAll(['user.edit', 'user.approve'])) {
  console.log('編集と承認の権限があります')
}

// ロールをチェック
if (hasRole('admin')) {
  console.log('管理者です')
}

// 複数ロールをチェック（いずれか満たす）
if (hasAnyRole(['admin', 'supervisor'])) {
  console.log('管理者または監督者です')
}
```

### 戻り値

| 属性 | 型 | 説明 |
|------|------|------|
| can | (permission: string \| string[]) => boolean | 権限があるかチェック |
| canAll | (permissions: string[]) => boolean | すべての権限があるかチェック |
| hasRole | (role: string) => boolean | ロールがあるかチェック |
| hasAnyRole | (roles: string[]) => boolean | いずれかのロールがあるかチェック |

### テンプレートでの使用

```vue
<template>
  <div>
    <a-button v-if="can('user.create')">新規追加</a-button>
    <a-tag v-if="hasRole('admin')">管理者</a-tag>
  </div>
</template>

<script setup>
import { usePermission } from '@/composables/usePermission'

const { can, hasRole } = usePermission()
</script>
```

---

## useFullscreen 全画面制御

要素またはページの全画面表示を制御するためのコンポジション関数。

### 場所

`src/composables/useFullscreen.ts`

### 基本的な使い方

```typescript
import { useFullscreen } from '@/composables/useFullscreen'

// ページ全体を全画面表示
const { isFullscreen, enter, exit, toggle } = useFullscreen()

// 特定の要素を全画面表示
const elementRef = ref()
const { isFullscreen, toggle } = useFullscreen(elementRef)
```

### 戻り値

| 属性 | 型 | 説明 |
|------|------|------|
| isFullscreen | `Ref<boolean>` | 全画面表示かどうか |
| enter | `() => Promise<void>` | 全画面表示に入る |
| exit | `() => Promise<void>` | 全画面表示を終了 |
| toggle | `() => Promise<void>` | 全画面表示を切り替え |

### 例

```vue
<template>
  <div ref="containerRef">
    <a-button @click="toggle">
      {{ isFullscreen ? '全画面終了' : '全画面表示' }}
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

## useWatermark 透かし管理

ページの透かしを管理するためのコンポジション関数。

### 場所

`src/composables/useWatermark.ts`

### 基本的な使い方

```typescript
import { useWatermark } from '@/composables/useWatermark'

const { setWatermark, clearWatermark } = useWatermark()

// 透かしを設定
setWatermark('内部資料 - 張三')

// オプション付きの透かしを設定
setWatermark({
  content: '機密文書',
  fontSize: 16,
  color: '#ff0000',
  rotate: -45,
})

// 透かしをクリア
clearWatermark()
```

### オプション

| オプション | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| content | string | - | 透かしテキスト |
| fontSize | number | 14 | フォントサイズ |
| color | string | '#000' | フォントカラー |
| opacity | number | 0.15 | 透明度 |
| rotate | number | -30 | 回転角度 |
| gap | [number, number] | [100, 100] | 間隔 |

### 改ざん防止

透かしコンポーネントには改ざん防止機能があり、ユーザーが透かし要素を削除しようとすると、自動的に再生成されます。

---

## カスタム Composable の作成

### テンプレート

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

### 命名規則

- `camelCase` を使用
- `use` で始める
- 機能を説明、例：`usePermission`、`useFullscreen`

### ベストプラクティス

1. **再利用可能なロジックを Composable に抽出**

```typescript
// ✅ 良い：再利用可能なロジックを抽出
export function useCount() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}

// 複数のコンポーネントで使用
const { count, increment } = useCount()
```

2. **パラメータはオブジェクト形式を使用**

```typescript
// ✅ 良い：オブジェクトパラメータを使用
export function useFetch(options: {
  url: string
  method?: 'GET' | 'POST'
  immediate?: boolean
}) {
  // ...
}

// 使用
useFetch({
  url: '/api/user',
  method: 'GET',
})
```

3. **リアクティブな参照を返す**

```typescript
// ✅ 良い：ref を返す
const data = ref(null)
return { data }

// 使用時にリアクティブを維持
const { data } = useFetch()
console.log(data.value)
```

---

## 次のステップ

- [ユーティリティ関数](/guide/utils) でヘルパーメソッドを学ぶ
- [通用コンポーネント](/guide/common-components) で再利用可能なコンポーネントを確認
- [状態管理](/guide/state-management) で Pinia の使用方法を習得
