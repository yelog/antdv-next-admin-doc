# 状态缓存脚手架（State Cache）

## 场景

该示例演示页面状态缓存策略：Pinia 持久化 + `KeepAlive` 组件缓存 + 标签页固定。适用于表单填写中途离开、复杂配置页面、需要保持浏览状态等场景。

- 路由：`/examples/state-cache`
- 页面：`src/views/examples/scaffold/state-cache/index.vue`

## 核心能力

### 1. Pinia Store 持久化

```typescript
// stores/demoStateCache.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDemoStateCacheStore = defineStore(
  "demoStateCache",
  () => {
    const keyword = ref("");
    const counter = ref(0);
    const notes = ref("");
    const updatedAt = ref("");

    // 更新时记录时间
    const updateTimestamp = () => {
      updatedAt.value = new Date().toLocaleString();
    };

    // 重置状态
    const reset = () => {
      keyword.value = "";
      counter.value = 0;
      notes.value = "";
      updateTimestamp();
    };

    return { keyword, counter, notes, updatedAt, reset, updateTimestamp };
  },
  {
    persist: {
      key: "demo-state-cache",
      storage: localStorage,
      pick: ["keyword", "counter", "notes", "updatedAt"], // 选择持久化的字段
    },
  },
);
```

### 2. KeepAlive 组件缓存

```vue
<template>
  <a-radio-group v-model:value="activePanel">
    <a-radio-button value="panelA">面板 A</a-radio-button>
    <a-radio-button value="panelB">面板 B</a-radio-button>
  </a-radio-group>

  <!-- keep-alive 保持组件状态 -->
  <keep-alive>
    <component :is="activeComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
const PanelA = defineComponent({
  name: "DemoCachePanelA", // 必须有 name 属性
  setup() {
    const localValue = ref("");
    const localCount = ref(0);
    return { localValue, localCount };
  },
  template: `
    <div>
      <a-input v-model:value="localValue" />
      <span>计数: {{ localCount }}</span>
    </div>
  `,
});

const activeComponent = computed(() =>
  activePanel.value === "panelA" ? PanelA : PanelB,
);
</script>
```

### 3. 标签页固定

```typescript
import { useTabsStore } from "@/stores/tabs";

const tabsStore = useTabsStore();
const route = useRoute();

const pinCurrentTab = () => {
  tabsStore.togglePinTab(route.path);
  message.success("标签页已固定");
};
```

### 4. 重置与恢复操作

```typescript
const cacheStore = useDemoStateCacheStore();

// 重置状态
const handleReset = () => {
  cacheStore.reset();
  message.success("状态已重置");
};

// 状态会自动从 localStorage 恢复
onMounted(() => {
  // store 初始化时已自动恢复持久化数据
  console.log("已恢复的关键词:", cacheStore.keyword);
});
```

## 关键代码解析

### Store 持久化配置

```typescript
// 使用 pinia-plugin-persistedstate
export const useDemoStateCacheStore = defineStore(
  "demoStateCache",
  () => {
    // ... state 和 actions
  },
  {
    persist: {
      key: "demo-state-cache", // 存储键名
      storage: localStorage, // 存储位置
      pick: ["keyword", "counter"], // 只持久化部分字段
      // 或者使用 omit 排除字段
      // omit: ['temporaryData'],
    },
  },
);
```

### 路由 KeepAlive 配置

```typescript
// router/routes.ts
{
  path: 'state-cache',
  name: 'ExamplesStateCache',
  component: () => import('@/views/examples/scaffold/state-cache/index.vue'),
  meta: {
    title: '状态缓存',
    keepAlive: true,  // 启用 KeepAlive
  },
}
```

### 组件 name 必须匹配

```typescript
// 组件必须有 name 属性，且与路由 name 一致
const PanelA = defineComponent({
  name: "DemoCachePanelA", // 必须有
  // ...
});
```

## 落地建议

### 1. 状态分层

```typescript
// 可持久化状态（需要跨会话保存）
const persistentState = {
  formData: {}, // 表单数据
  preferences: {}, // 用户偏好
};

// 临时 UI 状态（不需要持久化）
const temporaryState = {
  loading: false,
  visible: false,
  activeTab: "info",
};
```

### 2. 缓存过期策略

```typescript
interface CacheData<T> {
  data: T;
  timestamp: number;
  version: number;
  ttl: number; // 过期时间（毫秒）
}

export const useCachedStore = <T>(key: string, ttl: number = 86400000) => {
  const load = (): T | null => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const parsed: CacheData<T> = JSON.parse(cached);
    const now = Date.now();

    // 检查过期
    if (now - parsed.timestamp > ttl) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  };

  const save = (data: T, version: number = 1) => {
    const cache: CacheData<T> = {
      data,
      timestamp: Date.now(),
      version,
      ttl,
    };
    localStorage.setItem(key, JSON.stringify(cache));
  };

  return { load, save };
};
```

### 3. KeepAlive 使用原则

**适合 KeepAlive：**

- 表单填写页面（中途离开再回来）
- 复杂筛选条件的列表页
- 多步骤配置向导

**不适合 KeepAlive：**

- 数据实时性要求高的页面
- 内存占用大的页面
- 简单的静态展示页面

```typescript
// 控制哪些页面需要 KeepAlive
const shouldKeepAlive = computed(() => {
  return route.meta.keepAlive === true;
});
```

### 4. 版本兼容处理

```typescript
const CACHE_VERSION = 2; // 当前版本号

const loadCachedData = () => {
  const cached = localStorage.getItem("app-cache");
  if (!cached) return null;

  try {
    const { version, data } = JSON.parse(cached);
    if (version !== CACHE_VERSION) {
      // 版本不兼容，清除旧数据
      localStorage.removeItem("app-cache");
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem("app-cache");
    return null;
  }
};
```

## 常见问题

### Q: 为什么 KeepAlive 不生效？

A: 检查以下几点：

1. 组件必须有 `name` 属性
2. 路由 `meta.keepAlive` 设置为 `true`
3. 确保 `<keep-alive>` 包裹 `<component>`
4. 确保 `include/exclude` 配置正确

### Q: 状态丢失怎么办？

A:

1. 检查 persist 配置是否正确
2. 确认 localStorage 未被清除
3. 添加版本号防止结构变更导致错误
4. 使用 try-catch 处理解析异常

### Q: 内存占用过高？

A:

1. 限制 KeepAlive 页面数量
2. 使用 `exclude` 排除不需要缓存的页面
3. 在路由守卫中动态清理缓存

## 相关文档

- [状态管理](/guide/state-management)
- [多标签页](/guide/tabs)
- [路由系统](/guide/routing)
