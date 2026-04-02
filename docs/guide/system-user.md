# 用户管理模块

## 概述

用户管理页用于维护账号信息、角色绑定和启停状态，是后台权限体系的入口页面。所有 RBAC 权限检查都基于用户所绑定的角色，因此用户管理是权限系统的核心模块之一。

- 路由：`/organization/user`
- 页面：`src/views/system/user/index.vue`
- 权限：`system.user.view`
- API：`src/api/user.ts`

## 核心能力

### 1. 分页查询用户列表

使用 `ProTable` 实现用户列表的展示、筛选和分页：

```vue
<ProTable
  :columns="columns"
  :request="requestUsers"
  :search="{ labelWidth: 80 }"
  row-key="id"
/>
```

### 2. 按关键字筛选

```typescript
const columns: ProTableColumn[] = [
  {
    title: "用户名",
    dataIndex: "username",
    search: true,
    searchType: "input",
  },
  {
    title: "手机号",
    dataIndex: "phone",
    search: true,
    searchType: "input",
  },
  {
    title: "状态",
    dataIndex: "status",
    search: true,
    searchType: "select",
    searchOptions: [
      { label: "启用", value: "active" },
      { label: "禁用", value: "inactive" },
    ],
  },
];
```

### 3. 新增、编辑、删除用户

使用 `ProModal` + `ProForm` 实现用户表单：

```vue
<ProModal
  v-model:open="modalOpen"
  :title="modalType === 'create' ? '新增用户' : '编辑用户'"
  @ok="handleSubmit"
>
  <ProForm
    v-model="formData"
    :items="formItems"
    :grid="{ cols: 2 }"
  />
</ProModal>
```

### 4. 角色分配与状态切换

```vue
<template #bodyCell="{ column, record }">
  <template v-if="column.dataIndex === 'roles'">
    <a-tag v-for="role in record.roles" :key="role.id">
      {{ role.name }}
    </a-tag>
  </template>
  <template v-if="column.dataIndex === 'status'">
    <a-switch
      :checked="record.status === 'active'"
      @change="handleStatusChange(record.id, $event)"
    />
  </template>
</template>
```

## 典型数据结构

```typescript
interface UserItem {
  id: string;
  username: string; // 用户名（唯一）
  realName: string; // 真实姓名
  phone?: string; // 手机号
  email?: string; // 邮箱
  status: "active" | "inactive"; // 状态
  roleIds: string[]; // 绑定的角色 ID
  deptId?: string; // 所属部门 ID
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

interface UserForm {
  username: string;
  realName: string;
  phone?: string;
  email?: string;
  password?: string; // 新增时必填
  roleIds: string[];
  deptId?: string;
}
```

## 页面实现建议

### 1. 使用 ProTable 管理列表

```typescript
// 列配置
const columns: ProTableColumn[] = [
  { title: '用户名', dataIndex: 'username', search: true },
  { title: '姓名', dataIndex: 'realName', search: true },
  { title: '手机号', dataIndex: 'phone' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '角色', dataIndex: 'roles' },
  { title: '状态', dataIndex: 'status', valueType: 'tag' },
  { title: '创建时间', dataIndex: 'createdAt', valueType: 'dateTime' },
  { title: '操作', dataIndex: 'action', fixed: 'right', actions: [...] },
]

// 数据请求
const requestUsers: ProTableRequest = async (params) => {
  const res = await getUserList(params)
  return { data: res.list, total: res.total, success: true }
}
```

### 2. 使用 ProModal + ProForm 管理弹窗

```typescript
const formItems: ProFormItem[] = [
  { type: "input", name: "username", label: "用户名", required: true },
  { type: "input", name: "realName", label: "姓名", required: true },
  { type: "input", name: "phone", label: "手机号" },
  { type: "input", name: "email", label: "邮箱" },
  {
    type: "password",
    name: "password",
    label: "密码",
    required: modalType === "create",
  },
  {
    type: "select",
    name: "roleIds",
    label: "角色",
    mode: "multiple",
    options: roleOptions,
  },
  { type: "tree-select", name: "deptId", label: "部门", treeData: deptTree },
];
```

### 3. 删除前二次确认

```typescript
const handleDelete = (record: UserItem) => {
  Modal.confirm({
    title: "确认删除",
    content: `确定要删除用户「${record.realName}」吗？`,
    onOk: async () => {
      await deleteUser(record.id);
      message.success("删除成功");
      refreshTable();
    },
  });
};
```

### 4. 敏感字段脱敏

```typescript
// 手机号脱敏
const maskPhone = (phone: string) => {
  if (!phone || phone.length < 7) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
};

// 邮箱脱敏
const maskEmail = (email: string) => {
  if (!email) return email;
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
};
```

## 最佳实践

### 1. 密码安全处理

- 新增用户时强制设置初始密码
- 密码传输使用加密（HTTPS + RSA/SM2）
- 前端不存储密码明文

### 2. 角色变更实时生效

```typescript
const handleRoleChange = async (userId: string, roleIds: string[]) => {
  await updateUserRoles(userId, roleIds);

  // 如果修改的是当前用户，刷新权限
  if (userId === currentUser.value?.id) {
    await permissionStore.fetchPermissions();
  }

  message.success("角色更新成功");
};
```

### 3. 状态联动

禁用用户时应同时：

- 强制下线（清除 token）
- 禁止新登录
- 记录操作日志

### 4. 数据导入

```typescript
const handleImport = async (file: File) => {
  // 1. 解析 Excel/CSV
  const users = await parseUserFile(file);

  // 2. 校验数据
  const errors = validateUsers(users);
  if (errors.length > 0) {
    showImportErrors(errors);
    return;
  }

  // 3. 批量导入
  await batchImportUsers(users);
  message.success(`成功导入 ${users.length} 个用户`);
};
```

## 相关文档

- [权限系统](/guide/permission)
- [角色管理](/guide/system-role)
- [API 集成](/guide/api-integration)
- [示例与实战](/guide/examples)
