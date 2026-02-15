# 빠른 시작

## 환경 준비

시작하기 전에 개발 환경이 다음 요구 사항을 충족하는지 확인하세요:

| 도구 | 버전 요구 사항 | 설명 |
| --- | --- | --- |
| Node.js | >= 16 | LTS 버전 권장 |
| npm | >= 8 | 또는 pnpm 사용(권장) |
| Git | 최신 버전 | 버전 관리 |

::: tip 권장
패키지 관리 도구로 [pnpm](https://pnpm.io/)을 사용하는 것을 권장합니다. 설치 속도가 빠르고 디스크 사용량이 적습니다.

```bash
npm install -g pnpm
```
:::

## 코드 가져오기

```bash
git clone https://github.com/yelog/antdv-next-admin.git
cd antdv-next-admin
```

## 의존성 설치

```bash
# pnpm 사용(권장)
pnpm install

# 또는 npm 사용
npm install
```

## 개발 서버 시작

```bash
# pnpm 사용
pnpm dev

# 또는 npm 사용
npm run dev
```

시작에 성공하면 브라우저에서 [http://localhost:3000](http://localhost:3000)에 접속합니다.

데모 계정으로 로그인:
- **관리자**: `admin` / `123456`(전체 권한 보유)
- **일반 사용자**: `user` / `123456`(제한된 권한)

## 빌드와 미리보기

```bash
# 타입 검사
pnpm type-check

# 프로덕션 빌드
pnpm build

# 타입 검사 + 프로덕션 빌드
pnpm build:check

# 빌드 결과물 미리보기
pnpm preview
```

## 환경 변수

프로젝트는 `.env` 파일로 환경 변수를 관리합니다:

| 파일 | 설명 |
| --- | --- |
| `.env` | 모든 환경에서 공통으로 사용하는 변수 |
| `.env.development` | 개발 환경 변수 |
| `.env.production` | 프로덕션 환경 변수 |

### 주요 변수

```bash
# 애플리케이션 타이틀
VITE_APP_TITLE=Antdv Next Admin

# API 베이스 경로
VITE_API_BASE_URL=/api

# Mock 데이터 활성화(개발 환경에서 기본 활성화)
VITE_USE_MOCK=true
```

::: warning 주의
환경 변수를 수정한 후에는 개발 서버를 재시작해야 적용됩니다.
:::

## 다음 단계

- [프로젝트 구조](/guide/project-structure)를 파악하여 코드 구성에 익숙해지기
- [라우팅 시스템](/guide/routing)을 읽고 페이지가 어떻게 구성되는지 이해하기
- [권한 시스템](/guide/permission)을 확인하여 권한 제어 방법 습득하기
- [Pro 컴포넌트](/components/pro-table)를 사용하여 비즈니스 페이지 빠르게 개발하기
