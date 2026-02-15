# 工具函数

本文档介绍 Antdv Next Admin 项目中提供的常用工具函数，帮助开发者提高开发效率。

## 目录

- [Storage 存储工具](#storage-存储工具)
- [Auth 认证工具](#auth-认证工具)
- [Form Rules 表单验证](#form-rules-表单验证)
- [Helpers 辅助函数](#helpers-辅助函数)
- [Export 数据导出](#export-数据导出)

---

## Storage 存储工具

`src/utils/storage.ts` - 封装 localStorage 和 sessionStorage，支持过期时间设置。

### 基础使用

```typescript
import storage from '@/utils/storage'

// localStorage（永久存储）
storage.set('user', { name: '张三', id: 1 })
const user = storage.get('user')
storage.remove('user')
storage.clear()

// sessionStorage（会话存储）
storage.session.set('temp', '临时数据')
const temp = storage.session.get('temp')
```

### 设置过期时间

```typescript
// 数据在 1 小时后过期
storage.set('token', 'xxx', { expires: 3600 })

// 过期后获取返回 null
const token = storage.get('token') // null
```

### TypeScript 支持

```typescript
interface User {
  name: string
  id: number
}

// 带类型的获取
const user = storage.get<User>('user')
console.log(user?.name)
```

---

## Auth 认证工具

`src/utils/auth.ts` - 处理 Token 的存储和获取。

### API

```typescript
import { getToken, setToken, removeToken } from '@/utils/auth'

// 获取 Token
const token = getToken()

// 设置 Token
setToken('Bearer xxx')

// 移除 Token
removeToken()
```

---

## Form Rules 表单验证

`src/utils/formRules.ts` - 提供常用的表单验证规则。

### 常用规则

```typescript
import { formRules } from '@/utils/formRules'

const rules = {
  // 必填
  name: formRules.required('请输入名称'),
  
  // 邮箱
  email: formRules.email,
  
  // 手机号
  phone: formRules.phone,
  
  // 身份证号
  idCard: formRules.idCard,
  
  // 自定义正则
  code: formRules.pattern(/^[A-Z]{2}\d{4}$/, '格式：2位大写字母+4位数字'),
}
```

### 组合规则

```typescript
const rules = {
  password: [
    formRules.required('请输入密码'),
    { min: 6, message: '密码至少6位' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '需包含大小写字母和数字' },
  ],
  confirmPassword: [
    formRules.required('请确认密码'),
    { validator: validateConfirmPassword },
  ],
}
```

### 自定义验证

```typescript
const validateConfirmPassword = (rule: any, value: string) => {
  if (value !== formState.password) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}
```

---

## Helpers 辅助函数

`src/utils/helpers.ts` - 通用辅助函数集合。

### 日期时间

```typescript
import { formatDate, formatDateTime, formatTime, getRelativeTime } from '@/utils/helpers'

formatDate('2024-01-15')                    // 2024-01-15
formatDateTime('2024-01-15T08:30:00')       // 2024-01-15 08:30:00
formatTime(new Date())                       // 08:30:00
getRelativeTime(Date.now() - 3600000)       // 1小时前
```

### 文件处理

```typescript
import { formatFileSize, downloadFile } from '@/utils/helpers'

formatFileSize(1024)        // 1 KB
formatFileSize(1024000)     // 1000 KB
formatFileSize(1048576)     // 1 MB

downloadFile(blob, '文件名.pdf')
```

### URL 参数

```typescript
import { getQueryParam, setQueryParam } from '@/utils/helpers'

// URL: /list?page=1&size=10
getQueryParam('page')       // '1'
getQueryParam('size')       // '10'

setQueryParam({ keyword: 'test' })
// URL: /list?page=1&size=10&keyword=test
```

### 树形数据处理

```typescript
import { treeToList, listToTree, findTreeNode } from '@/utils/helpers'

// 列表转树
const tree = listToTree(list, { id: 'id', parentId: 'parentId' })

// 树转列表
const list = treeToList(tree)

// 查找节点
const node = findTreeNode(tree, (node) => node.id === '123')
```

### 深克隆

```typescript
import { deepClone } from '@/utils/helpers'

const obj = { a: 1, b: { c: 2 } }
const clone = deepClone(obj)
clone.b.c = 3
console.log(obj.b.c) // 2（原对象不变）
```

---

## Export 数据导出

`src/utils/export.ts` - 提供 Excel 和 JSON 导出功能。

### 导出 Excel

```typescript
import { exportExcel } from '@/utils/export'

const data = [
  { name: '张三', age: 25, email: 'zhangsan@example.com' },
  { name: '李四', age: 30, email: 'lisi@example.com' },
]

const columns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
  { title: '邮箱', dataIndex: 'email' },
]

exportExcel(data, columns, '用户列表.xlsx')
```

### 导出 JSON

```typescript
import { exportJson } from '@/utils/export'

exportJson(data, '数据备份.json')
```

### 批量导出

```typescript
import { exportExcel } from '@/utils/export'

// 大数据量分页导出
const exportAll = async () => {
  const allData = []
  
  // 循环获取所有数据
  for (let page = 1; page <= totalPages; page++) {
    const { list } = await fetchData({ page, pageSize: 100 })
    allData.push(...list)
  }
  
  exportExcel(allData, columns, '完整数据.xlsx')
}
```

---

## 最佳实践

### 1. 优先使用工具函数

不要重复造轮子，项目中已有的工具函数：

```typescript
// ✅ 使用工具函数
import { formatDate } from '@/utils/helpers'
const date = formatDate(value)

// ❌ 自己写格式化
const date = new Date(value).toLocaleDateString()
```

### 2. 添加类型定义

为工具函数添加适当的类型：

```typescript
// helpers.ts
export function formatDate(date: string | Date | number): string
```

### 3. 单元测试

工具函数应该编写单元测试：

```typescript
// tests/unit/helpers.spec.ts
describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate('2024-01-15')).toBe('2024-01-15')
  })
})
```

---

## 下一步

- 了解 [通用组件](/guide/common-components) 学习可复用的 UI 组件
- 查看 [Composables](/guide/composables) 了解组合式函数
- 阅读 [状态管理](/guide/state-management) 掌握 Pinia 使用
