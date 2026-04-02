# 高级表格脚手架（ProTable Advanced）

## 场景

该示例展示 ProTable 在真实业务中的组合能力：查询、批量操作、导出、状态切换。适用于用户管理、订单管理、数据审计等需要复杂列表交互的场景。

- 路由：`/examples/pro-table-advanced`
- 页面：`src/views/examples/scaffold/pro-table-advanced/index.vue`

## 核心能力

### 1. 列配置 + 值类型渲染

```typescript
const columns: ProTableColumn[] = [
  {
    title: "用户名",
    dataIndex: "username",
    search: true, // 启用搜索
    searchType: "input", // 搜索框类型
    width: 150,
  },
  {
    title: "性别",
    dataIndex: "gender",
    valueType: "tag", // 标签渲染
    valueEnum: {
      // 枚举映射
      male: { text: "男", color: "blue" },
      female: { text: "女", color: "pink" },
    },
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    valueType: "dateTime", // 日期时间渲染
  },
];
```

### 2. 查询表单与分页联动

- 搜索条件自动同步到表格请求参数
- 分页切换保持搜索条件
- 支持折叠式搜索表单（`collapsedRows`）

### 3. 批量操作

```vue
<template #toolbar-actions>
  <a-tag color="processing">已选 {{ selectedRowKeys.length }} 项</a-tag>
  <a-button
    :disabled="selectedRowKeys.length === 0"
    @click="handleBatchDisable"
  >
    批量禁用
  </a-button>
  <a-button
    danger
    :disabled="selectedRowKeys.length === 0"
    @click="handleBatchDelete"
  >
    批量删除
  </a-button>
</template>
```

### 4. 工具栏导出与列设置

- 刷新按钮
- 密度切换（大/中/小）
- 列显隐设置
- 自定义导出功能

## 关键代码解析

### 行选择配置

```typescript
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Array<string | number>) => {
    selectedRowKeys.value = keys.map((item) => String(item));
  },
}));
```

### 数据请求函数

```typescript
const requestTableData = async (params: Record<string, unknown>) => {
  const current = Number(params.current || 1);
  const pageSize = Number(params.pageSize || 10);

  // 筛选逻辑
  let filtered = [...tableRows.value];
  if (params.username) {
    filtered = filtered.filter((item) =>
      item.username
        .toLowerCase()
        .includes(String(params.username).toLowerCase()),
    );
  }

  // 分页
  const start = (current - 1) * pageSize;
  const list = filtered.slice(start, start + pageSize);

  return {
    success: true,
    data: list,
    total: filtered.length,
  };
};
```

### 状态切换

```typescript
const handleStatusSwitchChange = (id: string, checked: boolean) => {
  const row = tableRows.value.find((item) => item.id === id);
  if (row) {
    row.status = checked ? "active" : "inactive";
    message.success(`状态已更新为 ${checked ? "启用" : "禁用"}`);
  }
};
```

### CSV 导出

```typescript
const exportCsv = () => {
  const headers = [
    "id",
    "username",
    "realName",
    "email",
    "gender",
    "status",
    "createdAt",
  ];
  const rows = tableRows.value.map((item) => [
    item.id,
    item.username,
    item.realName,
    item.email,
    item.gender,
    item.status,
    item.createdAt,
  ]);

  const csv = [headers, ...rows]
    .map((line) =>
      line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `export-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
```

## 推荐复用方式

### 1. 列定义抽离

```typescript
// columns/user.ts
export const getUserColumns = (): ProTableColumn[] => [
  { title: "用户名", dataIndex: "username", search: true },
  { title: "状态", dataIndex: "status", valueType: "tag" },
  // ...
];
```

### 2. 批量操作封装

```typescript
// composables/useBatchOperation.ts
export function useBatchOperation(selectedKeys: Ref<string[]>) {
  const batchDelete = (deleteFn: (ids: string[]) => Promise<void>) => {
    if (selectedKeys.value.length === 0) return;
    Modal.confirm({
      title: "确认删除",
      content: `将删除 ${selectedKeys.value.length} 条记录`,
      onOk: () => deleteFn(selectedKeys.value),
    });
  };
  return { batchDelete };
}
```

### 3. 导出逻辑与筛选条件联动

确保导出的数据与当前表格显示的数据一致，应用相同的筛选条件。

## 落地建议

1. **列定义集中管理**：将列配置抽离为独立模块，便于多页面复用
2. **批量操作确认**：统一封装确认框和提示逻辑，防止误操作
3. **导出条件同步**：导出逻辑与当前筛选条件保持一致
4. **响应式处理**：使用 `computed` 包装配置，支持国际化动态切换

## 相关文档

- [ProTable 高级表格](/components/pro-table)
- [示例与实战](/guide/examples)
- [状态管理](/guide/state-management)
