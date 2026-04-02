# 虚拟表格脚手架（Virtual Table）

## 场景

该示例展示大数据量列表的虚拟滚动方案，适用于千级到万级行数据的浏览与筛选场景。相比传统分页方案，虚拟滚动可以让用户在同一页面快速浏览大量数据，提升数据探索效率。

- 路由：`/examples/virtual-table`
- 页面：`src/views/examples/scaffold/virtual-table/index.vue`

## 核心能力

### 1. 虚拟滚动渲染

虚拟滚动通过只渲染可视区域的行，大幅降低 DOM 节点数量：

```typescript
// 传统渲染：渲染所有数据
<table>
  <tr v-for="item in 10000 rows">...</tr>  <!-- 10000 个 DOM 节点 -->
</table>

// 虚拟滚动：只渲染可见区域
<table>
  <tr v-for="item in visibleRows">...</tr>  <!-- 约 20 个 DOM 节点 -->
</table>
```

### 2. 固定高度容器

```vue
<template>
  <div class="virtual-table-container" :style="{ height: '600px' }">
    <VirtualTable :data="filteredData" :row-height="48" :buffer="5" />
  </div>
</template>
```

### 3. 可视区域按需渲染

```typescript
// 计算可视区域的行
const visibleRows = computed(() => {
  const startIdx = Math.floor(scrollTop.value / rowHeight);
  const endIdx = startIdx + visibleCount + buffer;

  return {
    start: Math.max(0, startIdx - buffer),
    end: Math.min(data.value.length, endIdx + buffer),
  };
});
```

### 4. 筛选与分页联动

```typescript
// 筛选不影响虚拟滚动，直接操作数据源
const filteredData = computed(() => {
  let result = [...allData.value];

  if (searchKeyword.value) {
    result = result.filter((item) => item.name.includes(searchKeyword.value));
  }

  if (statusFilter.value) {
    result = result.filter((item) => item.status === statusFilter.value);
  }

  return result;
});
```

## 关键代码解析

### 虚拟滚动核心实现

```typescript
const VirtualTable = defineComponent({
  props: {
    data: { type: Array, required: true },
    rowHeight: { type: Number, default: 48 },
    buffer: { type: Number, default: 5 },
  },
  setup(props) {
    const containerRef = ref<HTMLElement>()
    const scrollTop = ref(0)

    // 计算可见行数
    const visibleCount = computed(() => {
      const containerHeight = containerRef.value?.clientHeight || 600
      return Math.ceil(containerHeight / props.rowHeight)
    })

    // 计算渲染范围
    const renderRange = computed(() => {
      const start = Math.floor(scrollTop.value / props.rowHeight)
      return {
        start: Math.max(0, start - props.buffer),
        end: Math.min(props.data.length, start + visibleCount.value + props.buffer),
      }
    })

    // 渲染的数据
    const visibleData = computed(() =>
      props.data.slice(renderRange.value.start, renderRange.value.end)
    )

    // 总高度（用于滚动条）
    const totalHeight = computed(() => props.data.length * props.rowHeight)

    // 偏移量
    const offsetY = computed(() => renderRange.value.start * props.rowHeight)

    // 滚动事件
    const handleScroll = (e: Event) => {
      scrollTop.value = (e.target as HTMLElement).scrollTop
    }

    return () => (
      <div
        ref={containerRef}
        class="virtual-scroll-container"
        onScroll={handleScroll}
      >
        <div style={{ height: `${totalHeight.value}px`, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY.value}px)` }}>
            {visibleData.value.map((row, idx) => (
              <div class="virtual-row" style={{ height: `${props.rowHeight}px` }}>
                {/* 渲染行内容 */}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
})
```

### 行样式保持一致

```scss
.virtual-row {
  height: 48px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-border-secondary);
  padding: 0 16px;

  // 避免动态高度
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 防抖优化

```typescript
import { useDebounceFn } from "@vueuse/core";

const handleSearch = useDebounceFn((keyword: string) => {
  searchKeyword.value = keyword;
  // 重置滚动位置
  scrollTop.value = 0;
}, 300);
```

## 性能落地建议

### 1. 保持行高稳定

```typescript
// ✅ 好：固定行高
const rowHeight = 48;

// ❌ 避免：动态行高
const getRowHeight = (row) => {
  return row.expanded ? 120 : 48; // 导致滚动抖动
};
```

### 2. 纯函数化渲染逻辑

```typescript
// ✅ 好：纯函数
const renderCell = (value: string, column: Column) => {
  switch (column.type) {
    case "text":
      return value;
    case "date":
      return formatDate(value);
    case "tag":
      return h(Tag, () => value);
    default:
      return value;
  }
};

// ❌ 避免：响应式依赖
const renderCell = (value: string) => {
  // 不要在渲染函数中访问响应式数据
  return `${value} - ${someReactiveData.value}`;
};
```

### 3. 防抖筛选输入

```typescript
import { useDebounceFn } from '@vueuse/core'

const debouncedSearch = useDebounceFn((value: string) => {
  searchKeyword.value = value
}, 300)

<a-input @input="debouncedSearch" />
```

### 4. 大字段内容截断

```typescript
// 列表显示截断内容
const displayContent = computed(() =>
  item.content.length > 100
    ? item.content.slice(0, 100) + '...'
    : item.content
)

// 详情页显示完整内容
<Modal>
  <div>{{ item.content }}</div>
</Modal>
```

## 适用场景评估

### 适合虚拟滚动

| 场景     | 数据量     | 特点           |
| -------- | ---------- | -------------- |
| 数据探索 | 1000-10000 | 快速浏览、筛选 |
| 日志查看 | 5000-50000 | 时间线展示     |
| 实时监控 | 动态更新   | 新数据追加     |
| 审计记录 | 海量数据   | 只读浏览       |

### 不适合虚拟滚动

| 场景       | 原因                      |
| ---------- | ------------------------- |
| 复杂行操作 | 展开/嵌套表格难以实现     |
| 动态行高   | 图片/富文本导致高度不一致 |
| 表单编辑   | 需要保存编辑状态          |

## 第三方库推荐

### VxeTable

```bash
npm install vxe-table
```

```vue
<template>
  <vxe-table
    :data="tableData"
    :scroll-y="{ enabled: true, gt: 100 }"
    height="600"
  >
    <vxe-column field="name" title="名称" />
    <vxe-column field="status" title="状态" />
  </vxe-table>
</template>
```

### TanStack Virtual

```bash
npm install @tanstack/vue-virtual
```

```vue
<script setup>
import { useVirtualizer } from "@tanstack/vue-virtual";

const virtualizer = useVirtualizer({
  count: items.value.length,
  getScrollElement: () => scrollRef.value,
  estimateSize: () => 48,
  overscan: 5,
});
</script>
```

## 相关文档

- [高级表格脚手架](/guide/scaffold-pro-table-advanced)
- [ProTable 高级表格](/components/pro-table)
- [示例与实战](/guide/examples)
