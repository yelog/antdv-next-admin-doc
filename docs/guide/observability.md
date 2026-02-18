# 可观测性实践

## 场景

示例页 `observability` 演示了请求状态建模、错误分层与事件追踪。

- 路由：`/examples/observability`
- 页面：`src/views/examples/scaffold/observability/index.vue`

## 状态建模

推荐统一处理以下状态：

- `idle`：未触发请求
- `loading`：请求中
- `success`：请求成功且有数据
- `empty`：请求成功但无数据
- `error`：请求失败

## 错误分层

- 网络错误：超时、断网、DNS 等。
- 鉴权错误：401/403 或 token 失效。
- 业务错误：业务码非成功态。

## 实施建议

1. 统一错误分类函数，避免页面各写一套。
2. 为失败请求提供“重试”动作。
3. 对关键流程上报事件日志与失败计数。
4. 区分用户可见错误与仅日志记录错误。

## 相关文档

- [API 集成](/guide/api-integration)
- [FAQ 与故障排查](/guide/faq)
