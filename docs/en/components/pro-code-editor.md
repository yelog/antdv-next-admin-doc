# ProCodeEditor Code Editor

## Overview

`ProCodeEditor` is an advanced code editor component built on CodeMirror 6, supporting multiple programming languages and themes with syntax highlighting, code folding, auto-completion, and more. Ideal for code editing, configuration files, JSON data processing, and similar scenarios.

## Basic Usage

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

## Supported Languages

ProCodeEditor supports 14 programming languages:

| Language   | Value        |
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

## Supported Themes

ProCodeEditor supports 12 themes:

| Theme          | Value           | Description                   |
| -------------- | --------------- | ----------------------------- |
| Auto           | `auto`          | Follow system theme (default) |
| Light          | `light`         | Pure light theme              |
| Dark           | `dark`          | Pure dark theme               |
| GitHub Light   | `github`        | GitHub style light            |
| GitHub Dark    | `githubDark`    | GitHub style dark             |
| Dracula        | `dracula`       | Dracula color scheme          |
| Material       | `material`      | Material light                |
| Material Dark  | `materialDark`  | Material dark                 |
| Monokai        | `monokai`       | Classic Monokai dark          |
| Nord           | `nord`          | Nord color scheme             |
| Tokyo Night    | `tokyoNight`    | Tokyo Night dark              |
| Solarized      | `solarized`     | Solarized light               |
| Solarized Dark | `solarizedDark` | Solarized dark                |

## Props

| Property             | Type                | Default  | Description                      |
| -------------------- | ------------------- | -------- | -------------------------------- |
| `modelValue`         | `string`            | `''`     | Bound value (code content)       |
| `language`           | `SupportedLanguage` | `'json'` | Editor language type             |
| `theme`              | `EditorTheme`       | `'auto'` | Editor theme                     |
| `height`             | `number \| 'auto'`  | `300`    | Editor height (pixels or 'auto') |
| `readonly`           | `boolean`           | `false`  | Read-only mode                   |
| `disabled`           | `boolean`           | `false`  | Disabled state                   |
| `placeholder`        | `string`            | `''`     | Placeholder text                 |
| `lineNumbers`        | `boolean`           | `true`   | Show line numbers                |
| `foldGutter`         | `boolean`           | `true`   | Show code fold buttons           |
| `showToolbar`        | `boolean`           | `false`  | Show default toolbar             |
| `showLanguageSelect` | `boolean`           | `false`  | Show language selector           |
| `formatOnBlur`       | `boolean`           | `false`  | Auto-format JSON on blur         |

## Events

| Event               | Type                                    | Description                       |
| ------------------- | --------------------------------------- | --------------------------------- |
| `update:modelValue` | `(value: string) => void`               | Emitted when code content changes |
| `change`            | `(value: string) => void`               | Emitted when code content changes |
| `focus`             | `() => void`                            | Emitted when editor gains focus   |
| `blur`              | `() => void`                            | Emitted when editor loses focus   |
| `languageChange`    | `(language: SupportedLanguage) => void` | Emitted when language changes     |

## Slots

| Slot      | Description            |
| --------- | ---------------------- |
| `toolbar` | Custom toolbar content |

## Usage Examples

### JSON Editor with Toolbar

```vue
<script setup lang="ts">
import ProCodeEditor from "@/components/Pro/ProCodeEditor/index.vue";
import { ref } from "vue";

const jsonData = ref('{\n  "name": "example"\n}');
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

### Code Preview (Read-only)

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

### Custom Toolbar

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
        <a-button size="small">Execute Query</a-button>
        <a-button size="small">Format</a-button>
      </a-space>
    </template>
  </ProCodeEditor>
</template>
```

### Theme Switching

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
      <a-radio-button value="light">Light</a-radio-button>
      <a-radio-button value="dark">Dark</a-radio-button>
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

### Auto Height

```vue
<script setup lang="ts">
import ProCodeEditor from "@/components/Pro/ProCodeEditor/index.vue";
import { ref } from "vue";

const content = ref(`# Markdown Document

This is **Markdown** content.

## Features

- Item 1
- Item 2
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

## Features

### JSON Formatting and Minification

When `language="json"`, the toolbar automatically shows "Format" and "Minify" buttons:

- **Format**: Pretty-print JSON with 2-space indentation
- **Minify**: Remove all whitespace and compress to a single line

### Auto Theme Detection

When `theme="auto"`, the editor automatically follows system preferences:

- Uses light theme when system is in light mode
- Uses dark theme when system is in dark mode

### Syntax Validation

Built-in JSON syntax validation with real-time error detection and highlighting.

### Copy to Clipboard

Toolbar includes a "Copy" button for one-click copying of editor content.

## Type Definitions

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

## Related Documentation

- [ProTable Advanced Scaffold](/en/guide/scaffold-pro-table-advanced)
- [Examples](/en/guide/examples)
