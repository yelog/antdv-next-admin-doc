# 系统配置模块

## 概述

系统配置用于维护站点级参数（开关、阈值、默认策略），支持按分组管理。配置中心可以动态调整系统行为，无需修改代码即可改变业务逻辑。

- 路由：`/system/config`
- 页面：`src/views/system/config/index.vue`
- 权限：`system.config.view`
- API：`src/api/config.ts`

## 核心能力

### 1. 配置项分组展示

```typescript
interface ConfigGroup {
  code: string; // 分组编码
  name: string; // 分组名称
  description?: string;
  items: ConfigItem[];
}

interface ConfigItem {
  id: string;
  groupCode: string; // 所属分组
  key: string; // 配置键
  name: string; // 配置名称
  type: "text" | "number" | "switch" | "select" | "textarea";
  value: string; // 配置值
  options?: string; // 选项（JSON 格式，用于 select 类型）
  description?: string;
  sort: number;
}
```

### 2. 配置项新增/编辑/删除

根据配置类型使用不同的表单控件：

```vue
<template>
  <a-form :model="configForm">
    <!-- 文本类型 -->
    <a-form-item v-if="config.type === 'text'" :label="config.name">
      <a-input v-model:value="configForm[config.key]" />
    </a-form-item>

    <!-- 数字类型 -->
    <a-form-item v-if="config.type === 'number'" :label="config.name">
      <a-input-number v-model:value="configForm[config.key]" />
    </a-form-item>

    <!-- 开关类型 -->
    <a-form-item v-if="config.type === 'switch'" :label="config.name">
      <a-switch v-model:checked="configForm[config.key]" />
    </a-form-item>

    <!-- 选择类型 -->
    <a-form-item v-if="config.type === 'select'" :label="config.name">
      <a-select
        v-model:value="configForm[config.key]"
        :options="config.options"
      />
    </a-form-item>

    <!-- 多行文本 -->
    <a-form-item v-if="config.type === 'textarea'" :label="config.name">
      <a-textarea v-model:value="configForm[config.key]" :rows="4" />
    </a-form-item>
  </a-form>
</template>
```

### 3. 开关类、文本类、数值类参数维护

```typescript
// 配置类型与默认值映射
const CONFIG_TYPE_DEFAULTS = {
  text: "",
  number: 0,
  switch: false,
  select: "",
  textarea: "",
};

// 值类型转换
const parseConfigValue = (type: string, value: string) => {
  switch (type) {
    case "number":
      return Number(value);
    case "switch":
      return value === "true";
    default:
      return value;
  }
};

const stringifyConfigValue = (type: string, value: any): string => {
  return String(value);
};
```

### 4. 配置变更审计

```typescript
// 记录配置变更日志
const logConfigChange = async (
  configKey: string,
  oldValue: any,
  newValue: any,
) => {
  await createOperationLog({
    module: "系统配置",
    action: "修改配置",
    target: configKey,
    detail: JSON.stringify({
      oldValue,
      newValue,
      changedAt: new Date().toISOString(),
      changedBy: currentUser.value.id,
    }),
  });
};
```

## 配置使用示例

### 获取配置值

```typescript
// stores/config.ts
export const useConfigStore = defineStore("config", () => {
  const configMap = ref<Map<string, string>>(new Map());

  // 获取配置
  const getConfig = (key: string, defaultValue?: any) => {
    const value = configMap.value.get(key);
    return value !== undefined ? value : defaultValue;
  };

  // 获取数字配置
  const getNumberConfig = (key: string, defaultValue = 0) => {
    const value = configMap.value.get(key);
    return value ? Number(value) : defaultValue;
  };

  // 获取布尔配置
  const getBooleanConfig = (key: string, defaultValue = false) => {
    const value = configMap.value.get(key);
    return value ? value === "true" : defaultValue;
  };

  return { getConfig, getNumberConfig, getBooleanConfig };
});
```

### 在业务中使用

```typescript
// 使用配置控制功能开关
const configStore = useConfigStore();

// 是否开启注册功能
const enableRegister = computed(() =>
  configStore.getBooleanConfig("system.enable_register", false),
);

// 文件上传大小限制（MB）
const uploadSizeLimit = computed(() =>
  configStore.getNumberConfig("system.upload_size_limit", 10),
);

// 站点名称
const siteName = computed(() =>
  configStore.getConfig("system.site_name", "管理系统"),
);
```

## 最佳实践

### 1. 配置变更确认

```typescript
const handleConfigUpdate = async (key: string, value: any) => {
  const config = findConfig(key);

  // 高风险配置需要二次确认
  if (config.highRisk) {
    Modal.confirm({
      title: "确认修改",
      content: `即将修改「${config.name}」，此操作可能影响系统运行，确定继续吗？`,
      onOk: () => updateConfig(key, value),
    });
    return;
  }

  await updateConfig(key, value);
};
```

### 2. 高风险配置校验

```typescript
// 标记高风险配置
const HIGH_RISK_CONFIGS = [
  "system.maintenance_mode",
  "system.enable_register",
  "system.max_upload_size",
];

const isHighRiskConfig = (key: string) => {
  return HIGH_RISK_CONFIGS.includes(key);
};

// 修改前校验
const validateConfigChange = (key: string, value: any) => {
  if (key === "system.upload_size_limit") {
    if (value > 100) {
      message.warning("上传大小限制不能超过 100MB");
      return false;
    }
  }
  return true;
};
```

### 3. 配置导出与回滚

```typescript
// 导出配置
const exportConfigs = async () => {
  const configs = await getAllConfigs();
  const blob = new Blob([JSON.stringify(configs, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  // 下载...
};

// 导入/回滚配置
const importConfigs = async (file: File) => {
  const content = await file.text();
  const configs = JSON.parse(content);

  await batchUpdateConfigs(configs);
  message.success("配置导入成功");
};
```

### 4. 配置分组示例

```typescript
const CONFIG_GROUPS = {
  basic: {
    name: "基础配置",
    items: ["system.site_name", "system.logo", "system.copyright"],
  },
  security: {
    name: "安全配置",
    items: ["system.login_retry_limit", "system.password_expire_days"],
  },
  upload: {
    name: "上传配置",
    items: ["system.upload_size_limit", "system.allowed_file_types"],
  },
  email: {
    name: "邮件配置",
    items: ["email.smtp_host", "email.smtp_port", "email.sender"],
  },
};
```

## 相关文档

- [部署指南](/guide/deployment)
- [API 集成](/guide/api-integration)
- [状态管理](/guide/state-management)
