# 请求鉴权与自动刷新

## 场景

示例页 `request-auth` 演示了 access token 过期后，如何通过 refresh token 自动续签并重放请求。

- 路由：`/examples/request-auth`
- 页面：`src/views/examples/scaffold/request-auth/index.vue`

## 流程概览

1. 正常请求携带 `accessToken`。
2. 收到 `401` 后进入刷新流程。
3. 若已存在刷新中的 Promise，则后续请求排队等待。
4. 刷新成功后重放失败请求；失败则要求重新登录。

## 关键实现点

- 使用 `refreshPromise` 防止并发重复刷新。
- 刷新完成后统一释放等待队列。
- 刷新失败时清理本地令牌并显示重新登录提示。

## 常见风险

- 刷新接口本身再次 `401` 导致死循环。
- 并发场景下重复刷新，造成令牌覆盖。
- 请求重放没有幂等控制，导致重复写入。

## 最佳实践

- 为刷新流程增加最大重试次数。
- 对非幂等接口增加去重或幂等键。
- 在日志中记录“401→刷新→重试”链路事件。

## 相关文档

- [API 集成](/guide/api-integration)
- [权限系统](/guide/permission)
