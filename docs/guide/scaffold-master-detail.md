# 主从详情脚手架（Master Detail）

## 场景

该示例展示列表 + 抽屉详情的主从结构，适用于工单、审批单、告警等场景。

- 路由：`/examples/master-detail`
- 页面：`src/views/examples/scaffold/master-detail/index.vue`

## 核心能力

- 列表行点击打开详情抽屉
- `ProDetail` 描述区 + 标签页
- 时间线日志展示
- 状态标签映射

## 落地建议

1. 列表行点击和操作列点击避免事件冲突。
2. 详情抽屉使用 `destroy-on-close=false` 保持交互流畅。
3. 状态映射集中管理，避免多处硬编码。

## 相关文档

- [ProDetail 详情页](/components/pro-detail)
- [ProDescriptions 描述列表](/components/pro-descriptions)
