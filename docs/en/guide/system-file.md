# File Management Module

## Overview

File management provides a list view of uploaded files with filtering and single-file deletion capabilities.

- Route: `/system/file`
- View: `src/views/system/file/index.vue`
- Permission: `system.file.view`
- API: `src/api/file.ts`

## Core Capabilities

### 1. Paginated File List with Filters

Uses `ProTable` with `search.formItems` for file name, extension, and storage type filtering:

```vue
<template>
  <ProTable
    :key="refreshKey"
    :columns="columns"
    :request="loadFileList"
    :search="{ formItems: searchFormItems }"
  />
</template>
```

### 2. Search Form

```typescript
const searchFormItems = computed<ProFormItem[]>(() => [
  { name: 'originalName', label: 'File Name', type: 'input' },
  { name: 'ext', label: 'Extension', type: 'select', options: [...] },
  { name: 'storage', label: 'Storage', type: 'select', options: [...] },
])
```

### 3. Columns

```typescript
const columns = computed<ProTableColumn[]>(() => [
  { title: 'File Name', dataIndex: 'originalName', key: 'originalName', ellipsis: true },
  { title: 'Extension', dataIndex: 'ext', key: 'ext', width: 90 },
  { title: 'Size', dataIndex: 'size', key: 'size', width: 120 },
  { title: 'Storage', dataIndex: 'storage', key: 'storage', width: 100 },
  { title: 'Uploader', dataIndex: 'uploader', key: 'uploader', width: 100 },
  { title: 'Upload Time', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: 'Actions', dataIndex: 'action', key: 'action', width: 100, fixed: 'right' },
])
```

### 4. Custom Rendering

- **File Name**: displays a file type icon (color-coded by extension)
- **Size**: formatted via `formatSize()` (B, KB, MB, GB)
- **Storage**: displayed as colored tags (local=default, oss=blue, cos=green)

## Data Structure

```typescript
interface SysFile {
  id: string;
  originalName: string;
  ext: string;         // file extension
  size: number;        // bytes
  storage: 'local' | 'oss' | 'cos';
  uploader: string;
  createTime: string;
}
```

## Notes

1. **Read-only list**: this view only shows existing files and allows deletion
2. **Upload**: file upload is handled by a separate upload component/system
3. **Refresh**: after deletion, `refreshKey` is incremented to force ProTable re-mount

## Related Docs

- [ProUpload](/en/components/pro-upload)
- [Upload System Scaffold](/en/guide/scaffold-upload-system)