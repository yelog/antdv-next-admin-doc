# Antdv Next Admin 文档

<p align="center">
  <img src="docs/public/logo.png" width="120" alt="Antdv Next Admin Logo">
</p>

<p align="center">
  <a href="https://github.com/yelog/antdv-next-admin">
    <img src="https://img.shields.io/badge/GitHub-Repository-1677ff?logo=github" alt="GitHub">
  </a>
  <a href="https://github.com/yelog/antdv-next-admin/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-1677ff" alt="License">
  </a>
  <a href="https://vitepress.dev">
    <img src="https://img.shields.io/badge/VitePress-1.6+-1677ff?logo=vitepress" alt="VitePress">
  </a>
</p>

<p align="center">
  <b>Antdv Next Admin 官方文档站点</b>
</p>

<p align="center">
  基于 <a href="https://vitepress.dev">VitePress</a> 构建，提供完整的中英文双语文档
</p>

---

## 📚 文档内容

### 指南 (Guide)

#### 开始
- [项目介绍](docs/guide/introduction.md) - 了解 Antdv Next Admin 的核心特性
- [快速上手](docs/guide/getting-started.md) - 5 分钟快速开始
- [项目结构](docs/guide/project-structure.md) - 目录组织和文件说明

#### 核心功能
- [路由系统](docs/guide/routing.md) - 动态路由与权限控制
- [权限系统](docs/guide/permission.md) - RBAC 权限管理详解
- [主题系统](docs/guide/theme.md) - 自定义主题与暗色模式
- [国际化](docs/guide/i18n.md) - 多语言配置指南
- [Mock 数据](docs/guide/mock.md) - 本地开发 mock 方案
- [状态管理](docs/guide/state-management.md) - Pinia Store 详解

#### 开发指南
- [开发工作流](docs/guide/development-workflow.md) - 项目开发规范与流程
- [API 集成](docs/guide/api-integration.md) - 后端 API 对接指南
- [工具函数](docs/guide/utils.md) - 常用工具函数文档
- [通用组件](docs/guide/common-components.md) - 非 Pro 组件文档
- [Composables](docs/guide/composables.md) - 组合式函数文档

#### 进阶
- [多标签页](docs/guide/tabs.md) - 多标签页系统详解
- [布局系统](docs/guide/layout.md) - 布局配置与响应式适配
- [示例与实战](docs/guide/examples.md) - 完整开发案例

#### 其他
- [部署指南](docs/guide/deployment.md) - 生产环境部署
- [FAQ](docs/guide/faq.md) - 常见问题与故障排查

### Pro 组件

| 组件 | 说明 | 状态 |
|------|------|------|
| [ProTable](docs/components/pro-table.md) | 配置化高级表格，内置搜索、分页、工具栏 | ✅ |
| [ProForm](docs/components/pro-form.md) | 配置化高级表单，支持 20+ 字段类型 | ✅ |
| [ProModal](docs/components/pro-modal.md) | 增强弹窗，支持拖拽、缩放、全屏 | ✅ |
| [ProDescriptions](docs/components/pro-descriptions.md) | 数据描述组件 | ✅ |
| [ProStatus](docs/components/pro-status.md) | 状态指示器 | ✅ |
| [ProChart](docs/components/pro-chart.md) | 图表卡片组件 | ✅ |
| [ProUpload](docs/components/pro-upload.md) | 上传组件封装 | ✅ |
| [ProDetail](docs/components/pro-detail.md) | 详情页布局 | ✅ |
| [ProStatCard](docs/components/pro-stat-card.md) | 统计卡片 | ✅ |
| [ProStepForm](docs/components/pro-step-form.md) | 步骤表单 | ✅ |
| [ProSplitLayout](docs/components/pro-split-layout.md) | 分栏布局 | ✅ |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8 (推荐)

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
# 启动开发服务器
pnpm dev

# 或 npm run dev
```

文档站点将在 http://localhost:5173 启动（或 VitePress 自动分配的端口）。

### 构建

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

---

## 📁 项目结构

```
antdv-next-admin-doc/
├── docs/                       # 文档源文件
│   ├── .vitepress/            # VitePress 配置
│   │   ├── config/            # 配置文件
│   │   │   ├── index.ts       # 主配置入口
│   │   │   ├── shared.ts      # 共享配置
│   │   │   ├── zh.ts          # 中文配置
│   │   │   └── en.ts          # 英文配置
│   │   └── theme/
│   │       ├── index.ts       # 主题入口
│   │       └── custom.css     # 自定义样式
│   ├── guide/                 # 指南文档
│   │   ├── introduction.md
│   │   ├── getting-started.md
│   │   └── ...
│   ├── components/            # 组件文档
│   │   ├── pro-table.md
│   │   ├── pro-form.md
│   │   └── ...
│   ├── public/                # 静态资源
│   │   └── logo.png
│   ├── index.md               # 首页
│   └── changelog.md           # 更新日志
├── package.json
└── README.md
```

---

## 🛠️ 技术栈

- **[VitePress](https://vitepress.dev)** - 静态站点生成器
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript

### 特性

- 🌍 **国际化** - 支持中文和英文双语切换
- 🔍 **本地搜索** - 基于 minisearch 的文档搜索
- 🎨 **自定义主题** - Ant Design 品牌色定制
- 📱 **响应式** - 适配移动端阅读
- 🌙 **暗色模式** - 支持亮色/暗色主题切换

---

## 📝 文档规范

### 文件组织

- 中文文档放在 `docs/` 根目录下
- 英文文档放在 `docs/en/` 目录下
- 组件文档放在 `docs/components/`
- 指南文档放在 `docs/guide/`

###  Frontmatter 规范

```yaml
---
outline: deep              # 目录深度
---
```

### 组件文档模板

每个组件文档应包含：

1. **概述** - 组件用途和特点
2. **基本用法** - 最简单的使用示例
3. **Props** - 属性列表和说明
4. **Events** - 事件列表
5. **Slots** - 插槽说明
6. **方法** - 暴露的方法（如有）
7. **类型定义** - TypeScript 接口

---

## 🌐 国际化

文档支持中英文双语，通过 VitePress 的 locales 配置实现：

- 默认语言：简体中文 (`/`)
- 次要语言：English (`/en/`)

新增语言时，需要在以下位置添加翻译：

1. `docs/.vitepress/config/shared.ts` - 搜索配置
2. `docs/.vitepress/config/` - 导航和侧边栏配置
3. `docs/` 目录 - 文档内容

---

## 🚀 部署

### 构建到 GitHub Pages

```bash
# 构建
pnpm build

# 输出目录：docs/.vitepress/dist
```

### 构建到自有服务器

```bash
pnpm build
# 将 docs/.vitepress/dist 目录内容部署到服务器
```

---

## 🤝 贡献指南

1. **Fork** 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 文档贡献规范

- 保持中英文文档同步更新
- 代码示例需要可运行
- Props 表格使用标准格式
- 使用中文标点符号（中文文档）

---

## 📄 许可证

[MIT](https://github.com/yelog/antdv-next-admin/blob/main/LICENSE) License © 2024-present [yelog](https://github.com/yelog)

---

## 🔗 相关链接

- [主项目仓库](https://github.com/yelog/antdv-next-admin)
- [在线演示](https://yelog.github.io/antdv-next-admin)
- [VitePress 文档](https://vitepress.dev)
- [Ant Design Vue](https://antdv.com)
