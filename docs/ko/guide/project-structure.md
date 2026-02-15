# 프로젝트 구조

## 디렉토리 개요

```
antdv-next-admin/
├── mock/                          # Mock 데이터
│   ├── data/                      # 데이터 소스(faker.js로 생성)
│   │   ├── auth.data.ts
│   │   ├── user.data.ts
│   │   ├── role.data.ts
│   │   └── ...
│   └── handlers/                  # 요청 핸들러
│       ├── auth.mock.ts
│       ├── user.mock.ts
│       └── ...
├── public/                        # 정적 리소스
│   └── logo.svg
├── src/
│   ├── api/                       # API 인터페이스 모듈
│   │   ├── auth.ts                # 인증 인터페이스
│   │   ├── user.ts                # 사용자 관리 인터페이스
│   │   ├── role.ts                # 역할 관리 인터페이스
│   │   └── ...
│   ├── assets/                    # 프로젝트 리소스
│   │   └── styles/
│   │       └── variables.css      # CSS 디자인 변수(100+)
│   ├── components/                # 공통 컴포넌트
│   │   ├── Icon/                  # 아이콘 컴포넌트
│   │   ├── IconPicker/            # 아이콘 선택기
│   │   ├── Permission/            # 권한 컴포넌트
│   │   │   └── PermissionButton.vue
│   │   └── Pro/                   # Pro 컴포넌트
│   │       ├── ProTable/          # 고급 테이블
│   │       ├── ProForm/           # 고급 폼
│   │       └── ProModal/          # 고급 모달
│   ├── composables/               # 컴포저블 함수
│   │   ├── usePermission.ts       # 권한 검증
│   │   └── ...
│   ├── directives/                # 커스텀 디렉티브
│   │   └── permission.ts          # v-permission 디렉티브
│   ├── layouts/                   # 레이아웃 컴포넌트
│   │   └── AdminLayout.vue
│   ├── locales/                   # 국제화
│   │   ├── index.ts               # i18n 설정
│   │   ├── zh-CN.ts               # 중국어
│   │   └── en-US.ts               # 영어
│   ├── router/                    # 라우터
│   │   ├── index.ts               # 라우터 인스턴스
│   │   ├── routes.ts              # 라우트 설정
│   │   └── guards.ts              # 라우트 가드
│   ├── stores/                    # 상태 관리(Pinia)
│   │   ├── auth.ts                # 인증 상태
│   │   ├── permission.ts          # 권한 상태
│   │   ├── theme.ts               # 테마 상태
│   │   ├── layout.ts              # 레이아웃 상태
│   │   ├── tabs.ts                # 탭 상태
│   │   └── settings.ts            # 사용자 설정
│   ├── types/                     # 타입 정의
│   │   ├── api.ts                 # API 타입
│   │   ├── auth.ts                # 인증 타입
│   │   ├── router.ts              # 라우터 타입
│   │   ├── layout.ts              # 레이아웃 타입
│   │   └── pro.ts                 # Pro 컴포넌트 타입
│   ├── utils/                     # 유틸리티 함수
│   │   ├── request.ts             # Axios 요청 래퍼
│   │   └── ...
│   ├── views/                     # 페이지 뷰
│   │   ├── dashboard/             # 대시보드
│   │   ├── login/                 # 로그인 페이지
│   │   ├── organization/          # 조직 관리
│   │   ├── system/                # 시스템 관리
│   │   ├── examples/              # 예제 페이지
│   │   └── error/                 # 오류 페이지
│   ├── App.vue                    # 루트 컴포넌트
│   └── main.ts                    # 애플리케이션 진입점
├── .env                           # 공통 환경 변수
├── .env.development               # 개발 환경 변수
├── .env.production                # 프로덕션 환경 변수
├── index.html                     # HTML 진입점
├── package.json
├── tsconfig.json                  # TypeScript 설정
└── vite.config.ts                 # Vite 설정
```

## 주요 디렉토리 설명

### `src/api/`

비즈니스 도메인별로 구성된 API 인터페이스 모듈. 각 파일은 하나의 기능 모듈에 대응하며, `@/utils/request.ts`에서 래핑된 Axios 인스턴스를 사용하여 요청을 전송합니다.

### `src/components/Pro/`

핵심 Pro 컴포넌트, 설정 기반 고급 비즈니스 컴포넌트. 자세한 내용은 [ProTable](/components/pro-table), [ProForm](/components/pro-form), [ProModal](/components/pro-modal) 문서를 참조하세요.

### `src/stores/`

모든 Store는 Pinia **Setup Store** 문법(`defineStore('name', () => { ... })`)을 사용하며, Options Store가 아닙니다. Store의 초기화는 라우트 가드에 의해 트리거되며, 컴포넌트에서 직접 트리거되지 않습니다.

### `src/router/routes.ts`

라우트 설정은 3계층 구조:
- **staticRoutes** — 인증 불필요(로그인, 오류 페이지)
- **basicRoutes** — 인증 필요(대시보드, 개인 센터)
- **asyncRoutes** — 권한 필요(시스템 관리, 조직 관리 등)

### `src/types/`

TypeScript 타입 정의 중앙 관리. `pro.ts`에는 모든 Pro 컴포넌트의 인터페이스 정의가 포함되어 있으며, Pro 컴포넌트 개발의 중요한 참고 자료입니다.

### `mock/`

Mock 데이터 시스템은 2계층 아키텍처를 채택: `data/`에 데이터 생성 로직(faker.js 사용), `handlers/`에 요청 처리 로직을 저장합니다.

## 경로 별칭

프로젝트는 `@/` 경로 별칭을 설정하여 `src/` 디렉토리를 가리킵니다:

```typescript
// import { useAuthStore } from '../stores/auth'와 동일
import { useAuthStore } from '@/stores/auth'
```

이 별칭은 `vite.config.ts`와 `tsconfig.json` 모두에서 설정되어 있습니다.
