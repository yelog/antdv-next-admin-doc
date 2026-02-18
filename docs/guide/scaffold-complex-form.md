# 复杂表单脚手架（Complex Form）

## 场景

该示例展示分步表单、异步校验、草稿保存、动态规则列表等复杂录入场景。

- 路由：`/examples/complex-form`
- 页面：`src/views/examples/scaffold/complex-form/index.vue`

## 核心能力

- `ProStepForm` 分步流程
- 异步校验（名称唯一性）
- 动态规则项增删
- 草稿暂存与恢复

## 落地建议

1. 每一步单独校验，避免一次性大表单阻塞。
2. 动态列表提供最小一条默认项与错误提示。
3. 草稿存储增加版本号，防止结构升级冲突。

## 相关文档

- [ProStepForm 步骤表单](/components/pro-step-form)
- [ProForm 高级表单](/components/pro-form)
