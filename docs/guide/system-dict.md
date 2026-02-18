# 字典管理模块

## 概述

字典管理用于维护下拉选项、状态映射等静态数据，支持按类型分组。

- 路由：`/system/dict`
- 页面：`src/views/system/dict/index.vue`
- 权限：`system.dict.view`
- API：`src/api/dict.ts`

## 核心能力

- 字典类型管理（type）
- 字典项管理（label/value）
- 启用状态和排序维护
- 前端缓存复用（`dict store`）

## 使用建议

1. 字典 `value` 设计为稳定值，避免直接用中文文本。
2. 高频字典可在登录后预加载。
3. 在 `ProTable/ProForm` 中通过统一 options 复用。

## 相关文档

- [状态管理](/guide/state-management)
- [工具函数](/guide/utils)
