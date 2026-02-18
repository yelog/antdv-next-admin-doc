# 测试体系

## 现状

项目当前提供测试示例文件，但默认未完整接入测试运行器。

- 单测示例：`tests/unit/keyword-search.spec.ts`
- E2E 示例：`tests/e2e/login-and-filter.spec.ts`

## 推荐分层

1. 单元测试：覆盖工具函数、纯逻辑函数。
2. 组件测试：覆盖表单交互、状态切换、插槽渲染。
3. E2E 测试：覆盖登录、路由、核心业务流程。

## 最小落地路径

1. 先为工具函数建立稳定单测基线。
2. 增加关键流程 E2E（登录、权限、CRUD）。
3. 将测试命令接入 CI，至少在 PR 上执行。

## 测试用例建议

- `auth`：登录成功/失败、退出登录。
- `permission`：不同角色菜单与按钮差异。
- `system.user`：新增、编辑、删除、分页筛选。
- `request-auth`：401 刷新与并发重试。

## 相关文档

- [开发工作流](/guide/development-workflow)
- [FAQ 与故障排查](/guide/faq)
