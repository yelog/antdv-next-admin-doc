# 权限管理模块

## 概述

权限管理用于维护权限点（如 `system.user.create`），供路由鉴权与按钮鉴权统一使用。权限点是 RBAC 体系中最细粒度的控制单元，决定了用户可以执行哪些具体操作。

- 路由：`/organization/permission`
- 页面：`src/views/system/permission/index.vue`
- 权限：`system.permission.view`
- API：`src/api/permission.ts`

## 权限点设计规范

### 命名规范

采用 `domain.resource.action` 三段式命名：

```typescript
const PERMISSION_EXAMPLES = {
  'system.user.view': '查看用户',
  'system.user.create': '新增用户',
  'system.user.edit': '编辑用户',
  'system.user.delete': '删除用户',
  'system.role.view': '查看角色',
  'system.role.create': '新增角色',
  'system.role.edit': '编辑角色',
  'system.role.delete': '删除角色',
}
```

### 使用场景

```typescript
// 1. 路由级权限
{ path: '/system/user', meta: { requiredPermissions: ['system.user.view'] } }

// 2. 按钮级权限 - 指令方式
<a-button v-permission="'system.user.create'">新增用户</a-button>

// 3. 编程式权限检查
const { can } = usePermission()
if (can('system.user.edit')) { /* ... */ }
```

## 核心能力

### 1. 权限点树形管理

使用 `ProTable` 的树形模式展示权限层级，配合搜索筛选：

```vue
<template>
  <ProTable
    ref="tableRef"
    :columns="columns"
    :request="fetchTableData"
    :toolbar="toolbarConfig"
    :search="{
      formItems: searchFormItems,
      defaultCollapsed: false,
    }"
    :pagination="false"
    :show-index-column="false"
    row-key="id"
    :expanded-row-keys="expandedRowKeys"
    :children-column-name="'children'"
    @expanded-rows-change="handleExpandedRowsChange"
  >
    <template #toolbar-actions>
      <a-button type="primary" @click="handleCreateRoot"><PlusOutlined /> 创建根权限</a-button>
      <a-button @click="expandAllRows">全部展开</a-button>
      <a-button @click="collapseAllRows">全部折叠</a-button>
    </template>
  </ProTable>
</template>
```

### 2. 搜索表单配置

```typescript
const searchFormItems = computed<ProFormItem[]>(() => [
  { name: 'keyword', label: '关键词', type: 'input' },
  {
    name: 'type',
    label: '类型',
    type: 'select',
    options: [
      { label: '菜单', value: 'menu' },
      { label: '按钮', value: 'button' },
      { label: '接口', value: 'api' },
    ],
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
])
```

### 3. 列配置（树形表格）

```typescript
const columns = computed((): ProTableColumn[] => [
  {
    title: '名称',
    dataIndex: 'name',
    width: 220,
    fixed: 'left',
    render: (value) => resolveLocalizedText(value), // 支持多语言
  },
  { title: '标识', dataIndex: 'code', width: 220 },
  {
    title: '类型',
    dataIndex: 'type',
    width: 120,
    valueType: 'tag',
    valueEnum: {
      menu: { text: '菜单', color: 'processing' },
      button: { text: '按钮', color: 'success' },
      api: { text: '接口', color: 'purple' },
    },
  },
  { title: '路由路径', dataIndex: 'path', width: 170 },
  { title: '组件路径', dataIndex: 'component', width: 220 },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    valueType: 'badge',
    valueEnum: {
      active: { text: '启用', status: 'success' },
      inactive: { text: '禁用', status: 'default' },
    },
  },
  {
    title: '是否可见',
    dataIndex: 'visible',
    width: 100,
    valueType: 'tag',
    valueEnum: {
      true: { text: '显示', color: 'blue' },
      false: { text: '隐藏', color: 'default' },
    },
  },
  { title: '排序', dataIndex: 'sort', width: 90 },
  {
    title: '操作',
    dataIndex: 'action',
    width: 260,
    fixed: 'right',
    actions: [
      { label: '编辑', icon: EditOutlined, onClick: (record) => handleEdit(record) },
      { label: '删除', icon: DeleteOutlined, danger: true, confirm: '确认删除？', onClick: (record) => handleDelete(record) },
      {
        label: '新增子级',
        icon: PlusOutlined,
        hidden: (record) => record.type !== 'menu',
        onClick: (record) => handleCreateChild(record),
      },
    ],
  },
])
```

### 4. 新增/编辑权限

使用 `ProForm` 实现权限表单，名称使用 `I18nInput` 组件支持多语言，图标使用 `IconPicker` 组件：

```vue
<a-modal
  v-model:open="modalVisible"
  :title="modalTitle"
  width="760px"
  @ok="handleSubmit"
>
  <a-alert v-if="currentParentName" type="info" show-icon style="margin-bottom: 12px">
    父菜单：{{ currentParentName }}
  </a-alert>
  <ProForm
    ref="formRef"
    :form-items="formItems"
    :initial-values="formData"
    :grid="{ cols: 2, gutter: 16 }"
    :layout="{ layout: 'vertical' }"
    @values-change="handleFormValuesChange"
  />
</a-modal>
```

