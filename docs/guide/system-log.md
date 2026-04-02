# 日志管理模块

## 概述

日志管理用于查看操作行为与系统事件，支撑审计、排障与安全分析。日志系统是安全合规和问题排查的重要工具，记录了系统中所有关键操作和异常事件。

- 路由：`/system/log`
- 页面：`src/views/system/log/index.vue`
- 权限：`system.log.view`
- API：`src/api/log.ts`

## 核心能力

### 1. 操作日志查询

记录用户的操作行为：

```typescript
interface OperationLog {
  id: string;
  module: string; // 操作模块（如 '用户管理'）
  action: string; // 操作类型（如 '新增用户'）
  method: string; // 请求方法
  url: string; // 请求 URL
  params?: string; // 请求参数
  result?: string; // 操作结果
  ip: string; // 操作 IP
  location?: string; // 地理位置
  browser?: string; // 浏览器信息
  os?: string; // 操作系统
  status: "success" | "fail"; // 操作状态
  duration: number; // 执行时长（毫秒）
  operator: string; // 操作人
  operatorId: string; // 操作人 ID
  createdAt: string;
}
```

### 2. 登录日志查询

记录用户登录行为：

```typescript
interface LoginLog {
  id: string;
  username: string; // 用户名
  loginType: "password" | "sso" | "oauth"; // 登录方式
  ip: string; // 登录 IP
  location?: string; // 地理位置
  browser?: string; // 浏览器
  os?: string; // 操作系统
  status: "success" | "fail"; // 登录状态
  message?: string; // 失败原因
  loginTime: string; // 登录时间
}
```

### 3. 条件筛选

```vue
<ProTable
  :columns="columns"
  :request="requestLogs"
  :search="{ labelWidth: 80 }"
>
  <!-- 搜索条件 -->
  <template #form="{ model }">
    <a-form-item label="操作人">
      <a-input v-model:value="model.operator" />
    </a-form-item>
    <a-form-item label="操作模块">
      <a-select v-model:value="model.module" :options="moduleOptions" />
    </a-form-item>
    <a-form-item label="操作状态">
      <a-select v-model:value="model.status" :options="statusOptions" />
    </a-form-item>
    <a-form-item label="操作时间">
      <a-range-picker v-model:value="model.dateRange" />
    </a-form-item>
  </template>
</ProTable>
```

### 4. 导出与归档

```typescript
// 导出日志
const exportLogs = async (params: LogQueryParams) => {
  const logs = await getAllLogs(params);

  // 转换为 CSV
  const headers = ["时间", "操作人", "模块", "操作", "IP", "状态"];
  const rows = logs.map((log) => [
    log.createdAt,
    log.operator,
    log.module,
    log.action,
    log.ip,
    log.status,
  ]);

  const csv = [headers, ...rows].join("\n");

  // 下载
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `logs-${Date.now()}.csv`;
  link.click();
};

// 归档旧日志
const archiveOldLogs = async () => {
  const threshold = dayjs().subtract(90, "day");
  await archiveLogsBefore(threshold.toISOString());
  message.success("日志归档完成");
};
```

## 日志记录实现

### 操作日志拦截器

```typescript
// utils/request.ts
axios.interceptors.response.use(
  (response) => {
    // 记录成功操作
    if (shouldLog(response.config)) {
      logOperation({
        module: getModule(response.config.url),
        action: getAction(response.config.method, response.config.url),
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        params: response.config.data,
        result: "success",
        status: "success",
      });
    }
    return response;
  },
  (error) => {
    // 记录失败操作
    if (shouldLog(error.config)) {
      logOperation({
        module: getModule(error.config.url),
        action: getAction(error.config.method, error.config.url),
        method: error.config.method?.toUpperCase(),
        url: error.config.url,
        params: error.config.data,
        result: error.message,
        status: "fail",
      });
    }
    return Promise.reject(error);
  },
);
```

### 登录日志记录

```typescript
// api/auth.ts
export const login = async (credentials: LoginParams) => {
  const startTime = Date.now();

  try {
    const result = await axios.post("/api/auth/login", credentials);

    // 记录登录成功
    await createLoginLog({
      username: credentials.username,
      loginType: "password",
      ip: getClientIP(),
      status: "success",
      duration: Date.now() - startTime,
    });

    return result.data;
  } catch (error) {
    // 记录登录失败
    await createLoginLog({
      username: credentials.username,
      loginType: "password",
      ip: getClientIP(),
      status: "fail",
      message: error.message,
    });

    throw error;
  }
};
```

