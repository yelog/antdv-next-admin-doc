# 部门管理模块

## 概述

部门管理用于维护组织架构，以树形结构展示部门层级。部门管理在 RBAC 体系中用于数据权限控制，可以限制用户只能访问本部门或特定部门的数据。

- 路由：`/organization/dept`
- 页面：`src/views/system/dept/index.vue`
- 权限：`system.dept.view`
- API：`src/api/dept.ts`

## 核心能力

### 1. 左侧树 + 右侧详情

使用 `ProSplitLayout` 实现主从布局，左侧是部门树，右侧是部门详情和子部门列表：

```vue
<template>
  <ProSplitLayout :side-width="280">
    <template #side>
      <!-- 部门树 -->
      <div class="dept-tree-header">
        <h3>{{ t('dept.organizationStructure') }}</h3>
        <a-button type="primary" size="small" @click="handleAdd(null)">
          <PlusOutlined /> {{ t('common.add') }}
        </a-button>
      </div>
      <a-input-search
        v-model:value="searchText"
        :placeholder="t('dept.searchDept')"
        allow-clear
        @search="loadDeptTree"
      />
      <a-tree
        :tree-data="treeData"
        :field-names="{ title: 'name', key: 'id', children: 'children' }"
        :selected-keys="selectedKeys"
        default-expand-all
        block-node
        @select="handleTreeSelect"
      >
        <template #title="{ name, status }">
          <span>{{ name }}</span>
          <span v-if="status === 'disabled'" class="disabled-badge">禁用</span>
        </template>
      </a-tree>
    </template>

    <template #main>
      <!-- 部门详情 -->
      <template v-if="selectedDept">
        <div class="dept-detail-header">
          <h3>{{ selectedDept.name }}</h3>
          <ProStatus :value="selectedDept.status" :status-map="deptStatusMap" />
          <a-space>
            <a-button @click="handleAdd(selectedDept.id)"><PlusOutlined /> 新增子部门</a-button>
            <a-button @click="handleEdit(selectedDept)"><EditOutlined /> 编辑</a-button>
            <a-button danger @click="handleDelete(selectedDept)"><DeleteOutlined /> 删除</a-button>
          </a-space>
        </div>
        <ProDescriptions :columns="deptDescColumns" :data="deptDescData" :column="2" bordered />
        <!-- 子部门列表 -->
        <ProTable
          :key="selectedDept.id"
          :columns="childColumns"
          :request="loadChildDepts"
          :search="false"
          :pagination="false"
          :toolbar="{ title: t('dept.childDepts') }"
        />
      </template>
      <a-empty v-else :description="t('dept.selectDeptNode')" />
    </template>
  </ProSplitLayout>
</template>
```

### 2. 部门树加载

```typescript
const loadDeptTree = async () => {
  const params: Record<string, unknown> = {}
  if (searchText.value) params.name = searchText.value
  const [treeRes, listRes] = await Promise.all([
    getDeptTree(params),
    getDeptList(),
  ])
  if (treeRes.code === 200) treeData.value = treeRes.data
  if (listRes.code === 200) flatList.value = listRes.data
  if (!selectedKeys.value.length && treeData.value.length) {
    selectedKeys.value = [treeData.value[0].id]
  }
}
```

### 3. 部门详情展示

使用 `ProDescriptions` 展示部门详细信息：

```typescript
const deptDescColumns = computed<ProDescriptionItem[]>(() => [
  { label: '部门名称', dataIndex: 'name' },
  { label: '上级部门', dataIndex: 'parentName' },
  { label: '负责人', dataIndex: 'leader' },
  { label: '联系电话', dataIndex: 'phone' },
  { label: '邮箱', dataIndex: 'email' },
  { label: '排序', dataIndex: 'sort' },
  { label: '创建时间', dataIndex: 'createTime' },
  { label: '更新时间', dataIndex: 'updateTime' },
  { label: '备注', dataIndex: 'remark', span: 2 },
])
```

### 4. 部门新增/编辑

使用 `a-modal` + `a-form` 实现部门表单：

```vue
<a-modal
  v-model:open="modalVisible"
  :title="form.id ? '编辑部门' : '新增部门'"
  @ok="handleSubmit"
  :width="520"
>
  <a-form :model="form" :label-col="{ span: 6 }">
    <a-form-item label="上级部门">
      <a-tree-select
        v-model:value="form.parentId"
        :tree-data="parentTreeData"
        :field-names="{ label: 'name', value: 'id', children: 'children' }"
        :placeholder="'无（顶级部门）'"
        allow-clear
        tree-default-expand-all
      />
    </a-form-item>
    <a-form-item label="部门名称" required>
      <a-input v-model:value="form.name" :placeholder="'请输入部门名称'" />
    </a-form-item>
    <a-form-item label="负责人">
      <a-input v-model:value="form.leader" :placeholder="'请输入负责人'" />
    </a-form-item>
    <a-form-item label="联系电话">
      <a-input v-model:value="form.phone" :placeholder="'请输入联系电话'" />
    </a-form-item>
    <a-form-item label="邮箱">
      <a-input v-model:value="form.email" :placeholder="'请输入邮箱'" />
    </a-form-item>
    <a-form-item label="排序">
      <a-input-number v-model:value="form.sort" :min="0" style="width: 100%" />
    </a-form-item>
    <a-form-item label="状态">
      <a-radio-group v-model:value="form.status">
        <a-radio value="enabled">启用</a-radio>
        <a-radio value="disabled">禁用</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="备注">
      <a-textarea v-model:value="form.remark" :placeholder="'请输入备注'" :rows="3" />
    </a-form-item>
  </a-form>
</a-modal>
```

### 5. 删除前检查子部门

```typescript
const handleDelete = (dept: Department) => {
  const hasChildren = flatList.value.some((d) => d.parentId === dept.id)
  if (hasChildren) {
    message.warning('该部门下存在子部门，无法删除')
    return
  }
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除「${dept.name}」吗？`,
    onOk: async () => {
      await deleteDept(dept.id)
      message.success('删除成功')
      loadDeptTree()
    },
  })
}
```

## 数据结构

```typescript
interface Department {
  id: string;
  name: string; // 部门名称
  parentId: string | null; // 父级 ID
  leader?: string; // 负责人姓名
  phone?: string; // 联系电话
  email?: string; // 邮箱
  sort: number; // 排序
  status: 'enabled' | 'disabled'; // 状态
  remark?: string; // 备注
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  children?: Department[];
}
```

## 注意事项

### 1. 状态值

部门状态使用 `enabled` / `disabled`，而非 `active` / `inactive`。

### 2. 父子关系维护

`parentTreeData` 包含一个虚拟根节点用于表示"无上级部门"：

```typescript
const root: Department = {
  id: '',
  name: '无（顶级部门）',
  parentId: null,
  sort: 0,
  status: 'enabled',
  createTime: '',
  updateTime: '',
}
```

### 3. 上级部门名称解析

```typescript
const getParentName = (parentId: string | null) => {
  if (!parentId) return '顶级部门'
  return flatList.value.find((d) => d.id === parentId)?.name || '-'
}
```

## 相关文档

- [ProSplitLayout 分栏布局](/components/pro-split-layout)
- [用户管理](/guide/system-user)
- [权限系统](/guide/permission)