# 通用コンポーネント

本ドキュメントでは、Antdv Next Admin プロジェクトで Pro コンポーネント以外の一般的なコンポーネントについて説明します。

## 目次

- [IconPicker アイコン選択](#iconpicker-アイコン選択)
- [Captcha 検証コード](#captcha-検証コード)
- [Editor リッチテキストエディタ](#editor-リッチテキストエディタ)
- [Watermark 透かしコンポーネント](#watermark-透かしコンポーネント)
- [PermissionButton 権限ボタン](#permissionbutton-権限ボタン)

---

## IconPicker アイコン選択

アイコンを選択するためのポップアップコンポーネントで、検索とカテゴリ別閲覧をサポートします。

### 場所

`src/components/IconPicker/`

### 基本的な使い方

```vue
<template>
  <IconPicker v-model:value="iconName" />
</template>

<script setup>
import { ref } from 'vue'
import IconPicker from '@/components/IconPicker/index.vue'

const iconName = ref('HomeOutlined')
</script>
```

### Props

| 属性 | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| value | string | - | 現在選択されているアイコン名 |
| placeholder | string | 'アイコンを選択してください' | プレースホルダーテキスト |
| readonly | boolean | false | 読み取り専用かどうか |

### イベント

| イベント名 | パラメータ | 説明 |
|--------|------|------|
| change | icon: string | アイコン選択時にトリガー |

---

## Captcha 検証コード

複数の検証コードタイプを提供：スライダー、パズル、回転、クリック選択。

### 場所

`src/components/Captcha/`

### スライダー検証コード

```vue
<template>
  <SliderCaptcha
    v-model:visible="visible"
    @success="handleSuccess"
    @fail="handleFail"
  />
</template>

<script setup>
import { ref } from 'vue'
import SliderCaptcha from '@/components/Captcha/SliderCaptcha.vue'

const visible = ref(false)

const handleSuccess = () => {
  message.success('検証成功')
  // ログインなどの操作を実行
}

const handleFail = () => {
  message.error('検証失敗、再試行してください')
}
</script>
```

### 属性

| 属性 | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| visible | boolean | false | 表示するかどうか |
| width | number | 300 | 幅 |
| height | number | 200 | 高さ |

---

## Editor リッチテキストエディタ

TipTap ベースのリッチテキストエディタコンポーネント。

### 場所

`src/components/Editor/`

### 基本的な使い方

```vue
<template>
  <Editor v-model="content" :height="400" />
</template>

<script setup>
import { ref } from 'vue'
import Editor from '@/components/Editor/index.vue'

const content = ref('<p>初期コンテンツ</p>')
</script>
```

### Props

| 属性 | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| modelValue | string | '' | エディタコンテンツ（HTML） |
| height | number | 300 | エディタの高さ |
| placeholder | string | 'コンテンツを入力してください...' | プレースホルダーテキスト |
| disabled | boolean | false | 無効にするかどうか |
| toolbar | string[] | すべて | 表示するツールバーボタン |

### ツールバー設定

```vue
<Editor
  v-model="content"
  :toolbar="['bold', 'italic', 'heading', 'link', 'image', 'code']"
/>
```

利用可能なツール：
- `bold` - 太字
- `italic` - 斜体
- `heading` - 見出し
- `link` - リンク
- `image` - 画像
- `code` - コードブロック
- `blockquote` - 引用
- `bulletList` - 箇条書きリスト
- `orderedList` - 番号付きリスト

---

## Watermark 透かしコンポーネント

ページに改ざん防止の透かしを追加するために使用されます。

### 場所

`src/components/Watermark/`

### 基本的な使い方

```vue
<template>
  <Watermark content="内部資料" :fullscreen="true" />
</template>

<script setup>
import Watermark from '@/components/Watermark/index.vue'
</script>
```

### 属性

| 属性 | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| content | string | - | 透かしテキスト |
| fullscreen | boolean | false | 全画面表示するかどうか |
| opacity | number | 0.15 | 透明度 |
| fontSize | number | 14 | フォントサイズ |
| color | string | '#000' | フォントカラー |
| rotate | number | -30 | 回転角度 |
| gap | number[] | [100, 100] | 透かしの間隔 |

### Store を使用した管理

プロジェクトでは `useWatermarkStore` を通じて透かしを管理できます：

```typescript
import { useWatermarkStore } from '@/stores/watermark'

const watermarkStore = useWatermarkStore()

// 透かしを設定
watermarkStore.setWatermark({
  content: `${userStore.userInfo?.username} - ${formatDate(new Date())}`,
})

// 透かしをクリア
watermarkStore.clearWatermark()
```

---

## PermissionButton 権限ボタン

権限チェックをカプセル化したボタンコンポーネント。

### 場所

`src/components/Permission/PermissionButton.vue`

### 基本的な使い方

```vue
<template>
  <PermissionButton permission="user.create">
    ユーザーを追加
  </PermissionButton>
  
  <PermissionButton :permission="['user.edit', 'user.admin']">
    編集
  </PermissionButton>
</template>

<script setup>
import PermissionButton from '@/components/Permission/PermissionButton.vue'
</script>
```

### Props

| 属性 | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| permission | string \| string[] | - | 必要な権限 |
| all | boolean | false | すべての権限が必要かどうか |

---

## 使用上の推奨事項

### 1. オンデマンドインポート

これらのコンポーネントは必要に応じてインポートし、グローバル登録は不要です：

```typescript
import IconPicker from '@/components/IconPicker/index.vue'
```

### 2. Pro コンポーネントとの併用

ProForm でこれらのコンポーネントを使用：

```typescript
const formItems = [
  {
    name: 'icon',
    label: 'アイコン',
    type: 'custom',
    render: () => h(IconPicker),
  },
]
```

### 3. 権限制御

権限システムと組み合わせて使用：

```vue
<PermissionButton permission="user.export">
  <ExportOutlined />
  データをエクスポート
</PermissionButton>
```

---

## 次のステップ

- [Composables](/guide/composables) でコンポジション関数を学ぶ
- [ユーティリティ関数](/guide/utils) でヘルパーメソッドを確認
- [状態管理](/guide/state-management) で Pinia の使用方法を習得
