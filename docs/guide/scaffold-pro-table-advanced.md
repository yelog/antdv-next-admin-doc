# 高级表格脚手架（ProTable Advanced）

## 场景

该示例展示 ProTable 在真实业务中的组合能力：查询、批量操作、导出、状态切换。

- 路由：`/examples/pro-table-advanced`
- 页面：`src/views/examples/scaffold/pro-table-advanced/index.vue`

## 核心能力

- 列配置 + 值类型渲染
- 查询表单与分页联动
- 批量选中、批量禁用、批量删除
- 工具栏导出与列设置

## 推荐复用方式

1. 将列定义抽离为独立模块，便于页面复用。
2. 批量操作统一封装确认框和提示逻辑。
3. 导出逻辑与当前筛选条件保持一致。

## 相关文档

- [ProTable 高级表格](/components/pro-table)
- [示例与实战](/guide/examples)
