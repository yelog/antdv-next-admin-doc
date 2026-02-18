# JsonInput 组件

## 概述

`JsonInput` 是结构化 JSON 编辑输入组件，支持表单模式与原始 JSON 模式切换，适合配置项编辑场景。

- 组件：`src/components/JsonInput/index.vue`
- 示例页：`/examples/json-input`

## 核心特性

- 对象字段可视化编辑
- 拖拽排序字段（可选）
- 新增/删除字段（可选）
- 原始 JSON 编辑与校验
- 支持禁用字段、只读字段、标签映射

## 基础用法

```vue
<JsonInput v-model:value="config" :placeholder="'点击编辑 JSON'" />
```

## 适用场景

- 系统配置编辑
- 复杂策略参数录入
- 后端 JSON 字段管理

## 相关文档

- [示例与实战](/guide/examples)
- [复杂表单脚手架](/guide/scaffold-complex-form)
