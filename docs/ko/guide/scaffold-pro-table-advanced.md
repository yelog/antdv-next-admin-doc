# 고급 테이블 스캐폴드

이 가이드는 ProTable을 사용한 고급 테이블 구현의 모범 사례를 소개합니다.

## 개요

고급 테이블 스캐폴드는 다음 기능을 제공합니다:

- 자동 검색 양식 생성
- 열 설정(표시/숨기기, 정렬, 고정)
- 페이지네이션 및 데이터 새로고침
- 도구 모음 작업
- 행 선택 및 일괄 작업

## 기본 사용법

```vue
<template>
  <ProTable
    :columns="columns"
    :request="fetchData"
    :search="searchConfig"
  >
    <template #toolbar>
      <a-button type="primary">새로 만들기</a-button>
    </template>
  </ProTable>
</template>

<script setup lang="ts">
import { ProTable } from '@/components/Pro'

const columns = [
  { title: '이름', dataIndex: 'name', valueType: 'text' },
  { title: '나이', dataIndex: 'age', valueType: 'number' },
  { title: '상태', dataIndex: 'status', valueType: 'tag' }
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

## 고급 기능

### 1. 열 설정

사용자는 열의 표시/숨기기, 순서, 너비를 사용자 정의할 수 있습니다.

### 2. 검색 양식

자동 생성되는 검색 양식은 여러 필드 유형을 지원합니다.

### 3. 일괄 작업

행 선택을 활성화하여 일괄 삭제나 낳ươt를 구현할 수 있습니다.

## 모범 사례

1. **API 설계**: 페이지네이션과 필터링을 적절히 처리
2. **성능**: 대량의 데이터의 경우 가상 스크롤 사용
3. **UX**: 로딩 상태와 오류 처리를 적절히 구현
