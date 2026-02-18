# 系统配置模块

## 概述

系统配置用于维护站点级参数（开关、阈值、默认策略），支持按分组管理。

- 路由：`/system/config`
- 页面：`src/views/system/config/index.vue`
- 权限：`system.config.view`
- API：`src/api/config.ts`

## 核心能力

- 配置项分组展示
- 配置项新增/编辑/删除
- 开关类、文本类、数值类参数维护
- 配置变更审计（建议）

## 实施建议

- 配置变更前增加确认提示。
- 对高风险配置加二次校验。
- 关键配置应支持导出与回滚策略。

## 相关文档

- [部署指南](/guide/deployment)
- [API 集成](/guide/api-integration)
