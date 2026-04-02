# 字典管理模块

## 概述

字典管理用于维护下拉选项、状态映射等静态数据，支持按类型分组。字典系统是后台管理中不可或缺的基础模块，可以统一管理系统中的枚举值，避免硬编码。

- 路由：`/system/dict`
- 页面：`src/views/system/dict/index.vue`
- 权限：`system.dict.view`
- API：`src/api/dict.ts`

## 核心能力

### 1. 字典类型管理

字典类型用于分组管理同类字典项：

```typescript
interface DictType {
  id: string;
  code: string; // 字典类型编码（如 'user_status'）
  name: string; // 字典类型名称（如 '用户状态'）
  description?: string;
  status: "active" | "inactive";
}
```

### 2. 字典项管理

```typescript
interface DictData {
  id: string;
  typeCode: string; // 所属字典类型
  label: string; // 显示文本
  value: string; // 实际值
  color?: string; // 标签颜色（用于 Tag）
  sort: number; // 排序
  status: "active" | "inactive";
  remark?: string;
}
```

### 3. 启用状态和排序维护

```vue
<template>
  <a-table :data-source="dictDataList">
    <a-table-column title="标签" dataIndex="label" />
    <a-table-column title="值" dataIndex="value" />
    <a-table-column title="颜色" dataIndex="color">
      <template #default="{ record }">
        <a-tag :color="record.color">{{ record.label }}</a-tag>
      </template>
    </a-table-column>
    <a-table-column title="排序" dataIndex="sort" />
    <a-table-column title="状态" dataIndex="status">
      <template #default="{ record }">
        <a-switch :checked="record.status === 'active'" />
      </template>
    </a-table-column>
  </a-table>
</template>
```

### 4. 前端缓存复用

使用 Pinia Store 管理字典缓存：

```typescript
// stores/dict.ts
export const useDictStore = defineStore("dict", () => {
  const dictMap = ref<Map<string, DictData[]>>(new Map());

  // 获取字典数据
  const getDictByType = async (typeCode: string) => {
    if (dictMap.value.has(typeCode)) {
      return dictMap.value.get(typeCode)!;
    }

    const data = await fetchDictByType(typeCode);
    dictMap.value.set(typeCode, data);
    return data;
  };

  // 获取标签
  const getDictLabel = (typeCode: string, value: string) => {
    const list = dictMap.value.get(typeCode) || [];
    return list.find((item) => item.value === value)?.label || value;
  };

  // 获取颜色
  const getDictColor = (typeCode: string, value: string) => {
    const list = dictMap.value.get(typeCode) || [];
    return list.find((item) => item.value === value)?.color;
  };

  return { getDictByType, getDictLabel, getDictColor };
});
```

## 使用示例

### 在 ProTable 中使用

```typescript
// 获取字典选项
const statusOptions = await dictStore.getDictByType("user_status");

const columns: ProTableColumn[] = [
  {
    title: "状态",
    dataIndex: "status",
    valueType: "tag",
    valueEnum: statusOptions.reduce((acc, item) => {
      acc[item.value] = { text: item.label, color: item.color };
      return acc;
    }, {}),
    search: true,
    searchType: "select",
    searchOptions: statusOptions.map((item) => ({
      label: item.label,
      value: item.value,
    })),
  },
];
```

### 在 ProForm 中使用

```typescript
const formItems: ProFormItem[] = [
  {
    type: "select",
    name: "status",
    label: "状态",
    options: statusOptions.map((item) => ({
      label: item.label,
      value: item.value,
    })),
  },
];
```

### 在模板中显示

```vue
<template>
  <a-tag :color="dictStore.getDictColor('user_status', record.status)">
    {{ dictStore.getDictLabel("user_status", record.status) }}
  </a-tag>
</template>
```

## 最佳实践

### 1. 字典 value 设计为稳定值

```typescript
// ✅ 好：使用稳定的英文标识
const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

// ❌ 避免：直接使用中文
const USER_STATUS = {
  ACTIVE: "启用",
  INACTIVE: "禁用",
};
```

### 2. 高频字典预加载

```typescript
// 在应用初始化时预加载常用字典
const preloadDicts = async () => {
  const commonDicts = ["user_status", "order_status", "gender", "yes_no"];

  await Promise.all(commonDicts.map((type) => dictStore.getDictByType(type)));
};

// main.ts
app.mount("#app");
preloadDicts();
```

### 3. 字典工具类

```typescript
// utils/dict.ts
export class DictUtil {
  private dictMap: Map<string, DictData[]>;

  constructor(dictMap: Map<string, DictData[]>) {
    this.dictMap = dictMap;
  }

  // 获取选项列表
  getOptions(typeCode: string) {
    return this.dictMap.get(typeCode) || [];
  }

  // 获取标签
  getLabel(typeCode: string, value: string | number) {
    const item = this.getOptions(typeCode).find(
      (d) => d.value === String(value),
    );
    return item?.label || String(value);
  }

  // 获取值
  getValue(typeCode: string, label: string) {
    const item = this.getOptions(typeCode).find((d) => d.label === label);
    return item?.value;
  }

  // 获取颜色
  getColor(typeCode: string, value: string) {
    const item = this.getOptions(typeCode).find((d) => d.value === value);
    return item?.color;
  }
}
```

### 4. 字典类型示例

```typescript
// 常用字典类型
const DICT_TYPES = {
  USER_STATUS: "user_status", // 用户状态
  GENDER: "gender", // 性别
  YES_NO: "yes_no", // 是否
  ORDER_STATUS: "order_status", // 订单状态
  PAYMENT_METHOD: "payment_method", // 支付方式
  PRIORITY: "priority", // 优先级
  LOG_TYPE: "log_type", // 日志类型
} as const;
```

## 相关文档

- [状态管理](/guide/state-management)
- [工具函数](/guide/utils)
- [ProTable 高级表格](/components/pro-table)
- [ProForm 高级表单](/components/pro-form)
