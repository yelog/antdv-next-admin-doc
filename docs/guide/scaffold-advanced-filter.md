# 高级筛选脚手架（Advanced Filter）

## 场景

该示例展示可配置筛选构建器，适用于复杂检索、审计查询和运营看板筛选场景。

- 路由：`/examples/advanced-filter`
- 页面：`src/views/examples/scaffold/advanced-filter/index.vue`

## 核心能力

- 条件关系切换：`AND` / `OR`
- 多字段 + 多操作符组合筛选（字符串、枚举、数字、日期）
- 动态值输入组件（输入框、下拉、多选、区间）
- 方案保存/恢复/删除（Saved Schemes）

## 落地建议

1. 前端条件结构与后端查询 DSL 保持一一映射。
2. 统一维护字段配置（类型、操作符、可选项），避免页面散落逻辑。
3. 方案保存需要版本号，字段变更后可识别并降级兼容。
4. 对区间类条件做上下界校验，避免无效请求。

## 推荐参数结构

```json
{
  "relation": "AND",
  "conditions": [
    { "field": "status", "operator": "in", "value": ["active", "pending"] },
    { "field": "score", "operator": "between", "value": 70, "value2": 95 }
  ]
}
```

## 相关文档

- [JsonInput 组件](/guide/json-input)
- [I18nInput 组件](/guide/i18n-input)
- [示例与实战](/guide/examples)
