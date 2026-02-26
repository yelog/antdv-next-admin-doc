# 複雑なフォームスキャフォールド

このガイドでは、複雑なフォームの実装方法を説明します。

## 概要

複雑なフォームスキャフォールドは以下をサポートします：

- 動的フィールド
- フィールド間の依存関係
- ネストされたフォーム
- バリデーション
- フォームステップ

## 基本的な使い方

```vue
<template>
  <ProForm
    :schema="formSchema"
    :initial-values="initialValues"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ProForm } from '@/components/Pro'

const formSchema = [
  {
    label: 'ユーザー名',
    name: 'username',
    type: 'input',
    required: true
  },
  {
    label: 'メール',
    name: 'email',
    type: 'input',
    rules: [{ type: 'email' }]
  },
  {
    label: 'タイプ',
    name: 'type',
    type: 'select',
    options: [
      { label: '個人', value: 'individual' },
      { label: '企業', value: 'company' }
    ]
  }
]

const handleSubmit = (values: any) => {
  console.log('Form values:', values)
}
</script>
```

## 動的フィールド

```vue
const schema = computed(() => [
  {
    label: 'タイプ',
    name: 'type',
    type: 'select',
    options: typeOptions
  },
  {
    label: '会社名',
    name: 'companyName',
    type: 'input',
    // タイプが 'company' の場合のみ表示
    visible: (formData) => formData.type === 'company'
  }
])
```

## ベストプラクティス

1. バリデーションルールを明確に定義する
2. フォームの状態管理を適切に行う
3. エラーメッセージをユーザーフレンドリーにする
