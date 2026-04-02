# ProCodeEditor 代码编辑器

## 概述

`ProCodeEditor` 是基于 CodeMirror 6 封装的高级代码编辑器组件，支持多种编程语言、多种主题风格，提供语法高亮、代码折叠、自动补全等功能，适用于代码编辑、配置文件编辑、JSON 数据处理等场景。

## 基本用法

```vue
<script setup lang="ts">
import ProCodeEditor from "@/components/Pro/ProCodeEditor/index.vue";
import { ref } from "vue";

const code = ref(`{
  "name": "antdv-next-admin",
  "version": "1.0.0"
}`);
</script>

<template>
  <ProCodeEditor v-model="code" language="json" :height="300" />
</template>
```

## 支持的语言

ProCodeEditor 支持 14 种编程语言：

| 语言       | 值           |
| ---------- | ------------ |
| JSON       | `json`       |
| JavaScript | `javascript` |
| TypeScript | `typescript` |
| HTML       | `html`       |
| CSS        | `css`        |
| Markdown   | `markdown`   |
| SQL        | `sql`        |
| YAML       | `yaml`       |
| XML        | `xml`        |
| Python     | `python`     |
| Java       | `java`       |
| PHP        | `php`        |
| Rust       | `rust`       |
| Go         | `go`         |

## 支持的主题

ProCodeEditor 支持 12 种主题：

| 主题           | 值              | 说明                 |
| -------------- | --------------- | -------------------- |
| 自动跟随       | `auto`          | 跟随系统主题（默认） |
| 亮色           | `light`         | 纯亮色主题           |
| 暗色           | `dark`          | 纯暗色主题           |
| GitHub Light   | `github`        | GitHub 风格亮色      |
| GitHub Dark    | `githubDark`    | GitHub 风格暗色      |
| Dracula        | `dracula`       | Dracula 配色         |
| Material       | `material`      | Material 亮色        |
| Material Dark  | `materialDark`  | Material 暗色        |
| Monokai        | `monokai`       | Monokai 经典暗色     |
| Nord           | `nord`          | Nord 配色            |
| Tokyo Night    | `tokyoNight`    | Tokyo Night 暗色     |
| Solarized      | `solarized`     | Solarized 亮色       |
| Solarized Dark | `solarizedDark` | Solarized 暗色       |

## Props

| 属性                 | 类型                | 默认值   | 说明                            |
| -------------------- | ------------------- | -------- | ------------------------------- |
| `modelValue`         | `string`            | `''`     | 绑定值（代码内容）              |
| `language`           | `SupportedLanguage` | `'json'` | 编辑器语言类型                  |
| `theme`              | `EditorTheme`       | `'auto'` | 编辑器主题                      |
| `height`             | `number \| 'auto'`  | `300`    | 编辑器高度（像素或 'auto'）     |
| `readonly`           | `boolean`           | `false`  | 是否只读                        |
| `disabled`           | `boolean`           | `false`  | 是否禁用                        |
| `placeholder`        | `string`            | `''`     | 占位文本                        |
| `lineNumbers`        | `boolean`           | `true`   | 是否显示行号                    |
| `foldGutter`         | `boolean`           | `true`   | 是否显示代码折叠按钮            |
| `showToolbar`        | `boolean`           | `false`  | 是否显示默认工具栏              |
| `showLanguageSelect` | `boolean`           | `false`  | 是否显示语言选择器              |
| `formatOnBlur`       | `boolean`           | `false`  | JSON 模式下失焦时是否自动格式化 |

## Events

| 事件                | 类型                                    | 说明                 |
| ------------------- | --------------------------------------- | -------------------- |
| `update:modelValue` | `(value: string) => void`               | 代码内容变化时触发   |
| `change`            | `(value: string) => void`               | 代码内容变化时触发   |
| `focus`             | `() => void`                            | 编辑器获得焦点时触发 |
| `blur`              | `() => void`                            | 编辑器失去焦点时触发 |
| `languageChange`    | `(language: SupportedLanguage) => void` | 语言切换时触发       |

