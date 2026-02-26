# 복잡한 양식 스캐폴드

이 가이드는 복잡한 양식의 구현 방법을 설명합니다.

## 개요

복잡한 양식 스캐폴드는 다음을 지원합니다:

- 동적 필드
- 필드 간 의존 관계
- 중첩된 양식
- 유효성 검사
- 양식 단계

## 기본 사용법

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
    label: '사용자 이름',
    name: 'username',
    type: 'input',
    required: true
  },
  {
    label: '이메일',
    name: 'email',
    type: 'input',
    rules: [{ type: 'email' }]
  },
  {
    label: '유형',
    name: 'type',
    type: 'select',
    options: [
      { label: '개인', value: 'individual' },
      { label: '기업', value: 'company' }
    ]
  }
]

const handleSubmit = (values: any) => {
  console.log('Form values:', values)
}
</script>
```

## 동적 필드

```vue
const schema = computed(() => [
  {
    label: '유형',
    name: 'type',
    type: 'select',
    options: typeOptions
  },
  {
    label: '회사명',
    name: 'companyName',
    type: 'input',
    // 유형이 'company'인 경우에만 표시
    visible: (formData) => formData.type === 'company'
  }
])
```

## 모범 사례

1. 유효성 검사 규칙을 명확하게 정의
2. 양식의 상태 관리를 적절히 수행
3. 오류 메시지를 사용자 친화적으로 작성
