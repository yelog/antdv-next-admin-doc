# マスター詳細スキャフォールド

マスター詳細パターンの実装ガイドです。

## 概要

マスター詳細パターンは、以下のシナリオで使用されます：

- 注文と注文アイテム
- ユーザーとプロフィール
- カテゴリと商品

## 基本的な構造

```vue
<template>
  <ProSplitLayout>
    <template #left>
      <ProTable
        :columns="masterColumns"
        :data-source="masterData"
        @row-click="handleRowClick"
      />
    </template>
    
    <template #right>
      <ProDescriptions
        :data="detailData"
        :columns="detailColumns"
      />
    </template>
  </ProSplitLayout>
</template>
```

## 実装手順

1. **マスターテーブルの作成**
   - 主キーを定義
   - 行クリックイベントを設定

2. **詳細パネルの作成**
   - 選択されたレコードの詳細を表示
   - 編集機能を追加（オプション）

3. **データ同期**
   - マスター選択時に詳細をロード
   - ローディング状態を管理

## ベストプラクティス

1. レスポンシブデザインを考慮する
2. 空の状態を適切に処理する
3. キーボードナビゲーションをサポートする
