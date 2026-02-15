# 공통 컴포넌트

본 문서는 Antdv Next Admin 프로젝트에서 Pro 컴포넌트 외의 일반적인 컴포넌트에 대해 설명합니다.

## 목차

- [IconPicker 아이콘 선택기](#iconpicker-아이콘-선택기)
- [Captcha 검증 코드](#captcha-검증-코드)
- [Editor 리치 텍스트 에디터](#editor-리치-텍스트-에디터)
- [Watermark 워터마크 컴포넌트](#watermark-워터마크-컴포넌트)
- [PermissionButton 권한 버튼](#permissionbutton-권한-버튼)

---

## IconPicker 아이콘 선택기

아이콘을 선택하는 팝업 컴포넌트로, 검색 및 카테고리별 탐색을 지원합니다.

### 위치

`src/components/IconPicker/`

### 기본 사용법

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

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| value | string | - | 현재 선택된 아이콘명 |
| placeholder | string | '아이콘을 선택하세요' | 플레이스홀더 텍스트 |
| readonly | boolean | false | 읽기 전용 여부 |

### 이벤트

| 이벤트명 | 매개변수 | 설명 |
|--------|------|------|
| change | icon: string | 아이콘 선택 시 트리거 |

---

## Captcha 검증 코드

여러 검증 코드 타입 제공: 슬라이더, 퍼즐, 회전, 클릭 선택.

### 위치

`src/components/Captcha/`

### 슬라이더 검증 코드

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
  message.success('검증 통과')
  // 로그인 등의 작업 실행
}

const handleFail = () => {
  message.error('검증 실패, 다시 시도하세요')
}
</script>
```

### 속성

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| visible | boolean | false | 표시 여부 |
| width | number | 300 | 너비 |
| height | number | 200 | 높이 |

---

## Editor 리치 텍스트 에디터

TipTap 기반 리치 텍스트 에디터 컴포넌트.

### 위치

`src/components/Editor/`

### 기본 사용법

```vue
<template>
  <Editor v-model="content" :height="400" />
</template>

<script setup>
import { ref } from 'vue'
import Editor from '@/components/Editor/index.vue'

const content = ref('<p>초기 콘텐츠</p>')
</script>
```

### Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| modelValue | string | '' | 에디터 콘텐츠 (HTML) |
| height | number | 300 | 에디터 높이 |
| placeholder | string | '콘텐츠를 입력하세요...' | 플레이스홀더 텍스트 |
| disabled | boolean | false | 비활성화 여부 |
| toolbar | string[] | 전체 | 표시할 툴바 버튼 |

### 툴바 설정

```vue
<Editor
  v-model="content"
  :toolbar="['bold', 'italic', 'heading', 'link', 'image', 'code']"
/>
```

사용 가능한 도구:
- `bold` - 굵게
- `italic` - 기울임
- `heading` - 제목
- `link` - 링크
- `image` - 이미지
- `code` - 코드 블록
- `blockquote` - 인용
- `bulletList` - 글머리 기호 목록
- `orderedList` - 번호 매기기 목록

---

## Watermark 워터마크 컴포넌트

페이지에 변조 방지 워터마크를 추가하는 데 사용됩니다.

### 위치

`src/components/Watermark/`

### 기본 사용법

```vue
<template>
  <Watermark content="내부 자료" :fullscreen="true" />
</template>

<script setup>
import Watermark from '@/components/Watermark/index.vue'
</script>
```

### 속성

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| content | string | - | 워터마크 텍스트 |
| fullscreen | boolean | false | 전체 화면 표시 여부 |
| opacity | number | 0.15 | 투명도 |
| fontSize | number | 14 | 폰트 크기 |
| color | string | '#000' | 폰트 색상 |
| rotate | number | -30 | 회전 각도 |
| gap | number[] | [100, 100] | 워터마크 간격 |

### Store를 사용한 관리

프로젝트에서 `useWatermarkStore`를 통해 워터마크를 관리할 수 있습니다:

```typescript
import { useWatermarkStore } from '@/stores/watermark'

const watermarkStore = useWatermarkStore()

// 워터마크 설정
watermarkStore.setWatermark({
  content: `${userStore.userInfo?.username} - ${formatDate(new Date())}`,
})

// 워터마크 제거
watermarkStore.clearWatermark()
```

---

## PermissionButton 권한 버튼

권한 검사를 캡슐화한 버튼 컴포넌트.

### 위치

`src/components/Permission/PermissionButton.vue`

### 기본 사용법

```vue
<template>
  <PermissionButton permission="user.create">
    사용자 추가
  </PermissionButton>
  
  <PermissionButton :permission="['user.edit', 'user.admin']">
    편집
  </PermissionButton>
</template>

<script setup>
import PermissionButton from '@/components/Permission/PermissionButton.vue'
</script>
```

### Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| permission | string \| string[] | - | 필요한 권한 |
| all | boolean | false | 모든 권한이 필요한지 여부 |

---

## 사용 권장 사항

### 1. 온디맨드 임포트

이러한 컴포넌트는 필요할 때 임포트하며, 전역 등록이 필요 없습니다:

```typescript
import IconPicker from '@/components/IconPicker/index.vue'
```

### 2. Pro 컴포넌트와 함께 사용

ProForm에서 이러한 컴포넌트 사용:

```typescript
const formItems = [
  {
    name: 'icon',
    label: '아이콘',
    type: 'custom',
    render: () => h(IconPicker),
  },
]
```

### 3. 권한 제어

권한 시스템과 함께 사용:

```vue
<PermissionButton permission="user.export">
  <ExportOutlined />
  데이터 내보내기
</PermissionButton>
```

---

## 다음 단계

- [Composables](/guide/composables)에서 컴포저블 함수 학습
- [유틸리티 함수](/guide/utils)에서 헬퍼 메서드 확인
- [상태 관리](/guide/state-management)에서 Pinia 사용법 습득
