# 테마 시스템

## 개요

Antdv Next Admin은 유연한 테마 시스템을 제공하며, CSS 변수와 Pinia Store를 통해 동적 테마 전환을 구현하고 다양한 테마 색상 및 라이트/다크 모드를 지원합니다.

## 테마 모드

3가지 테마 모드 지원:

| 모드 | 설명 |
| --- | --- |
| `light` | 라이트 모드 |
| `dark` | 다크 모드(Ant Design의 `darkAlgorithm` 사용) |
| `auto` | 시스템 설정에 자동 추종 |

### 테마 모드 전환

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

themeStore.setThemeMode('dark')   // 다크 모드로 전환
themeStore.setThemeMode('light')  // 라이트 모드로 전환
themeStore.setThemeMode('auto')   // 시스템 추종
```

## 테마 색상

6가지 프리셋 테마 색상 내장:

| 색상 | 색상값 | 이름 |
| --- | --- | --- |
| 🔵 블루 | `#1677ff` | 기본값 |
| 🟢 그린 | `#52c41a` | — |
| 🟣 퍼플 | `#722ed1` | — |
| 🔴 레드 | `#f5222d` | — |
| 🟠 오렌지 | `#fa8c16` | — |
| 🔵 시안 | `#13c2c2` | — |

### 테마 색상 설정

```typescript
themeStore.setPrimaryColor('#1677ff')  // 임의의 유효한 색상값
```

## CSS 변수

테마 시스템의 핵심은 `src/assets/styles/variables.css`에 정의된 100개 이상의 CSS 디자인 변수입니다:

```css
:root {
  /* 주요 색상 */
  --ant-primary-color: #1677ff;

  /* 배경색 */
  --bg-color: #ffffff;
  --bg-color-secondary: #f5f5f5;

  /* 텍스트 색상 */
  --text-color: rgba(0, 0, 0, 0.88);
  --text-color-secondary: rgba(0, 0, 0, 0.65);

  /* 사이드바 */
  --sidebar-bg-color: #001529;
  --sidebar-text-color: rgba(255, 255, 255, 0.65);

  /* 추가 변수... */
}
```

Theme Store는 테마 전환 시 `document.documentElement`의 CSS 변수를 동적으로 업데이트합니다.

### CSS 변수 사용

컴포넌트 스타일에서 직접 사용:

```css
.my-component {
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}
```

::: tip 모범 사례
하드코딩된 색상값 대신 CSS 변수를 우선적으로 사용하여 모든 테마 모드에서 컴포넌트가 올바르게 표시되도록 하세요.
:::

## 사이드바 테마

사이드바는 독립적인 명암 테마 설정을 지원하며, 전역 테마 모드의 영향을 받지 않습니다:

- **다크 사이드바**: 진한 파란색 배경(`#001529`), 라이트 메인 콘텐츠 영역과의 조합에 적합
- **라이트 사이드바**: 흰색 배경, 전체적으로 더 통일된 스타일

사이드바 테마는 독립적인 CSS 변수로 제어됩니다(`--sidebar-bg-color`, `--sidebar-text-color` 등).

## 커스텀 테마

### 새 프리셋 색상 추가

Theme Store의 색상 프리셋 배열에 새 색상을 추가하기만 하면 됩니다.

### 기본 CSS 변수 수정

`src/assets/styles/variables.css`를 편집하여 CSS 변수 정의를 수정하거나 추가합니다. 수정 후 해당 변수를 사용하는 모든 컴포넌트가 자동으로 업데이트됩니다.

### Ant Design 테마

다크 모드는 Ant Design Vue의 `darkAlgorithm`을 통해 구현되어 모든 Ant Design 컴포넌트가 다크 모드에서 올바르게 렌더링되도록 보장합니다.
