# 状态缓存脚手架

## 场景

该示例演示页面状态缓存策略：Pinia 持久化 + `KeepAlive` 组件缓存 + 标签页固定。

- 路由：`/examples/state-cache`
- 页面：`src/views/examples/scaffold/state-cache/index.vue`

## 核心能力

- `demoStateCache` store 保存表单输入
- `keep-alive` 缓存局部面板状态
- `tabs` store 固定当前标签页
- 重置与恢复操作

## 实施建议

1. 将“可持久化状态”与“临时 UI 状态”分离。
2. 关键缓存加过期策略和版本号。
3. 明确哪些页面需要 `keepAlive`，避免滥用导致内存上涨。

## 相关文档

- [状态管理](/guide/state-management)
- [多标签页](/guide/tabs)
