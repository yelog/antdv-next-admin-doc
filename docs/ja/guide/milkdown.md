# Markdown Editor (Milkdown)

A Markdown editor component based on `@milkdown/vue`, providing a smooth Markdown editing experience.

## Features

- **Standard Markdown Syntax** - Supports CommonMark specification
- **GitHub Flavored Markdown (GFM)** - Supports tables, task lists and more
- **Code Highlighting** - Syntax highlighting based on Prism
- **Slash Commands** - Type `/` to open command menu
- **Tooltip** - Hover to show operation hints
- **Drag & Drop** - Drag to adjust content blocks
- **History** - Supports Undo/Redo
- **Clipboard Support** - Paste images

## Basic Usage

```vue
<template>
  <MilkdownEditor
    v-model="content"
    placeholder="Enter Markdown content..."
    :height="400"
  />
</template>

<script setup>
import { ref } from 'vue'
import MilkdownEditor from '@/components/Milkdown/index.vue'

const content = ref('# Hello World\n\nThis is **Markdown** editor')
</script>
```

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| modelValue | string | '' | Markdown content |
| placeholder | string | '' | Placeholder text |
| readonly | boolean | false | Read only |
| height | number \| string | 400 | Editor height |

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| update:modelValue | value: string | Triggered when content changes |
| change | value: string | Triggered when content changes |

## Supported Markdown Syntax

### Basic Formatting

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold**
*Italic*
~~Strikethrough~~

Inline code: `const a = 1`
```

### Lists

```markdown
Ordered list:
1. First item
2. Second item

Unordered list:
- Item one
- Item two

Task list:
- [x] Completed
- [ ] Todo item
```

### Code Blocks

```markdown
\`\`\`typescript
function greet(name: string) {
  console.log(`Hello, ${name}!`)
}
\`\`\`
```

### Tables

```markdown
| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |
```

### Others

```markdown
> Quote text

---

[Link text](https://example.com)

![Image description](https://example.com/image.png)
```

## Tech Stack

- **@milkdown/core** - Editor core
- **@milkdown/preset-commonmark** - Standard Markdown support
- **@milkdown/preset-gfm** - GitHub Flavored Markdown
- **@milkdown/theme-nord** - Nord theme
- **@milkdown/plugin-prism** - Code highlighting
- **@milkdown/plugin-slash** - Slash commands
- **@milkdown/plugin-tooltip** - Tooltip
- **@milkdown/plugin-block** - Block editing
- **@milkdown/plugin-history** - History
- **@milkdown/plugin-clipboard** - Clipboard support

## Comparison with TipTap Rich Text Editor

| Feature | Milkdown | TipTap |
|---------|----------|--------|
| Input Format | Markdown syntax | Visual editing |
| Output Format | Markdown | HTML |
| Use Case | Technical docs, notes | General rich text editing |
| Learning Curve | Requires Markdown knowledge | Zero learning cost |
| Extensibility | Very high (plugin-based) | High |

## References

- [Milkdown Documentation](https://milkdown.dev/)
- [Milkdown GitHub](https://github.com/Milkdown/milkdown)
