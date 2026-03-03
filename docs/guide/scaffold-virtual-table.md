# 虚拟表格脚手架（Virtual Table）

## 场景

该示例展示大数据量列表的虚拟滚动方案，适用于千级到万级行数据的浏览与筛选场景。

- 路由：`/examples/virtual-table`
- 页面：`src/views/examples/scaffold/virtual-table/index.vue`

## 核心能力

- 虚拟滚动渲染，降低首屏与滚动开销
- 固定高度容器 + 可视区域按需渲染
- 与筛选条件、分页参数联动
- 行样式与状态标签保持一致

## 性能落地建议

1. 保持行高稳定，避免动态高度导致滚动抖动。
2. 单行渲染逻辑尽量纯函数化，减少响应式依赖。
3. 对高频筛选输入做防抖，避免连续触发重算。
4. 大字段内容在列表中做截断，详情再展开查看。

## 相关文档

- [高级表格脚手架](/guide/scaffold-pro-table-advanced)
- [ProTable 高级表格](/components/pro-table)
