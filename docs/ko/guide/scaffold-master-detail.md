# 마스터-상세 스캐폴드

마스터-상세 패턴의 구현 가이드입니다.

## 개요

마스터-상세 패턴은 다음 시나리오에서 사용됩니다:

- 주문과 주문 항목
- 사용자와 프로필
- 카테고리와 상품

## 기본 구조

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

## 구현 단계

1. **마스터 테이블 생성**
   - 기본 키 정의
   - 행 클릭 이벤트 설정

2. **상세 패널 생성**
   - 선택된 레코드의 상세 표시
   - 편집 기능 추가(옵션)

3. **데이터 동기화**
   - 마스터 선택 시 상세 로드
   - 로딩 상태 관리

## 모범 사례

1. 반응형 디자인 고려
2. 빈 상태를 적절히 처리
3. 키보드 탐색 지원
