# 字典管理模块

## 概述

字典管理用于维护下拉选项、状态映射等静态数据，支持按类型分组。字典系统是后台管理中不可或缺的基础模块，可以统一管理系统中的枚举值，避免硬编码。

- 路由：`/system/dict`
- 页面：`src/views/system/dict/index.vue`
- 权限：`system.dict.view`
- API：`src/api/dict.ts`

## 核心能力

### 1. 字典类型列表（左侧）

使用 `ProSplitLayout` 实现字典类型列表（左侧） + 字典数据管理（右侧）的布局：

```vue
<template>
  <ProSplitLayout :side-width="260">
    <template #side>
      <div class="dict-types-header">
        <h3>{{ t('dict.dictType') }}</h3>
        <a-button type="primary" size="small" @click="handleAddType">
          <PlusOutlined /> {{ t('common.add') }}
        </a-button>
      </div>
      <div class="dict-types-list">
        <div
          v-for="type in dictTypes"
          :key="type.id"
          class="dict-type-item"
          :class="{ active: selectedTypeCode === type.code }"
          @click="handleSelectType(type)"
        >
          <div class="type-info">
            <div class="type-name">{{ type.name }}</div>
            <div class="type-code">{{ type.code }}</div>
          </div>
          <div class="type-actions" @click.stop>
            <a-button type="text" size="small" @click="handleEditType(type)">
              <EditOutlined />
            </a-button>
            <a-button type="text" size="small" danger @click="handleDeleteType(type)">
              <DeleteOutlined />
            </a-button>
          </div>
        </div>
      </div>
    </template>

    <template #main>
      <ProTable
        v-if="selectedTypeCode"
        :key="selectedTypeCode"
        :columns="columns"
        :request="loadData"
        :search="false"
        :toolbar="{ title: selectedTypeName + ' - 字典数据' }"
      >
        <template #toolbar-actions>
          <a-button type="primary" @click="handleAdd">
            <PlusOutlined /> 新增数据
          </a-button>
        </template>
      </ProTable>
      <a-empty v-else description="请选择字典类型" />
    </template>
  </ProSplitLayout>
</template>
```

### 2. 字典数据列表列配置

```typescript
const columns: ProTableColumn[] = [
  { title: '标签', dataIndex: 'label', key: 'label' },
  { title: '值', dataIndex: 'value', key: 'value' },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
  { title: '操作', dataIndex: 'action', key: 'action', width: 150, fixed: 'right' },
]
```

### 3. 字典类型 CRUD

使用单独的 `a-modal` + `a-form` 管理字典类型：

```typescript
interface DictType {
  id: string;
  name: string; // 字典类型名称（如 '用户状态'）
  code: string; // 字典类型编码（如 'user_status'）
  description?: string;
  status: 'enabled' | 'disabled';
}
```

### 4. 字典数据 CRUD

```typescript
interface DictData {
  id: string;
  typeCode: string; // 所属字典类型
  label: string; // 显示文本
  value: string; // 实际值
  sort: number; // 排序
  status: 'enabled' | 'disabled'; // 状态
  remark?: string;
}
```

### 5. 使用 dictStore 刷新缓存

```typescript
import { useDictStore } from '@/stores/dict'
const dictStore = useDictStore()

// 数据变更后刷新缓存
const handleDataSubmit = async () => {
  if (dataForm.value.id) {
    await updateDictData(dataForm.value.id, dataForm.value)
  } else {
    await createDictData(dataForm.value)
  }
  dictStore.refreshDictData() // 刷新全局字典缓存
}
```

## 在 ProTable 中使用字典

### 通过 options 使用字典数据

```typescript
const statusOptions = [
  { label: '启用', value: 'enabled', color: '#52c41a' },
  { label: '禁用', value: 'disabled', color: '#bfbfbf' },
]

const columns: ProTableColumn[] = [
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'tag',
    options: statusOptions, // 自动派生 valueEnum
  },
]
```

### 在 ProForm 中使用字典

```typescript
const formItems: ProFormItem[] = [
  {
    type: 'select',
    name: 'status',
    label: '状态',
    options: [
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' },
    ],
  },
]
```

## 注意事项

### 1. 状态值

字典模块使用 `enabled` / `disabled` 作为状态值（不同于用户模块的 `active` / `inactive`）。

### 2. 数据操作后刷新

CRUD 操作后应调用 `dictStore.refreshDictData()` 以确保全局字典缓存更新。

### 3. 自动选中第一个类型

```typescript
if (dictTypes.value.length > 0 && !selectedTypeCode.value) {
  selectedTypeCode.value = dictTypes.value[0].code
}
```

## 相关文档

- [ProSplitLayout 分栏布局](/components/pro-split-layout)
- [ProTable 高级表格](/components/pro-table)
- [ProForm 高级表单](/components/pro-form)