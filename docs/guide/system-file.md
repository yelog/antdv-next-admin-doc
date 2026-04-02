# 文件管理模块

## 概述

文件管理页用于上传、下载、预览和删除文件，覆盖常见后台附件场景。文件管理支持图片、文档、视频等多种类型的文件，并提供完善的权限控制和审计能力。

- 路由：`/system/file`
- 页面：`src/views/system/file/index.vue`
- 权限：`system.file.view`
- API：`src/api/file.ts`

## 核心能力

### 1. 文件上传（支持进度展示）

```vue
<template>
  <a-upload-dragger
    v-model:file-list="fileList"
    :custom-request="customRequest"
    :before-upload="beforeUpload"
    multiple
  >
    <p class="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
  </a-upload-dragger>
</template>

<script setup lang="ts">
const customRequest = async (options: UploadRequestOption) => {
  const { file, onProgress, onSuccess, onError } = options;

  const formData = new FormData();
  formData.append("file", file as File);

  try {
    const result = await axios.post("/api/upload", formData, {
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total!);
        onProgress?.({ percent });
      },
    });
    onSuccess?.(result.data);
  } catch (error) {
    onError?.(error as Error);
  }
};
</script>
```

### 2. 文件列表分页与筛选

```vue
<ProTable
  :columns="columns"
  :request="requestFiles"
  :search="{ labelWidth: 80 }"
>
  <template #bodyCell="{ column, record }">
    <template v-if="column.dataIndex === 'preview'">
      <a-image
        v-if="isImage(record.type)"
        :src="record.url"
        :width="60"
      />
      <a-tag v-else>{{ getFileType(record.type) }}</a-tag>
    </template>
  </template>
</ProTable>
```

### 3. 文件预览与下载

```typescript
// 预览文件
const handlePreview = (file: FileItem) => {
  if (isImage(file.type)) {
    previewImage.value = file.url;
    previewVisible.value = true;
  } else if (isPDF(file.type)) {
    window.open(file.url, "_blank");
  } else {
    message.info("该文件类型不支持预览");
  }
};

// 下载文件
const handleDownload = async (file: FileItem) => {
  const response = await fetch(file.url);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();

  URL.revokeObjectURL(url);
};
```

### 4. 文件删除与批量操作

```typescript
const handleDelete = (file: FileItem) => {
  Modal.confirm({
    title: "确认删除",
    content: `确定要删除文件「${file.name}」吗？`,
    onOk: async () => {
      await deleteFile(file.id);
      message.success("删除成功");
      refreshTable();
    },
  });
};

const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning("请选择要删除的文件");
    return;
  }

  Modal.confirm({
    title: "批量删除",
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 个文件吗？`,
    onOk: async () => {
      await batchDeleteFiles(selectedRowKeys.value);
      message.success("批量删除成功");
      selectedRowKeys.value = [];
      refreshTable();
    },
  });
};
```

## 数据结构

```typescript
interface FileItem {
  id: string;
  name: string; // 文件名
  type: string; // 文件类型（MIME type）
  size: number; // 文件大小（字节）
  url: string; // 文件 URL
  path: string; // 存储路径
  bucket?: string; // 存储桶
  uploader: string; // 上传者
  uploaderId: string; // 上传者 ID
  businessType?: string; // 业务类型
  businessId?: string; // 业务 ID
  createdAt: string;
  updatedAt: string;
}
```

## 实现建议

### 1. 上传前校验

```typescript
const beforeUpload = (file: File) => {
  // 类型校验
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];
  if (!allowedTypes.includes(file.type)) {
    message.error("不支持的文件类型");
    return false;
  }

  // 大小校验
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    message.error("文件大小不能超过 10MB");
    return false;
  }

  // 数量校验
  if (fileList.value.length >= 20) {
    message.error("最多上传 20 个文件");
    return false;
  }

  return true;
};
```

### 2. 失败重试

```typescript
const retryFailed = () => {
  const failedFiles = fileList.value.filter((item) => item.status === "error");
  if (failedFiles.length === 0) {
    message.info("没有需要重试的文件");
    return;
  }

  failedFiles.forEach((item) => {
    // 重置状态
    item.status = "uploading";
    item.percent = 0;

    // 重新上传
    runUploadTask(item);
  });
};
```

### 3. 下载鉴权

```typescript
// 后端生成带签名的下载链接
const getDownloadUrl = async (fileId: string) => {
  const res = await getFileDownloadToken(fileId);

  // 返回带签名的临时链接（有效期 5 分钟）
  return `${baseUrl}/download/${fileId}?token=${res.token}&expires=${res.expires}`;
};

// 下载时检查权限
const handleDownload = async (file: FileItem) => {
  // 检查下载权限
  if (!canDownload(file)) {
    message.error("无下载权限");
    return;
  }

  const downloadUrl = await getDownloadUrl(file.id);
  window.open(downloadUrl, "_blank");
};
```

### 4. 文件分类

```typescript
// 按文件类型分类
const FILE_CATEGORIES = {
  image: {
    name: "图片",
    types: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    icon: "FileImageOutlined",
  },
  document: {
    name: "文档",
    types: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    icon: "FileWordOutlined",
  },
  video: {
    name: "视频",
    types: ["video/mp4", "video/webm", "video/ogg"],
    icon: "VideoCameraOutlined",
  },
  audio: {
    name: "音频",
    types: ["audio/mpeg", "audio/ogg", "audio/wav"],
    icon: "AudioOutlined",
  },
};

const getFileCategory = (mimeType: string) => {
  for (const [key, category] of Object.entries(FILE_CATEGORIES)) {
    if (category.types.includes(mimeType)) {
      return { key, ...category };
    }
  }
  return { key: "other", name: "其他", icon: "FileOutlined" };
};
```

## 最佳实践

### 1. 文件存储策略

```typescript
// 本地存储
const uploadToLocal = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return await axios.post("/api/upload/local", formData);
};

// 云存储（OSS/S3）
const uploadToOSS = async (file: File) => {
  // 1. 获取上传凭证
  const { uploadUrl, fileKey } = await getOSSToken(file.name);

  // 2. 直传到 OSS
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });

  // 3. 返回文件信息
  return { key: fileKey, url: uploadUrl };
};
```

### 2. 图片压缩

```typescript
const compressImage = async (file: File, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => resolve(new File([blob!], file.name, { type: file.type })),
          file.type,
          quality,
        );
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
};
```

## 相关文档

- [API 集成](/guide/api-integration)
- [ProUpload 上传组件](/components/pro-upload)
- [上传系统脚手架](/guide/scaffold-upload-system)
