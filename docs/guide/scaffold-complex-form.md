# 复杂表单脚手架（Complex Form）

## 场景

该示例展示分步表单、异步校验、草稿保存、动态规则列表等复杂录入场景。适用于项目创建、配置发布、审批流程等需要多步骤数据收集的业务场景。

- 路由：`/examples/complex-form`
- 页面：`src/views/examples/scaffold/complex-form/index.vue`

## 核心能力

### 1. ProStepForm 分步流程

```vue
<ProStepForm
  v-model="currentStep"
  :steps="stepDefinitions"
  @next="nextStep"
  @submit="submitForm"
>
  <template #step-0>第一步内容</template>
  <template #step-1>第二步内容</template>
  <template #step-2>第三步内容</template>
</ProStepForm>
```

### 2. 异步校验（名称唯一性）

```typescript
const checkProjectNameUnique = async (_rule: unknown, value: string) => {
  if (!value) {
    return Promise.reject(new Error("请输入项目名称"));
  }

  // 模拟异步请求
  await new Promise((resolve) => setTimeout(resolve, 300));

  const reservedNames = ["default", "admin", "production"];
  if (reservedNames.includes(value.trim().toLowerCase())) {
    return Promise.reject(new Error("项目名称已存在"));
  }

  return Promise.resolve();
};

const rules = {
  projectName: [
    { required: true, message: "请输入项目名称" },
    { validator: checkProjectNameUnique, trigger: "blur" },
  ],
};
```

### 3. 动态规则列表增删

```vue
<template>
  <a-button type="dashed" @click="addRule">添加规则</a-button>

  <div v-for="(rule, index) in formState.rules" :key="rule.id" class="rule-row">
    <a-input v-model:value="rule.metric" placeholder="指标名" />
    <a-select v-model:value="rule.operator" :options="operatorOptions" />
    <a-input-number v-model:value="rule.threshold" :min="0" :max="10000" />
    <a-button danger @click="removeRule(index)">删除</a-button>
  </div>
</template>

<script setup lang="ts">
const addRule = () => {
  formState.rules.push({
    id: `${Date.now()}-${Math.random()}`,
    metric: "",
    operator: ">",
    threshold: null,
  });
};

const removeRule = (index: number) => {
  formState.rules.splice(index, 1);
};
</script>
```

### 4. 草稿暂存与恢复

```typescript
const DRAFT_KEY = "example:complex-form:draft";

// 保存草稿
const saveDraft = () => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(formState));
  message.success("草稿已保存");
};

// 恢复草稿
const loadDraft = () => {
  const draft = localStorage.getItem(DRAFT_KEY);
  if (draft) {
    try {
      const parsed = JSON.parse(draft);
      Object.assign(formState, parsed);
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }
};

onMounted(() => {
  loadDraft();
});
```

## 关键代码解析

### 分步校验

```typescript
const nextStep = async (step: number) => {
  if (step === 0) {
    // 校验第一步字段
    await formRef.value?.validateFields?.(["projectName", "owner", "scene"]);
  }

  if (step === 1 && !validateRuleList()) {
    // 校验规则列表
    return;
  }

  currentStep.value = step + 1;
};
```

### 自定义校验

```typescript
const validatePublishTime = async () => {
  if (formState.publishType === "schedule" && !formState.publishTime) {
    return Promise.reject(new Error("请选择发布时间"));
  }
  return Promise.resolve();
};
```

### 服务端错误处理

```typescript
const submitForm = async () => {
  // 模拟服务端返回字段错误
  if (formState.projectName.toLowerCase().includes("fail")) {
    currentStep.value = 0; // 跳回第一步
    formRef.value?.setFields?.([
      {
        name: ["projectName"],
        errors: ["服务端验证失败：项目名称不合规"],
      },
    ]);
    message.error("提交失败");
    return;
  }

  // 提交成功，清除草稿
  localStorage.removeItem(DRAFT_KEY);
  message.success("提交成功");
};
```

## 落地建议

### 1. 分步校验策略

- 每一步单独校验，避免一次性大表单阻塞用户
- 最后提交前做全量校验
- 服务端错误能定位到具体步骤

### 2. 动态列表处理

- 提供最小一条默认项
- 完善的空值和错误提示
- 增删操作即时反馈

### 3. 草稿版本管理

```typescript
interface DraftData {
  version: number; // 版本号
  timestamp: number;
  data: FormState;
}

const CURRENT_VERSION = 1;

const loadDraft = () => {
  const draft = localStorage.getItem(DRAFT_KEY);
  if (!draft) return;

  try {
    const parsed: DraftData = JSON.parse(draft);
    if (parsed.version === CURRENT_VERSION) {
      Object.assign(formState, parsed.data);
    } else {
      // 版本不兼容，清除旧草稿
      localStorage.removeItem(DRAFT_KEY);
    }
  } catch {
    localStorage.removeItem(DRAFT_KEY);
  }
};
```

### 4. 表单状态管理

- 将表单数据与临时 UI 状态分离
- 重置操作要清空所有字段和校验状态
- 保持分步骤的响应式数据流

## 相关文档

- [ProStepForm 步骤表单](/components/pro-step-form)
- [ProForm 高级表单](/components/pro-form)
- [状态管理](/guide/state-management)
