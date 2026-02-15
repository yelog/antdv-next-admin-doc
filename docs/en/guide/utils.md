# Utils

This document introduces the utility functions provided in the Antdv Next Admin project to help developers improve development efficiency.

## Table of Contents

- [Storage](#storage)
- [Auth](#auth)
- [Form Rules](#form-rules)
- [Helpers](#helpers)
- [Export](#export)

---

## Storage

`src/utils/storage.ts` - Wraps localStorage and sessionStorage with expiration time support.

### Basic Usage

```typescript
import storage from '@/utils/storage'

// localStorage (persistent)
storage.set('user', { name: 'John', id: 1 })
const user = storage.get('user')
storage.remove('user')
storage.clear()

// sessionStorage (session only)
storage.session.set('temp', 'temporary data')
const temp = storage.session.get('temp')
```

### Setting Expiration

```typescript
// Data expires in 1 hour
storage.set('token', 'xxx', { expires: 3600 })

// Returns null after expiration
const token = storage.get('token') // null
```

---

## Auth

`src/utils/auth.ts` - Handles token storage and retrieval.

```typescript
import { getToken, setToken, removeToken } from '@/utils/auth'

// Get token
const token = getToken()

// Set token
setToken('Bearer xxx')

// Remove token
removeToken()
```

---

## Form Rules

`src/utils/formRules.ts` - Provides common form validation rules.

```typescript
import { formRules } from '@/utils/formRules'

const rules = {
  name: formRules.required('Please enter name'),
  email: formRules.email,
  phone: formRules.phone,
}
```

---

## Helpers

`src/utils/helpers.ts` - Collection of general helper functions.

### Date and Time

```typescript
import { formatDate, formatDateTime } from '@/utils/helpers'

formatDate('2024-01-15')                    // 2024-01-15
formatDateTime('2024-01-15T08:30:00')       // 2024-01-15 08:30:00
```

### File Handling

```typescript
import { formatFileSize, downloadFile } from '@/utils/helpers'

formatFileSize(1024)        // 1 KB
formatFileSize(1048576)     // 1 MB
```

---

## Export

`src/utils/export.ts` - Provides Excel and JSON export functionality.

### Export Excel

```typescript
import { exportExcel } from '@/utils/export'

const data = [
  { name: 'John', age: 25, email: 'john@example.com' },
  { name: 'Jane', age: 30, email: 'jane@example.com' },
]

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Email', dataIndex: 'email' },
]

exportExcel(data, columns, 'users.xlsx')
```

---

## Best Practices

1. **Use utility functions first** - Don't reinvent the wheel
2. **Add type definitions** - Ensure proper TypeScript support
3. **Write unit tests** - Utility functions should have tests

---

## Next Steps

- Learn about [Common Components](/en/guide/common-components)
- View [Composables](/en/guide/composables)
- Read [State Management](/en/guide/state-management)
