# 主从详情脚手架（Master Detail）

## 场景

该示例展示列表 + 抽屉详情的主从结构，适用于工单管理、审批单据、告警中心、订单详情等需要快速浏览列表并深入查看详情的场景。

- 路由：`/examples/master-detail`
- 页面：`src/views/examples/scaffold/master-detail/index.vue`

## 核心能力

### 1. 列表行点击打开详情抽屉

```typescript
const buildRowProps = (record: TicketRecord) => {
  return {
    style: { cursor: "pointer" },
    onClick: () => {
      activeRecord.value = record;
      activeTab.value = "desc";
      drawerOpen.value = true;
    },
  };
};
```

```vue
<a-table :columns="columns" :data-source="listData" :custom-row="buildRowProps">
  <!-- 行点击即可打开详情 -->
</a-table>
```

### 2. ProDetail 描述区 + 标签页

```vue
<ProDetail
  :title="`#${activeRecord.id}`"
  :sub-title="'工单编号'"
  :tags="[
    {
      text: getStatusText(activeRecord.status),
      color: getStatusColor(activeRecord.status),
    },
  ]"
  :descriptions="detailColumns"
  :data="activeRecord"
  :description-column="1"
  :tabs="drawerTabs"
  v-model:active-tab="activeTab"
>
  <template #tab-desc>
    <div>{{ activeRecord.description }}</div>
  </template>
  <template #tab-logs>
    <a-timeline>
      <a-timeline-item v-for="log in activeRecord.logs" :key="log.time">
        <strong>{{ log.action }}</strong>
        <div>{{ log.operator }} · {{ log.time }}</div>
      </a-timeline-item>
    </a-timeline>
  </template>
</ProDetail>
```

### 3. 时间线日志展示

```typescript
interface TicketRecord {
  id: string;
  title: string;
  owner: string;
  status: TicketStatus;
  logs: Array<{
    action: string; // 操作类型
    operator: string; // 操作人
    time: string; // 操作时间
  }>;
}
```

### 4. 状态标签映射

```typescript
const statusTextMap: Record<TicketStatus, string> = {
  open: "待处理",
  processing: "处理中",
  closed: "已关闭",
};

const statusColorMap: Record<TicketStatus, string> = {
  open: "blue",
  processing: "processing",
  closed: "default",
};

const getStatusText = (status: TicketStatus) => statusTextMap[status];
const getStatusColor = (status: TicketStatus) => statusColorMap[status];
```

## 关键代码解析

### 数据结构设计

```typescript
interface TicketRecord {
  id: string; // 工单编号
  title: string; // 标题
  owner: string; // 负责人
  priority: "P0" | "P1" | "P2"; // 优先级
  status: TicketStatus; // 状态
  createdAt: string; // 创建时间
  description: string; // 描述
  logs: LogItem[]; // 操作日志
}
```

### 详情列配置

```typescript
const detailColumns: ProDescriptionItem[] = [
  { label: "标题", dataIndex: "title" },
  { label: "负责人", dataIndex: "owner" },
  { label: "优先级", dataIndex: "priority" },
  { label: "创建时间", dataIndex: "createdAt" },
];
```

### 标签页配置

```typescript
const drawerTabs: ProDetailTab[] = [
  { key: "desc", label: "描述" },
  { key: "logs", label: "操作日志" },
];
```

### 抽屉配置

```vue
<a-drawer
  v-model:open="drawerOpen"
  width="560"
  :title="'工单详情'"
  :destroy-on-close="false"  <!-- 保持组件状态 -->
>
  <ProDetail ... />
</a-drawer>
```

## 落地建议

### 1. 事件冲突处理

```typescript
// 避免行点击和操作列按钮点击冲突
const columns = [
  {
    title: "操作",
    dataIndex: "action",
    customRender: ({ record }) => ({
      children: h("a-space", [
        h(
          "a-button",
          {
            onClick: (e: Event) => {
              e.stopPropagation(); // 阻止冒泡
              handleEdit(record);
            },
          },
          "编辑",
        ),
      ]),
    }),
  },
];
```

### 2. 抽屉状态保持

```vue
<a-drawer :destroy-on-close="false">
  <!-- 保持详情页的交互状态，如标签页选中 -->
</a-drawer>
```

### 3. 状态映射集中管理

```typescript
// constants/status.ts
export const TICKET_STATUS_CONFIG = {
  open: { text: "待处理", color: "blue", icon: "ClockCircleOutlined" },
  processing: { text: "处理中", color: "processing", icon: "SyncOutlined" },
  closed: { text: "已关闭", color: "default", icon: "CheckCircleOutlined" },
} as const;

// 使用
import { TICKET_STATUS_CONFIG } from "@/constants/status";
const config = TICKET_STATUS_CONFIG[record.status];
```

### 4. 响应式布局

```scss
@media (max-width: 768px) {
  .a-drawer {
    width: 100% !important; // 移动端全屏抽屉
  }
}
```

## 扩展场景

### 审批流程

- 添加审批按钮到抽屉底部
- 集成审批表单
- 审批历史时间线

### 关联数据

- 关联工单展示
- 相关附件列表
- 引用链接跳转

### 实时更新

- WebSocket 推送状态变更
- 抽屉内实时刷新
- 列表数据同步更新

## 相关文档

- [ProDetail 详情页](/components/pro-detail)
- [ProDescriptions 描述列表](/components/pro-descriptions)
- [多标签页](/guide/tabs)
