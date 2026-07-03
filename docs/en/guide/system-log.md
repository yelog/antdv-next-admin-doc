# Log Management Module

## Overview

Log management tracks operation and system events for auditing and troubleshooting.

- Route: `/system/log`
- View: `src/views/system/log/index.vue`
- Permission: `system.log.view`
- API: `src/api/log.ts`

## Core Capabilities

### 1. Tabbed Interface: Operation + Login Logs

Uses `a-tabs` containing two separate `ProTable` instances, each with its own search form and clear button:

```vue
<template>
  <a-tabs v-model:activeKey="activeTab">
    <a-tab-pane key="operation" :tab="t('log.operationLog')">
      <ProTable :columns="operationColumns" :request="loadOperationLogs"
        :search="{ formItems: operationSearchFormItems }" />
    </a-tab-pane>
    <a-tab-pane key="login" :tab="t('log.loginLog')">
      <ProTable :columns="loginColumns" :request="loadLoginLogs"
        :search="{ formItems: loginSearchFormItems }" />
    </a-tab-pane>
  </a-tabs>
</template>
```

### 2. Operation Log Search Form

```typescript
const operationSearchFormItems = computed<ProFormItem[]>(() => [
  { name: 'username', label: 'User', type: 'input' },
  { name: 'module', label: 'Module', type: 'select', options: [...] },
  { name: 'action', label: 'Action', type: 'select', options: [...] },
  { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Success', value: 'success' }, { label: 'Fail', value: 'fail' }] },
])
```

### 3. Operation Log Columns

```typescript
const operationColumns = computed<ProTableColumn[]>(() => [
  { title: 'User', dataIndex: 'username', width: 100 },
  { title: 'Module', dataIndex: 'module', width: 110 },
  { title: 'Action', dataIndex: 'action', width: 90 },
  { title: 'Description', dataIndex: 'description', ellipsis: true },
  { title: 'Method', dataIndex: 'method', width: 90 },
  { title: 'IP', dataIndex: 'ip', width: 130 },
  { title: 'Status', dataIndex: 'status', width: 80 },
  { title: 'Duration', dataIndex: 'duration', width: 80 },
  { title: 'Time', dataIndex: 'createTime', width: 170 },
])
```

### 4. Login Log Search Form

```typescript
const loginSearchFormItems = computed<ProFormItem[]>(() => [
  { name: 'username', label: 'Username', type: 'input' },
  { name: 'ip', label: 'IP', type: 'input' },
  { name: 'status', label: 'Status', type: 'select', options: [...] },
])
```

### 5. Login Log Columns

```typescript
const loginColumns = computed<ProTableColumn[]>(() => [
  { title: 'Username', dataIndex: 'username', width: 120 },
  { title: 'IP', dataIndex: 'ip', width: 140 },
  { title: 'Browser', dataIndex: 'browser', width: 130 },
  { title: 'OS', dataIndex: 'os', width: 130 },
  { title: 'Status', dataIndex: 'status', width: 80 },
  { title: 'Message', dataIndex: 'message', ellipsis: true },
  { title: 'Login Time', dataIndex: 'createTime', width: 170 },
])
```

## Data Structures

```typescript
interface OperationLog {
  id: string;
  username: string;
  module: string;
  action: string;
  description: string;
  method: string;
  ip: string;
  status: 'success' | 'fail';
  duration: number;   // ms
  createTime: string;
}

interface LoginLog {
  id: string;
  username: string;
  ip: string;
  browser: string;
  os: string;
  status: 'success' | 'fail';
  message?: string;
  createTime: string;
}
```

## Custom Rendering

- **Action**: color-coded tags via `actionColorMap`
- **Status**: `ProStatus` component with green (success) / red (fail)
- **Duration**: color-coded: red (&gt;300ms), yellow (&gt;100ms), green (&lt;100ms)

## Related Docs

- [FAQ](/en/guide/faq)
- [ProTable](/en/components/pro-table)