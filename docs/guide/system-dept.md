# 部门管理模块

## 概述

部门管理用于维护组织架构，通常以树形结构展示部门层级。

- 路由：`/organization/dept`
- 页面：`src/views/system/dept/index.vue`
- 权限：`system.dept.view`
- API：`src/api/dept.ts`

## 核心能力

- 部门树加载与懒加载
- 新增/编辑/删除部门
- 上下级关系维护
- 绑定负责人和部门编码

## 交互建议

- 左侧树、右侧详情/列表的主从布局可复用 `ProSplitLayout`。
- 删除父部门前应检查是否存在子节点。
- 支持按部门名称快速检索。

## 相关文档

- [ProSplitLayout](/components/pro-split-layout)
- [示例与实战](/guide/examples)