## Slots

| 插槽      | 说明             |
| --------- | ---------------- |
| `toolbar` | 自定义工具栏内容 |

## 使用示例

### JSON 编辑器（带工具栏）

```vue
<script setup lang="ts">
import ProCodeEditor from "@/components/Pro/ProCodeEditor/index.vue";
import { ref } from "vue";

const jsonData = ref('{\n  "name": "示例"\n}');
</script>

<template>
  <ProCodeEditor
    v-model="jsonData"
    language="json"
    :height="400"
    show-toolbar
  />
</template>
```

### 代码预览（只读模式）

```vue
<script setup lang="ts">
import ProCodeEditor from "@/components/Pro/ProCodeEditor/index.vue";

const code = `function hello() {
  console.log('Hello, World!')
}`;
</script>

<template>
  <ProCodeEditor
    :model-value="code"
    language="javascript"
    theme="github"
    readonly
    :height="200"
  />
</template>
```

### 自定义工具栏

```vue
<script setup lang="ts">
import ProCodeEditor from "@/components/Pro/ProCodeEditor/index.vue";
import { ref } from "vue";

const code = ref("SELECT * FROM users WHERE status = 1");
</script>

<template>
  <ProCodeEditor v-model="code" language="sql" :height="250">
    <template #toolbar>
      <a-space>
        <a-button size="small">执行查询</a-button>
        <a-button size="small">格式化</a-button>
      </a-space>
    </template>
  </ProCodeEditor>
</template>
```

### 多主题切换

```vue
<script setup lang="ts">
import ProCodeEditor from "@/components/Pro/ProCodeEditor/index.vue";
import { ref } from "vue";

const code = ref('const theme = "dracula"');
const theme = ref<"light" | "dark" | "dracula">("dark");
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-radio-group v-model:value="theme" size="small">
      <a-radio-button value="light">亮色</a-radio-button>
      <a-radio-button value="dark">暗色</a-radio-button>
      <a-radio-button value="dracula">Dracula</a-radio-button>
    </a-radio-group>

    <ProCodeEditor
      v-model="code"
      language="typescript"
      :theme="theme"
      :height="300"
    />
  </a-space>
</template>
```

### 自适应高度

```vue
<script setup lang="ts">
import ProCodeEditor from "@/components/Pro/ProCodeEditor/index.vue";
import { ref } from "vue";

const content = ref(`# Markdown 文档

这是一段 **Markdown** 内容。

## 特性

- 列表项 1
- 列表项 2
`);
</script>

<template>
  <ProCodeEditor
    v-model="content"
    language="markdown"
    height="auto"
    show-language-select
  />
</template>
```

## 特性说明

### JSON 格式化与压缩

当 `language="json"` 时，工具栏会自动显示「格式化」和「压缩」按钮：

- **格式化**：将 JSON 格式化为缩进 2 空格的美观格式
- **压缩**：移除所有空白字符，压缩为单行

### 自动主题跟随

当 `theme="auto"` 时，编辑器会自动跟随系统主题设置：

- 系统为亮色模式时使用亮色主题
- 系统为暗色模式时使用暗色主题

### 代码校验

JSON 模式下内置语法校验，编辑器会实时检测 JSON 语法错误并高亮显示。

### 复制功能

工具栏提供「复制」按钮，一键复制编辑器内容到剪贴板。

## 类型定义

```typescript
export type SupportedLanguage =
  | "json"
  | "javascript"
  | "typescript"
  | "html"
  | "css"
  | "markdown"
  | "sql"
  | "yaml"
  | "xml"
  | "python"
  | "java"
  | "php"
  | "rust"
  | "go";

export type EditorTheme =
  | "auto"
  | "light"
  | "dark"
  | "github"
  | "githubDark"
  | "dracula"
  | "material"
  | "materialDark"
  | "monokai"
  | "nord"
  | "tokyoNight"
  | "solarized"
  | "solarizedDark";
```

## 相关文档

- [高级表格脚手架](/guide/scaffold-pro-table-advanced)
- [示例与实战](/guide/examples)