### 5. 表单字段配置

```typescript
const formItems = computed<ProFormItem[]>(() => [
  {
    name: 'name',
    label: '名称',
    type: 'custom',
    render: I18nInput, // 多语言名称输入组件
    required: true,
  },
  {
    name: 'code',
    label: '标识',
    type: 'input',
    required: true,
    props: { disabled: Boolean(editingPermissionId.value) },
    rules: [{ required: true }, { pattern: /^[a-zA-Z0-9_.-]+$/ }],
  },
  {
    name: 'type',
    label: '类型',
    type: 'select',
    options: [
      { label: '菜单', value: 'menu' },
      { label: '按钮', value: 'button' },
      { label: '接口', value: 'api' },
    ],
    required: true,
  },
  // 以下字段根据 type 动态显示/隐藏
  {
    name: 'status',
    label: '状态',
    type: 'switch',
    valuePropName: 'checked',
    props: { checkedChildren: '启用', unCheckedChildren: '禁用' },
  },
  { name: 'path', label: '路由路径', type: 'input', hidden: currentType !== 'menu' },
  { name: 'component', label: '组件路径', type: 'input', hidden: currentType !== 'menu' },
  {
    name: 'icon', label: '图标', type: 'custom', render: IconPicker,
    hidden: currentType !== 'menu',
  },
  { name: 'sort', label: '排序', type: 'number', hidden: currentType !== 'menu', props: { min: 0 } },
  { name: 'description', label: '描述', type: 'textarea', colSpan: 2, props: { rows: 3 } },
  {
    name: 'visible', label: '是否可见', type: 'switch', colSpan: 2,
    valuePropName: 'checked',
    props: { checkedChildren: '显示', unCheckedChildren: '隐藏' },
  },
])
```

### 6. 权限类型联动

通过 `@values-change` 监听表单值变化，根据 `type` 动态显示/隐藏字段：

```typescript
const handleFormValuesChange = (values: Record<string, unknown>) => {
  formValues.value = { ...formValues.value, ...values }
}

const currentType = computed(() => formValues.value.type || 'menu')
```

### 7. 展开/折叠所有行

```typescript
const expandedRowKeys = ref<string[]>([])

const expandAllRows = () => {
  expandedRowKeys.value = collectPermissionIds(menuTree.value)
}

const collapseAllRows = () => {
  expandedRowKeys.value = []
}

function collectPermissionIds(list: Permission[]): string[] {
  const ids: string[] = []
  list.forEach((item) => {
    ids.push(item.id)
    if (item.children) ids.push(...collectPermissionIds(item.children))
  })
  return ids
}
```

## 数据结构

```typescript
interface Permission {
  id: string;
  name: LocalizedText | string; // 权限名称（支持多语言）
  code: string; // 权限标识
  type: 'menu' | 'button' | 'api'; // 权限类型
  parentId?: string; // 父级 ID
  path?: string; // 菜单路径（type=menu）
  component?: string; // 组件路径（type=menu）
  icon?: string; // 图标（type=menu）
  sort: number; // 排序
  status: 'active' | 'inactive'; // 状态
  visible: boolean; // 是否可见
  resource?: string; // 资源标识
  action?: string; // 操作标识
  description?: string;
  children?: Permission[];
}

interface LocalizedText {
  'zh-CN': string;
  'en-US': string;
  'ja-JP': string;
  'ko-KR': string;
}
```

## 数据请求

```typescript
const fetchTableData = async (params: Record<string, unknown>) => {
  const response = await getPermissionList({
    keyword: (params.keyword as string)?.trim() || undefined,
    type: params.type || undefined,
    status: params.status || undefined,
  })
  menuTree.value = response.data
  return { data: response.data, total: 0, success: true }
}
```

## 注意事项

### 1. 名称多语言处理

权限名称使用 `I18nInput` 组件输入，在列渲染时需解析当前语言：

```typescript
const resolveLocalizedText = (value: string | LocalizedText | undefined) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  const locale = getLocale()
  return value[locale] || value['zh-CN'] || value['en-US'] || ''
}
```

### 2. 新增子权限

只有 `type === 'menu'` 的权限才允许新增子级。新增子权限时自动设置 `parentId` 和 `type: 'menu'`。

### 3. 提交时自动派生 resource/action

```typescript
resource: type === 'menu' ? normalizePath(path) : code.replace(/\.[^.]+$/, ''),
action: type === 'menu' ? 'view' : code.split('.').pop() || '*',
```

## 相关文档

- [权限系统](/guide/permission)
- [角色管理](/guide/system-role)
- [路由系统](/guide/routing)
- [ProTable 高级表格](/components/pro-table)
- [ProForm 高级表单](/components/pro-form)