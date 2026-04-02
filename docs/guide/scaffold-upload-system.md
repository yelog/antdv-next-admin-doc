# 文件上传系统脚手架（Upload System）

## 场景

该示例演示上传流程编排：拖拽上传、进度反馈、失败重试、预览查看。适用于文件管理、图片上传、批量导入等需要处理文件上传的业务场景。

- 路由：`/examples/upload-system`
- 页面：`src/views/examples/scaffold/upload-system/index.vue`

## 核心能力

### 1. 拖拽上传

```vue
<a-upload-dragger
  v-model:file-list="fileList"
  name="file"
  multiple
  :custom-request="customRequest"
  :accept="'.png,.jpg,.jpeg,.pdf,.csv'"
  @preview="handlePreview"
>
  <p class="ant-upload-drag-icon">
    <InboxOutlined />
  </p>
  <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
  <p class="ant-upload-hint">支持单个或批量上传</p>
</a-upload-dragger>
```

### 2. 自定义上传过程

```typescript
interface CustomRequestOptions {
  file: UploadFileItem;
  onProgress?: (event: { percent: number }) => void;
  onSuccess?: (response: { url: string }) => void;
  onError?: (error: Error) => void;
}

const customRequest = (options: CustomRequestOptions) => {
  const { file, onProgress, onSuccess, onError } = options;

  // 创建 FormData
  const formData = new FormData();
  formData.append("file", file.originFileObj as File);

  // 使用 Axios 上传
  axios
    .post("/api/upload", formData, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total!,
        );
        onProgress?.({ percent });
      },
    })
    .then((response) => onSuccess?.(response.data))
    .catch((error) => onError?.(error));
};
```

### 3. 失败重试

```typescript
const retryFailed = () => {
  // 找出所有失败的文件
  const failedFiles = fileList.value.filter((item) => item.status === "error");
  if (failedFiles.length === 0) return;

  // 重新上传
  failedFiles.forEach((item) => {
    runUploadTask(item.uid);
  });

  message.info(`正在重试 ${failedFiles.length} 个文件`);
};

// 单文件重试
const retryFile = (uid: string) => {
  runUploadTask(uid);
};
```

### 4. 预览查看

```typescript
const handlePreview = async (file: UploadFileItem) => {
  // 优先使用已有 URL
  if (file.url) {
    previewSrc.value = file.url;
  }
  // 否则将文件转为 base64
  else if (file.originFileObj) {
    previewSrc.value = await getBase64(file.originFileObj);
  } else {
    message.warning("该文件不支持预览");
    return;
  }

  previewTitle.value = file.name;
  previewOpen.value = true;
};

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
  });
};
```

## 关键代码解析

### 上传状态管理

```typescript
type UploadFileItem = {
  uid: string;
  name: string;
  status?: "error" | "success" | "done" | "uploading" | "removed";
  percent?: number;
  url?: string;
  thumbUrl?: string;
  originFileObj?: File;
};

// 状态统计
const uploadingCount = computed(
  () => fileList.value.filter((item) => item.status === "uploading").length,
);
const doneCount = computed(
  () =>
    fileList.value.filter(
      (item) => item.status === "done" || item.status === "success",
    ).length,
);
const errorCount = computed(
  () => fileList.value.filter((item) => item.status === "error").length,
);
```

### 模拟上传任务

```typescript
const runUploadTask = (uid: string, callbacks) => {
  let percent = 0;

  // 模拟进度更新
  const timer = setInterval(() => {
    percent += 8 + Math.round(Math.random() * 16);
    if (percent >= 98) percent = 98;

    markFileState(uid, (item) => {
      item.status = "uploading";
      item.percent = percent;
    });

    callbacks?.onProgress?.({ percent });
  }, 160);

  // 模拟完成/失败
  setTimeout(
    () => {
      clearInterval(timer);

      const failed = Math.random() < failureRate.value;
      if (failed) {
        markFileState(uid, (item) => {
          item.status = "error";
          item.percent = 100;
        });
        callbacks?.onError?.(new Error("上传失败"));
      } else {
        markFileState(uid, (item) => {
          item.status = "done";
          item.percent = 100;
          item.url = `https://example.com/${uid}`;
        });
        callbacks?.onSuccess?.({ url: item.url });
      }
    },
    1400 + Math.random() * 900,
  );
};
```

### 文件状态更新

```typescript
const markFileState = (
  uid: string,
  updater: (item: UploadFileItem) => void,
) => {
  const file = fileList.value.find((item) => item.uid === uid);
  if (!file) return;

  updater(file);
  // 触发响应式更新
  fileList.value = [...fileList.value];
};
```

## 落地建议

### 1. 统一上传状态枚举

```typescript
// constants/upload.ts
export enum UploadStatus {
  UPLOADING = "uploading",
  SUCCESS = "success",
  ERROR = "error",
  DONE = "done",
}

// 使用
import { UploadStatus } from "@/constants/upload";
if (file.status === UploadStatus.ERROR) {
  // 处理失败
}
```

### 2. 上传前校验

```typescript
const beforeUpload = (file: File) => {
  // 文件类型校验
  const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    message.error('不支持的文件类型')
    return false
  }

  // 文件大小校验（10MB）
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    message.error('文件大小不能超过 10MB')
    return false
  }

  return true
}

<a-upload-dragger :before-upload="beforeUpload" />
```

### 3. 重试逻辑抽离

```typescript
// composables/useUploadRetry.ts
export function useUploadRetry(
  fileList: Ref<UploadFileItem[]>,
  uploadFn: (uid: string) => void,
) {
  const retryFailed = () => {
    const failedFiles = fileList.value.filter(
      (item) => item.status === "error",
    );
    failedFiles.forEach((item) => uploadFn(item.uid));
    return failedFiles.length;
  };

  const retryFile = (uid: string) => {
    uploadFn(uid);
  };

  return { retryFailed, retryFile };
}
```

### 4. 业务关联处理

```typescript
// 上传完成后关联业务实体
const handleUploadSuccess = async (
  file: UploadFileItem,
  response: { url: string },
) => {
  // 1. 更新文件 URL
  file.url = response.url;

  // 2. 关联业务实体
  await api.attachFile({
    fileId: file.uid,
    entityType: "order",
    entityId: currentOrder.value.id,
  });

  // 3. 更新业务数据
  await refreshOrderDetail();
};
```

## 扩展场景

### 分片上传

```typescript
const uploadByChunk = async (file: File) => {
  const chunkSize = 5 * 1024 * 1024; // 5MB
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(
      i * chunkSize,
      Math.min((i + 1) * chunkSize, file.size),
    );

    await uploadChunk(chunk, {
      index: i,
      total: totalChunks,
      fileId: file.uid,
    });
  }

  // 合并分片
  await mergeChunks(file.uid);
};
```

### 断点续传

```typescript
// 保存已上传的分片信息
const saveUploadProgress = (fileId: string, chunks: number[]) => {
  localStorage.setItem(`upload_${fileId}`, JSON.stringify(chunks));
};

// 恢复上传
const resumeUpload = (fileId: string) => {
  const cached = localStorage.getItem(`upload_${fileId}`);
  if (!cached) return null;

  return JSON.parse(cached) as number[];
};
```

## 相关文档

- [ProUpload 上传组件](/components/pro-upload)
- [API 集成](/guide/api-integration)
- [文件管理](/guide/system-file)
