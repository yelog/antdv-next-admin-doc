# I18nInput 组件

## 概述

`I18nInput` 基于 `JsonInput` 封装多语言输入，统一维护 `zh-CN/en-US` 等语言字段。

- 组件：`src/components/I18nInput/index.vue`
- 示例页：`/examples/i18n-input`

## 核心特性

- 多语言键值对编辑
- 支持按当前语言展示主值
- 兼容对象值与 JSON 字符串值
- 自动补齐缺失语言键

## 基础用法

```vue
<I18nInput v-model:value="form.title" :placeholder="'点击编辑多语言内容'" />
```

## 适用场景

- 商品名称/描述多语言维护
- 国际化文案后台编辑
- 多语言表单字段录入

## 相关文档

- [国际化](/guide/i18n)
- [JsonInput 组件](/guide/json-input)