## 最佳实践

### 1. 大数据量查询限制

```typescript
// 限制查询时间范围
const MAX_QUERY_DAYS = 30;

const validateDateRange = (startDate: string, endDate: string) => {
  const days = dayjs(endDate).diff(dayjs(startDate), "day");
  if (days > MAX_QUERY_DAYS) {
    message.warning(`查询时间范围不能超过 ${MAX_QUERY_DAYS} 天`);
    return false;
  }
  return true;
};

// 分页限制
const MAX_PAGE_SIZE = 500;

const getLogs = async (params: LogQueryParams) => {
  const pageSize = Math.min(params.pageSize || 20, MAX_PAGE_SIZE);

  return await fetchLogs({
    ...params,
    pageSize,
  });
};
```

### 2. 关键操作长保留

```typescript
// 不同类型日志的保留策略
const LOG_RETENTION_POLICY = {
  "login.success": 365, // 登录成功保留 1 年
  "login.fail": 90, // 登录失败保留 90 天
  "user.delete": 365, // 删除用户保留 1 年
  "role.update": 180, // 角色变更保留 180 天
  "config.change": 365, // 配置变更保留 1 年
  default: 90, // 默认保留 90 天
};

const getRetentionDays = (module: string, action: string): number => {
  const key = `${module}.${action}`;
  return LOG_RETENTION_POLICY[key] || LOG_RETENTION_POLICY.default;
};
```

### 3. 快速过滤

```typescript
// 常用过滤器
const QUICK_FILTERS = [
  { label: "登录失败", filter: { module: "登录", status: "fail" } },
  { label: "用户操作", filter: { module: "用户管理" } },
  {
    label: "今日操作",
    filter: { dateRange: [dayjs().startOf("day"), dayjs().endOf("day")] },
  },
  { label: "异常操作", filter: { status: "fail" } },
];

const applyQuickFilter = (filter: any) => {
  Object.assign(searchParams, filter);
  refreshTable();
};
```

### 4. 日志详情查看

```vue
<template>
  <a-modal v-model:open="detailModalOpen" title="操作详情" width="800px">
    <a-descriptions :column="2" bordered>
      <a-descriptions-item label="操作人">{{
        logDetail.operator
      }}</a-descriptions-item>
      <a-descriptions-item label="操作时间">{{
        logDetail.createdAt
      }}</a-descriptions-item>
      <a-descriptions-item label="操作模块">{{
        logDetail.module
      }}</a-descriptions-item>
      <a-descriptions-item label="操作类型">{{
        logDetail.action
      }}</a-descriptions-item>
      <a-descriptions-item label="请求方法">{{
        logDetail.method
      }}</a-descriptions-item>
      <a-descriptions-item label="请求URL">{{
        logDetail.url
      }}</a-descriptions-item>
      <a-descriptions-item label="IP地址">{{
        logDetail.ip
      }}</a-descriptions-item>
      <a-descriptions-item label="地理位置">{{
        logDetail.location
      }}</a-descriptions-item>
      <a-descriptions-item label="浏览器">{{
        logDetail.browser
      }}</a-descriptions-item>
      <a-descriptions-item label="操作系统">{{
        logDetail.os
      }}</a-descriptions-item>
      <a-descriptions-item label="执行时长"
        >{{ logDetail.duration }}ms</a-descriptions-item
      >
      <a-descriptions-item label="状态">
        <a-tag :color="logDetail.status === 'success' ? 'green' : 'red'">
          {{ logDetail.status === "success" ? "成功" : "失败" }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="请求参数" :span="2">
        <pre class="code-block">{{ formatJson(logDetail.params) }}</pre>
      </a-descriptions-item>
      <a-descriptions-item label="操作结果" :span="2">
        <pre class="code-block">{{ formatJson(logDetail.result) }}</pre>
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>
```

## 相关文档

- [FAQ 与故障排查](/guide/faq)
- [权限系统](/guide/permission)
- [示例与实战](/guide/examples)
