# 文件管理模块

## 概述

文件管理页用于查看和管理已上传的文件，支持按文件名、扩展名、存储方式筛选，以及单个文件删除。

- 路由：`/system/file`
- 页面：`src/views/system/file/index.vue`
- 权限：`system.file.view`
- API：`src/api/file.ts`

## 核心能力

### 1. 文件列表分页与筛选

使用 `ProTable` + `search.formItems` 实现文件列表的展示、筛选和分页：

```vue
<template>
  <ProTable
    :key="refreshKey"
    :columns="columns"
    :request="loadFileList"
    :toolbar="{ title: t('file.title'), actions: [] }"
    :search="{ formItems: searchFormItems }"
  />
</template>
```

### 2. 搜索表单配置

```typescript
const searchFormItems = computed<ProFormItem[]>(() => [
  { name: 'originalName', label: '文件名', type: 'input' },
  {
    name: 'ext',
    label: '扩展名',
    type: 'select',
    options: [
      { label: 'JPG', value: 'jpg' },
      { label: 'PNG', value: 'png' },
      { label: 'PDF', value: 'pdf' },
      { label: 'DOCX', value: 'docx' },
      { label: 'XLSX', value: 'xlsx' },
      { label: 'ZIP', value: 'zip' },
      { label: 'MP4', value: 'mp4' },
      { label: 'TXT', value: 'txt' },
      { label: 'PPTX', value: 'pptx' },
      { label: 'SVG', value: 'svg' },
    ],
  },
  {
    name: 'storage',
    label: '存储方式',
    type: 'select',
    options: [
      { label: '本地', value: 'local' },
      { label: 'OSS', value: 'oss' },
      { label: 'COS', value: 'cos' },
    ],
  },
])
```

### 3. 文件列表列配置

```typescript
const columns = computed<ProTableColumn[]>(() => [
  {
    title: '文件名',
    dataIndex: 'originalName',
    key: 'originalName',
    ellipsis: true,
  },
  { title: '扩展名', dataIndex: 'ext', key: 'ext', width: 90 },
  { title: '大小', dataIndex: 'size', key: 'size', width: 120 },
  { title: '存储方式', dataIndex: 'storage', key: 'storage', width: 100 },
  { title: '上传者', dataIndex: 'uploader', key: 'uploader', width: 100 },
  { title: '上传时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 100,
    fixed: 'right',
  },
])
```

### 4. 自定义渲染

#### 文件类型图标

根据文件扩展名显示不同的图标和颜色：

```typescript
const isImage = (ext: string) => ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)
const isVideo = (ext: string) => ['mp4', 'avi', 'mov', 'wmv'].includes(ext)

const getExtColor = (ext: string) => {
  const colors: Record<string, string> = {
    jpg: '#f5222d', jpeg: '#f5222d', png: '#fa541c',
    pdf: '#cf1322', docx: '#1677ff', xlsx: '#52c41a',
    zip: '#faad14', mp4: '#722ed1', txt: '#8c8c8c',
  }
  return colors[ext] || '#8c8c8c'
}
```

#### 文件大小格式化

```typescript
const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}
```

#### 存储方式标签

```typescript
const storageColor: Record<string, string> = {
  local: 'default',
  oss: 'blue',
  cos: 'green',
}
```

### 5. 文件删除

```typescript
const handleDelete = (record: SysFile) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除「${record.originalName}」吗？`,
    onOk: async () => {
      await deleteFile(record.id)
      message.success('删除成功')
      refreshKey.value++ // 重新挂载 ProTable
    },
  })
}
```

## 数据结构

```typescript
interface SysFile {
  id: string;
  originalName: string; // 文件名
  ext: string; // 扩展名（如 'pdf', 'jpg'）
  size: number; // 文件大小（字节）
  storage: 'local' | 'oss' | 'cos'; // 存储方式
  uploader: string; // 上传者
  createTime: string; // 上传时间
}
```

## 数据请求

```typescript
const loadFileList = async (params: Record<string, unknown>) => {
  const response = await getFileList({
    name: params.originalName as string,
    ext: params.ext as string,
    storage: params.storage as string,
    page: params.current as number,
    pageSize: params.pageSize as number,
  })
  return { data: response.data.list, total: response.data.total, success: true }
}
```

## 相关文档

- [ProUpload 上传组件](/components/pro-upload)
- [上传系统脚手架](/guide/scaffold-upload-system)