# 유틸리티 함수

본 문서는 Antdv Next Admin 프로젝트에서 제공하는 일반적인 유틸리티 함수에 대해 설명하며, 개발자의 개발 효율성 향상을 지원합니다.

## 목차

- [Storage 스토리지 도구](#storage-스토리지-도구)
- [Auth 인증 도구](#auth-인증-도구)
- [Form Rules 폼 검증](#form-rules-폼-검증)
- [Helpers 헬퍼 함수](#helpers-헬퍼-함수)
- [Export 데이터 내보내기](#export-데이터-내보내기)

---

## Storage 스토리지 도구

`src/utils/storage.ts` - localStorage와 sessionStorage를 캡슐화하고, 만료 시간 설정을 지원합니다.

### 기본 사용법

```typescript
import storage from '@/utils/storage'

// localStorage (영구 저장)
storage.set('user', { name: '张三', id: 1 })
const user = storage.get('user')
storage.remove('user')
storage.clear()

// sessionStorage (세션 저장)
storage.session.set('temp', '임시 데이터')
const temp = storage.session.get('temp')
```

### 만료 시간 설정

```typescript
// 데이터는 1시간 후 만료
storage.set('token', 'xxx', { expires: 3600 })

// 만료 후 가져오기는 null 반환
const token = storage.get('token') // null
```

### TypeScript 지원

```typescript
interface User {
  name: string
  id: number
}

// 타입이 있는 가져오기
const user = storage.get<User>('user')
console.log(user?.name)
```

---

## Auth 인증 도구

`src/utils/auth.ts` - Token의 저장 및 가져오기를 처리합니다.

### API

```typescript
import { getToken, setToken, removeToken } from '@/utils/auth'

// Token 가져오기
const token = getToken()

// Token 설정
setToken('Bearer xxx')

// Token 제거
removeToken()
```

---

## Form Rules 폼 검증

`src/utils/formRules.ts` - 일반적인 폼 검증 규칙을 제공합니다.

### 일반적인 규칙

```typescript
import { formRules } from '@/utils/formRules'

const rules = {
  // 필수
  name: formRules.required('이름을 입력하세요'),
  
  // 이메일
  email: formRules.email,
  
  // 전화번호
  phone: formRules.phone,
  
  // 주민등록번호
  idCard: formRules.idCard,
  
  // 커스텀 정규식
  code: formRules.pattern(/^[A-Z]{2}\d{4}$/, '형식: 대문자 2자+숫자 4자리'),
}
```

### 규칙 조합

```typescript
const rules = {
  password: [
    formRules.required('비밀번호를 입력하세요'),
    { min: 6, message: '비밀번호는 최소 6자 이상이어야 합니다' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '대소문자와 숫자를 포함해야 합니다' },
  ],
  confirmPassword: [
    formRules.required('비밀번호를 확인하세요'),
    { validator: validateConfirmPassword },
  ],
}
```

### 커스텀 검증

```typescript
const validateConfirmPassword = (rule: any, value: string) => {
  if (value !== formState.password) {
    return Promise.reject('두 번 입력한 비밀번호가 일치하지 않습니다')
  }
  return Promise.resolve()
}
```

---

## Helpers 헬퍼 함수

`src/utils/helpers.ts` - 범용 헬퍼 함수 모음.

### 날짜 시간

```typescript
import { formatDate, formatDateTime, formatTime, getRelativeTime } from '@/utils/helpers'

formatDate('2024-01-15')                    // 2024-01-15
formatDateTime('2024-01-15T08:30:00')       // 2024-01-15 08:30:00
formatTime(new Date())                       // 08:30:00
getRelativeTime(Date.now() - 3600000)       // 1시간 전
```

### 파일 처리

```typescript
import { formatFileSize, downloadFile } from '@/utils/helpers'

formatFileSize(1024)        // 1 KB
formatFileSize(1024000)     // 1000 KB
formatFileSize(1048576)     // 1 MB

downloadFile(blob, '파일명.pdf')
```

### URL 매개변수

```typescript
import { getQueryParam, setQueryParam } from '@/utils/helpers'

// URL: /list?page=1&size=10
getQueryParam('page')       // '1'
getQueryParam('size')       // '10'

setQueryParam({ keyword: 'test' })
// URL: /list?page=1&size=10&keyword=test
```

### 트리 데이터 처리

```typescript
import { treeToList, listToTree, findTreeNode } from '@/utils/helpers'

// 목록을 트리로 변환
const tree = listToTree(list, { id: 'id', parentId: 'parentId' })

// 트리를 목록으로 변환
const list = treeToList(tree)

// 노드 찾기
const node = findTreeNode(tree, (node) => node.id === '123')
```

### 깊은 복제

```typescript
import { deepClone } from '@/utils/helpers'

const obj = { a: 1, b: { c: 2 } }
const clone = deepClone(obj)
clone.b.c = 3
console.log(obj.b.c) // 2 (원본 객체는 변경되지 않음)
```

---

## Export 데이터 내보내기

`src/utils/export.ts` - Excel과 JSON 내보내기 기능을 제공합니다.

### Excel 내보내기

```typescript
import { exportExcel } from '@/utils/export'

const data = [
  { name: '张三', age: 25, email: 'zhangsan@example.com' },
  { name: '李四', age: 30, email: 'lisi@example.com' },
]

const columns = [
  { title: '이름', dataIndex: 'name' },
  { title: '나이', dataIndex: 'age' },
  { title: '이메일', dataIndex: 'email' },
]

exportExcel(data, columns, '사용자목록.xlsx')
```

### JSON 내보내기

```typescript
import { exportJson } from '@/utils/export'

exportJson(data, '데이터백업.json')
```

### 일괄 내보내기

```typescript
import { exportExcel } from '@/utils/export'

// 대용량 데이터 페이지별 내보내기
const exportAll = async () => {
  const allData = []
  
  // 모든 데이터를 순환적으로 가져오기
  for (let page = 1; page <= totalPages; page++) {
    const { list } = await fetchData({ page, pageSize: 100 })
    allData.push(...list)
  }
  
  exportExcel(allData, columns, '전체데이터.xlsx')
}
```

---

## 모범 사례

### 1. 유틸리티 함수 우선 사용

바퀴를 재발명하지 마세요. 프로젝트에 이미 있는 유틸리티 함수:

```typescript
// ✅ 유틸리티 함수 사용
import { formatDate } from '@/utils/helpers'
const date = formatDate(value)

// ❌ 직접 포맷 작성
const date = new Date(value).toLocaleDateString()
```

### 2. 타입 정의 추가

유틸리티 함수에 적절한 타입 추가:

```typescript
// helpers.ts
export function formatDate(date: string | Date | number): string
```

### 3. 단위 테스트

유틸리티 함수에는 단위 테스트를 작성해야 합니다:

```typescript
// tests/unit/helpers.spec.ts
describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate('2024-01-15')).toBe('2024-01-15')
  })
})
```

---

## 다음 단계

- [공통 컴포넌트](/guide/common-components)에서 재사용 가능한 UI 컴포넌트 학습
- [Composables](/guide/composables)에서 컴포저블 함수 확인
- [상태 관리](/guide/state-management)에서 Pinia 사용법 습득
