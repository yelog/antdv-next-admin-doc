# Dictionary Management Module

## Overview

Dictionary management maintains static options and status mappings grouped by dictionary types.

- Route: `/system/dict`
- View: `src/views/system/dict/index.vue`
- Permission: `system.dict.view`
- API: `src/api/dict.ts`

## Core Capabilities

### 1. Split Layout: Type List + Data Table

Uses `ProSplitLayout` with dictionary types on the left and `ProTable` for data entries on the right:

```vue
<template>
  <ProSplitLayout :side-width="260">
    <template #side>
      <!-- Dict type list with inline edit/delete -->
      <div v-for="type in dictTypes" :key="type.id"
        :class="['dict-type-item', { active: selectedTypeCode === type.code }]"
        @click="handleSelectType(type)">
        {{ type.name }} ({{ type.code }})
      </div>
    </template>
    <template #main>
      <ProTable :key="selectedTypeCode" :columns="columns" :request="loadData" :search="false" />
    </template>
  </ProSplitLayout>
</template>
```

### 2. Data Structures

```typescript
interface DictType {
  id: string;
  name: string;
  code: string;      // e.g., 'user_status'
  description?: string;
  status: 'enabled' | 'disabled';
}

interface DictData {
  id: string;
  typeCode: string;
  label: string;      // display text
  value: string;      // actual value
  sort: number;
  status: 'enabled' | 'disabled';
  remark?: string;
}
```

### 3. Cache Store

CRUD operations call `dictStore.refreshDictData()` to update the global cache:

```typescript
import { useDictStore } from '@/stores/dict'
const dictStore = useDictStore()

await createDictData(data)
dictStore.refreshDictData()
```

## Notes

1. **Status values**: use `enabled`/`disabled` (not `active`/`inactive`)
2. **Cache refresh**: always call `dictStore.refreshDictData()` after mutations
3. **Auto-select first type**: on mount, the first type is automatically selected

## Related Docs

- [ProSplitLayout](/en/components/pro-split-layout)
- [ProTable](/en/components/pro-table)
- [ProForm](/en/components/pro-form)