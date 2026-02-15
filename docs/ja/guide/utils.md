# ユーティリティ関数

本ドキュメントでは、Antdv Next Admin プロジェクトで提供される一般的なユーティリティ関数について説明し、開発者の開発効率向上を支援します。

## 目次

- [Storage ストレージツール](#storage-ストレージツール)
- [Auth 認証ツール](#auth-認証ツール)
- [Form Rules フォームバリデーション](#form-rules-フォームバリデーション)
- [Helpers ヘルパー関数](#helpers-ヘルパー関数)
- [Export データエクスポート](#export-データエクスポート)

---

## Storage ストレージツール

`src/utils/storage.ts` - localStorage と sessionStorage をカプセル化し、有効期限設定をサポートします。

### 基本的な使い方

```typescript
import storage from '@/utils/storage'

// localStorage（永続ストレージ）
storage.set('user', { name: '張三', id: 1 })
const user = storage.get('user')
storage.remove('user')
storage.clear()

// sessionStorage（セッションストレージ）
storage.session.set('temp', '一時データ')
const temp = storage.session.get('temp')
```

### 有効期限の設定

```typescript
// データは1時間後に期限切れ
storage.set('token', 'xxx', { expires: 3600 })

// 期限切れ後の取得は null を返す
const token = storage.get('token') // null
```

### TypeScript サポート

```typescript
interface User {
  name: string
  id: number
}

// 型付きの取得
const user = storage.get<User>('user')
console.log(user?.name)
```

---

## Auth 認証ツール

`src/utils/auth.ts` - Token の保存と取得を処理します。

### API

```typescript
import { getToken, setToken, removeToken } from '@/utils/auth'

// Token を取得
const token = getToken()

// Token を設定
setToken('Bearer xxx')

// Token を削除
removeToken()
```

---

## Form Rules フォームバリデーション

`src/utils/formRules.ts` - 一般的なフォームバリデーションルールを提供します。

### 一般的なルール

```typescript
import { formRules } from '@/utils/formRules'

const rules = {
  // 必須
  name: formRules.required('名前を入力してください'),
  
  // メールアドレス
  email: formRules.email,
  
  // 電話番号
  phone: formRules.phone,
  
  // 身分証明書番号
  idCard: formRules.idCard,
  
  // カスタム正規表現
  code: formRules.pattern(/^[A-Z]{2}\d{4}$/, '形式：大文字2文字+数字4桁'),
}
```

### ルールの組み合わせ

```typescript
const rules = {
  password: [
    formRules.required('パスワードを入力してください'),
    { min: 6, message: 'パスワードは6文字以上必要です' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '大文字、小文字、数字を含む必要があります' },
  ],
  confirmPassword: [
    formRules.required('パスワードを確認してください'),
    { validator: validateConfirmPassword },
  ],
}
```

### カスタムバリデーション

```typescript
const validateConfirmPassword = (rule: any, value: string) => {
  if (value !== formState.password) {
    return Promise.reject('2回入力したパスワードが一致しません')
  }
  return Promise.resolve()
}
```

---

## Helpers ヘルパー関数

`src/utils/helpers.ts` - 汎用ヘルパー関数のコレクション。

### 日時

```typescript
import { formatDate, formatDateTime, formatTime, getRelativeTime } from '@/utils/helpers'

formatDate('2024-01-15')                    // 2024-01-15
formatDateTime('2024-01-15T08:30:00')       // 2024-01-15 08:30:00
formatTime(new Date())                       // 08:30:00
getRelativeTime(Date.now() - 3600000)       // 1時間前
```

### ファイル処理

```typescript
import { formatFileSize, downloadFile } from '@/utils/helpers'

formatFileSize(1024)        // 1 KB
formatFileSize(1024000)     // 1000 KB
formatFileSize(1048576)     // 1 MB

downloadFile(blob, 'ファイル名.pdf')
```

### URL パラメータ

```typescript
import { getQueryParam, setQueryParam } from '@/utils/helpers'

// URL: /list?page=1&size=10
getQueryParam('page')       // '1'
getQueryParam('size')       // '10'

setQueryParam({ keyword: 'test' })
// URL: /list?page=1&size=10&keyword=test
```

### ツリーデータ処理

```typescript
import { treeToList, listToTree, findTreeNode } from '@/utils/helpers'

// リストをツリーに変換
const tree = listToTree(list, { id: 'id', parentId: 'parentId' })

// ツリーをリストに変換
const list = treeToList(tree)

// ノードを検索
const node = findTreeNode(tree, (node) => node.id === '123')
```

### ディープクローン

```typescript
import { deepClone } from '@/utils/helpers'

const obj = { a: 1, b: { c: 2 } }
const clone = deepClone(obj)
clone.b.c = 3
console.log(obj.b.c) // 2（元のオブジェクトは変更されない）
```

---

## Export データエクスポート

`src/utils/export.ts` - Excel と JSON のエクスポート機能を提供します。

### Excel のエクスポート

```typescript
import { exportExcel } from '@/utils/export'

const data = [
  { name: '張三', age: 25, email: 'zhangsan@example.com' },
  { name: '李四', age: 30, email: 'lisi@example.com' },
]

const columns = [
  { title: '名前', dataIndex: 'name' },
  { title: '年齢', dataIndex: 'age' },
  { title: 'メール', dataIndex: 'email' },
]

exportExcel(data, columns, 'ユーザーリスト.xlsx')
```

### JSON のエクスポート

```typescript
import { exportJson } from '@/utils/export'

exportJson(data, 'データバックアップ.json')
```

### バッチエクスポート

```typescript
import { exportExcel } from '@/utils/export'

// 大量データの分割エクスポート
const exportAll = async () => {
  const allData = []
  
  // すべてのデータを循環的に取得
  for (let page = 1; page <= totalPages; page++) {
    const { list } = await fetchData({ page, pageSize: 100 })
    allData.push(...list)
  }
  
  exportExcel(allData, columns, '完全データ.xlsx')
}
```

---

## ベストプラクティス

### 1. ユーティリティ関数を優先的に使用

車輪の再発明をしないでください。プロジェクトに既存のユーティリティ関数：

```typescript
// ✅ ユーティリティ関数を使用
import { formatDate } from '@/utils/helpers'
const date = formatDate(value)

// ❌ 自分でフォーマットを書く
const date = new Date(value).toLocaleDateString()
```

### 2. 型定義を追加

ユーティリティ関数に適切な型を追加：

```typescript
// helpers.ts
export function formatDate(date: string | Date | number): string
```

### 3. ユニットテスト

ユーティリティ関数にはユニットテストを記述すべきです：

```typescript
// tests/unit/helpers.spec.ts
describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate('2024-01-15')).toBe('2024-01-15')
  })
})
```

---

## 次のステップ

- [通用コンポーネント](/guide/common-components) で再利用可能な UI コンポーネントを学ぶ
- [Composables](/guide/composables) でコンポジション関数を確認
- [状態管理](/guide/state-management) で Pinia の使用方法を習得
