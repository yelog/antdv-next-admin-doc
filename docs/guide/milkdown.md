# Markdown 编辑器（Milkdown）

基于 `@milkdown/vue` 的 Markdown 编辑器组件，提供流畅的 Markdown 编辑体验。

## 特性

- **标准 Markdown 语法** - 支持 CommonMark 规范
- **GitHub Flavored Markdown (GFM)** - 支持表格、任务列表等扩展语法
- **代码高亮** - 基于 Prism 的代码块语法高亮
- **Slash 命令** - 输入 `/` 唤起命令菜单
- **工具栏提示** - 悬停显示操作提示
- **拖拽编辑** - 支持拖拽调整内容块
- **历史记录** - 支持 Undo/Redo
- **剪贴板支持** - 支持粘贴图片

## 基础用法

```vue
<template>
  <MilkdownEditor
    v-model="content"
    placeholder="请输入 Markdown 内容..."
    :height="400"
  />
</template>

<script setup>
import { ref } from 'vue'
import MilkdownEditor from '@/components/Milkdown/index.vue'

const content = ref('# Hello World\n\n这是 **Markdown** 编辑器')
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string | '' | Markdown 内容 |
| placeholder | string | '' | 占位提示文本 |
| readonly | boolean | false | 是否只读 |
| height | number \| string | 400 | 编辑器高度 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | value: string | 内容变化时触发 |
| change | value: string | 内容变化时触发 |

## 支持的 Markdown 语法

### 基础格式

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体**
*斜体*
~~删除线~~

行内代码：`const a = 1`
```

### 列表

```markdown
有序列表：
1. 第一项
2. 第二项

无序列表：
- 项目一
- 项目二

任务列表：
- [x] 已完成
- [ ] 待办项
```

### 代码块

```markdown
\`\`\`typescript
function greet(name: string) {
  console.log(`Hello, ${name}!`)
}
\`\`\`
```

### 表格

```markdown
| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |
```

### 其他

```markdown
> 引用文本

---

[链接文本](https://example.com)

![图片描述](https://example.com/image.png)
```

## 技术栈

- **@milkdown/core** - 编辑器核心
- **@milkdown/preset-commonmark** - 标准 Markdown 支持
- **@milkdown/preset-gfm** - GitHub Flavored Markdown
- **@milkdown/theme-nord** - Nord 主题
- **@milkdown/plugin-prism** - 代码高亮
- **@milkdown/plugin-slash** - Slash 命令
- **@milkdown/plugin-tooltip** - 工具栏提示
- **@milkdown/plugin-block** - 拖拽编辑
- **@milkdown/plugin-history** - 历史记录
- **@milkdown/plugin-clipboard** - 剪贴板支持

## 与 TipTap 富文本编辑器的区别

| 特性 | Milkdown | TipTap |
|------|----------|--------|
| 输入格式 | Markdown 语法 | 可视化编辑 |
| 输出格式 | Markdown | HTML |
| 适用场景 | 技术文档、笔记 | 普通富文本编辑 |
| 学习曲线 | 需要学习 Markdown | 零学习成本 |
| 扩展性 | 极高（插件化） | 高 |

## 参考

- [Milkdown 官方文档](https://milkdown.dev/)
- [Milkdown GitHub](https://github.com/Milkdown/milkdown)
