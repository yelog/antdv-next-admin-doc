# 高度なテーブルスキャフォールド

このガイドでは、ProTable を使用した高度なテーブル実装のベストプラクティスを紹介します。

## 概要

高度なテーブルスキャフォールドは、以下の機能を提供します：

- 自動検索フォーム生成
- 列設定（表示/非表示、ソート、固定）
- ページネーションとデータリフレッシュ
- ツールバー操作
- 行選択と一括操作

## 基本的な使い方

```vue
<template>
  <ProTable
    :columns="columns"
    :request="fetchData"
    :search="searchConfig"
  >
    <template #toolbar>
      <a-button type="primary">新規作成</a-button>
    </template>
  </ProTable>
</template>

<script setup lang="ts">
import { ProTable } from '@/components/Pro'

const columns = [
  { title: '名前', dataIndex: 'name', valueType: 'text' },
  { title: '年齢', dataIndex: 'age', valueType: 'number' },
  { title: '状態', dataIndex: 'status', valueType: 'tag' }
]

const searchConfig = {
  defaultCollapsed: false,
  labelWidth: 100
}

const fetchData = async (params: any) => {
  const response = await fetch('/api/users', {
    params
  })
  return {
    data: response.data,
    total: response.total
  }
}
</script>
```

## 高度な機能

### 1. 列の設定

ユーザーは列の表示/非表示、順序、幅をカスタマイズできます。

### 2. 検索フォーム

自動生成される検索フォームは、複数のフィールドタイプをサポートします。

### 3. 一括操作

行選択を有効にして、一括削除やエクスポートを実装できます。

## ベストプラクティス

1. **API 設計**: ページネーションとフィルタリングを適切に処理する
2. **パフォーマンス**: 大量のデータの場合は仮想スクロールを使用する
3. **UX**: ローディング状態とエラーハンドリングを適切に実装する
