# 测试体系

## 现状

项目已接入两类测试运行器：

- 单元测试：Vitest（`tests/unit/**/*.spec.ts`）
- E2E 测试：Playwright（`tests/e2e/**/*.spec.ts`）

## 可用命令

在 `antdv-next-admin/` 目录执行：

```bash
# 单测
npm run test
npm run test:unit

# 单测覆盖率
npm run test:unit:coverage

# E2E
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:debug
```

## 关键配置入口

- Vitest 配置：`vitest.config.ts`
  - `environment: 'jsdom'`
  - `include: ['tests/unit/**/*.spec.ts']`
- Playwright 配置：`playwright.config.ts`
  - `testDir: './tests/e2e'`
  - `webServer.command: 'pnpm dev'`
  - 默认 `baseURL: 'http://localhost:3000'`

## 推荐分层

1. 单元测试：覆盖工具函数、store 纯逻辑、权限判断。
2. 组件测试：覆盖关键交互（表单校验、弹窗流程、插槽渲染）。
3. E2E 测试：覆盖登录、动态路由、核心业务链路。

## 最小 CI 落地（PR 级）

```yaml
name: test
on:
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run type-check
      - run: npm run test:unit
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## 用例优先级建议

- P0：`auth` 登录成功/失败、退出登录。
- P0：`permission` 不同角色菜单与按钮差异。
- P1：`system.user` 新增、编辑、删除、筛选与分页。
- P1：`request-auth` 401 刷新与并发重试。
- P2：多语言切换、主题切换、标签页缓存一致性。

## 相关文档

- [开发工作流](/guide/development-workflow)
- [FAQ 与故障排查](/guide/faq)
