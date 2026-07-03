# 日志管理模块

## 概述

日志管理用于查看操作行为与系统事件，支撑审计、排障与安全分析。日志系统是安全合规和问题排查的重要工具，记录了系统中所有关键操作和异常事件。

- 路由：`/system/log`
- 页面：`src/views/system/log/index.vue`
- 权限：`system.log.view`
- API：`src/api/log.ts`

## 核心能力

### 1. 操作日志与登录日志（Tab 切换）

使用 `a-tabs` 包裹两个独立的 `ProTable` 实例，分别展示操作日志和登录日志：

```vue
<template>
  <a-tabs v-model:activeKey="activeTab">
    <a-tab-pane key="operation" :tab="t('log.operationLog')">
      <ProTable
        ref="operationTableRef"
        :key="'operation-' + operationRefreshKey"
        :columns="operationColumns"
        :request="loadOperationLogs"
        :toolbar="{ title: t('log.operationLog') }"
        :search="{ formItems: operationSearchFormItems }"
      >
        <template #toolbar-actions>
          <a-button danger @click="handleClearOperationLog">
            <DeleteOutlined /> {{ t('log.clearLog') }}
          </a-button>
        </template>
      </ProTable>
    </a-tab-pane>

    <a-tab-pane key="login" :tab="t('log.loginLog')">
      <ProTable
        ref="loginTableRef"
        :key="'login-' + loginRefreshKey"
        :columns="loginColumns"
        :request="loadLoginLogs"
        :toolbar="{ title: t('log.loginLog') }"
        :search="{ formItems: loginSearchFormItems }"
      >
        <template #toolbar-actions">
          <a-button danger @click="handleClearLoginLog">
            <DeleteOutlined /> {{ t('log.clearLog') }}
          </a-button>
        </template>
      </ProTable>
    </a-tab-pane>
  </a-tabs>
</template>
```

### 2. 操作日志搜索表单

```typescript
const operationSearchFormItems = computed<ProFormItem[]>(() => [
  { name: 'username', label: '操作人', type: 'input' },
  {
    name: 'module',
    label: '操作模块',
    type: 'select',
    options: [
      { label: '用户管理', value: 'userManagement' },
      { label: '角色管理', value: 'roleManagement' },
      { label: '菜单管理', value: 'menuManagement' },
      { label: '字典管理', value: 'dictionary' },
      { label: '系统登录', value: 'systemLogin' },
      { label: '个人中心', value: 'profile' },
      { label: '仪表盘', value: 'dashboard' },
    ],
  },
  {
    name: 'action',
    label: '操作类型',
    type: 'select',
    options: [
      { label: '登录', value: 'login' },
      { label: '登出', value: 'logout' },
      { label: '新增', value: 'create' },
      { label: '修改', value: 'update' },
      { label: '删除', value: 'delete' },
      { label: '导出', value: 'export' },
    ],
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '成功', value: 'success' },
      { label: '失败', value: 'fail' },
    ],
  },
])
```

### 3. 操作日志列配置

```typescript
const operationColumns = computed<ProTableColumn[]>(() => [
  { title: '操作人', dataIndex: 'username', key: 'username', width: 100 },
  { title: '模块', dataIndex: 'module', key: 'module', width: 110 },
  { title: '操作类型', dataIndex: 'action', key: 'action', width: 90 },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '请求方法', dataIndex: 'method', key: 'method', width: 90 },
  { title: 'IP 地址', dataIndex: 'ip', key: 'ip', width: 130 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '耗时', dataIndex: 'duration', key: 'duration', width: 80 },
  { title: '操作时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
])
```

### 4. 登录日志搜索表单

```typescript
const loginSearchFormItems = computed<ProFormItem[]>(() => [
  { name: 'username', label: '用户名', type: 'input' },
  { name: 'ip', label: 'IP 地址', type: 'input' },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '成功', value: 'success' },
      { label: '失败', value: 'fail' },
    ],
  },
])
```

### 5. 登录日志列配置

```typescript
const loginColumns = computed<ProTableColumn[]>(() => [
  { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
  { title: 'IP 地址', dataIndex: 'ip', key: 'ip', width: 140 },
  { title: '浏览器', dataIndex: 'browser', key: 'browser', width: 130 },
  { title: '操作系统', dataIndex: 'os', key: 'os', width: 130 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '消息', dataIndex: 'message', key: 'message', ellipsis: true },
  { title: '登录时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
])
```

### 6. 自定义渲染

操作日志的 `action` 列使用颜色标签，`status` 列使用 `ProStatus` 组件，`duration` 列根据耗时着色：

```typescript
// 操作类型颜色映射
const actionColorMap: Record<string, string> = {
  login: 'blue',
  logout: 'default',
  create: 'green',
  update: 'orange',
  delete: 'red',
  export: 'purple',
}

// 状态映射
const logStatusMap = {
  success: { text: '成功', color: '#52c41a' },
  fail: { text: '失败', color: '#ff4d4f' },
}

// 耗时着色
const durationStyle = (duration: number) => ({
  color: duration > 300 ? '#ff4d4f' : duration > 100 ? '#faad14' : '#52c41a',
})
```

### 7. 清空日志

```typescript
const handleClearOperationLog = () => {
  Modal.confirm({
    title: '确认清空',
    content: '确定要清空所有操作日志吗？',
    onOk: async () => {
      await clearOperationLog()
      operationRefreshKey.value++ // 重新挂载 ProTable
    },
  })
}
```

## 数据结构

```typescript
interface OperationLog {
  id: string;
  username: string; // 操作人
  module: string; // 操作模块
  action: string; // 操作类型
  description: string; // 操作描述
  method: string; // 请求方法（GET, POST 等）
  ip: string; // 操作 IP
  status: 'success' | 'fail'; // 操作状态
  duration: number; // 执行时长（毫秒）
  createTime: string; // 操作时间
}

interface LoginLog {
  id: string;
  username: string; // 用户名
  ip: string; // 登录 IP
  browser: string; // 浏览器
  os: string; // 操作系统
  status: 'success' | 'fail'; // 登录状态
  message?: string; // 失败原因
  createTime: string; // 登录时间
}
```

## 数据请求

```typescript
const loadOperationLogs = async (params: Record<string, unknown>) => {
  const response = await getOperationLogList({
    username: params.username as string,
    module: params.module as string,
    action: params.action as string,
    status: params.status as string,
    page: params.current as number,
    pageSize: params.pageSize as number,
  })
  return { data: response.data.list, total: response.data.total, success: true }
}
```

## 相关文档

- [FAQ 与故障排查](/guide/faq)
- [权限系统](/guide/permission)
- [ProTable 高级表格](/components/pro-table)