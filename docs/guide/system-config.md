# 系统配置模块

## 概述

系统配置用于维护站点级参数（开关、阈值、默认策略），支持按分组管理。配置中心可以动态调整系统行为，无需修改代码即可改变业务逻辑。

- 路由：`/system/config`
- 页面：`src/views/system/config/index.vue`
- 权限：`system.config.view`
- API：`src/api/config.ts`

## 核心能力

### 1. 配置分组展示（左侧菜单）

使用 `ProSplitLayout` 实现配置分组菜单（左侧） + 配置项列表（右侧）的布局：

```vue
<template>
  <ProSplitLayout :side-width="200">
    <template #side>
      <h3>{{ $t('config.configGroups') }}</h3>
      <a-menu
        v-model:selectedKeys="selectedMenuKeys"
        mode="inline"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </template>

    <template #main>
      <ProTable
        :key="selectedGroup + refreshKey"
        :columns="columns"
        :request="loadConfigList"
        :search="false"
        :toolbar="{ title: $t(`config.groups.${selectedGroup}`) }"
      >
        <template #toolbar-actions>
          <a-button type="primary" @click="handleAdd">
            <PlusOutlined /> 新增配置
          </a-button>
        </template>
      </ProTable>
    </template>
  </ProSplitLayout>
</template>
```

### 2. 预定义配置分组

```typescript
const groups = ['basic', 'security', 'upload', 'notification']

const groupOptions = [
  { label: '基础配置', value: 'basic' },
  { label: '安全配置', value: 'security' },
  { label: '上传配置', value: 'upload' },
  { label: '通知配置', value: 'notification' },
]
```

### 3. 配置项列配置

```typescript
const columns: ProTableColumn[] = [
  { title: '配置名称', dataIndex: 'name', key: 'name', width: 160 },
  { title: '配置键', dataIndex: 'key', key: 'key', width: 200 },
  { title: '配置值', dataIndex: 'value', key: 'value', ellipsis: true },
  { title: '值类型', dataIndex: 'valueType', key: 'valueType', width: 90 },
  { title: '是否内置', dataIndex: 'builtIn', key: 'builtIn', width: 90 },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '操作', dataIndex: 'action', key: 'action', width: 150, fixed: 'right' },
]
```

### 4. 新增/编辑配置

根据 `valueType` 使用不同的表单控件：

```vue
<a-modal v-model:open="modalVisible" :title="modalTitle" width="520">
  <a-form :model="form" :label-col="{ span: 6 }">
    <a-form-item label="配置名称" required>
      <a-input v-model:value="form.name" />
    </a-form-item>
    <a-form-item label="配置键" required>
      <a-input v-model:value="form.key" :disabled="!!form.id" />
    </a-form-item>
    <a-form-item label="配置值" required>
      <a-switch v-if="form.valueType === 'boolean'" v-model:checked="boolValue" />
      <a-input-number v-else-if="form.valueType === 'number'" v-model:value="form.value" />
      <a-textarea v-else-if="form.valueType === 'json'" v-model:value="form.value" :rows="4" />
      <a-input v-else v-model:value="form.value" />
    </a-form-item>
    <a-form-item label="值类型">
      <a-select v-model:value="form.valueType" :disabled="!!form.id"
        :options="valueTypeOptions" />
    </a-form-item>
    <a-form-item label="分组">
      <a-select v-model:value="form.group" allow-clear :options="groupOptions" />
    </a-form-item>
    <a-form-item label="排序">
      <a-input-number v-model:value="form.sort" :min="0" />
    </a-form-item>
    <a-form-item label="描述">
      <a-textarea v-model:value="form.description" :rows="2" />
    </a-form-item>
  </a-form>
</a-modal>
```

### 5. 分组计数

```typescript
// 加载所有配置用于计算分组计数
const loadAllConfigs = async () => {
  const response = await getConfigList({ page: 1, pageSize: 100 })
  allConfigs.value = response.data.list
}

const getGroupCount = (group: string) =>
  allConfigs.value.filter((c) => c.group === group).length
```

## 数据结构

```typescript
interface SysConfig {
  id: string;
  name: string; // 配置名称
  key: string; // 配置键（唯一）
  value: string; // 配置值（统一存储为字符串）
  valueType: 'string' | 'number' | 'boolean' | 'json'; // 值类型
  group: string; // 所属分组
  builtIn: boolean; // 是否内置（内置不可删除）
  sort: number; // 排序
  description?: string; // 描述
}
```

## 数据请求

```typescript
const loadConfigList = async (params: Record<string, unknown>) => {
  const response = await getConfigList({
    group: selectedGroup.value,
    page: params.current as number,
    pageSize: params.pageSize as number,
  })
  return { data: response.data.list, total: response.data.total, success: true }
}
```

## 注意事项

### 1. 值类型

配置值统一存储为字符串，根据 `valueType` 决定表单控件：

| valueType | 控件 | 存储格式 |
|-----------|------|---------|
| `string` | `a-input` | 原始字符串 |
| `number` | `a-input-number` | 数字字符串 |
| `boolean` | `a-switch` | `'true'` / `'false'` |
| `json` | `a-textarea` | JSON 字符串 |

### 2. 内置配置保护

`builtIn` 为 `true` 的配置项不可删除，编辑时 `key` 和 `valueType` 不可修改。

### 3. 刷新机制

CRUD 操作后通过 `refreshKey` 递增强制 ProTable 重新挂载：

```typescript
const refreshKey = ref(0)
// CRUD 操作后：
refreshKey.value++
```

## 相关文档

- [部署指南](/guide/deployment)
- [API 集成](/guide/api-integration)