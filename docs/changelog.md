# 更新日志

本文档记录项目的所有重要变更。格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [1.0.0] - 2024-01-15

首个正式发布版本。

### 新增

#### 核心架构

- 基于 Vue 3.4 + TypeScript 5 + Vite 5 的现代化架构
- Composition API + `<script setup>` 语法
- 严格的 TypeScript 类型检查
- Pinia 状态管理（Setup Store 语法）
- Vue Router 4 动态路由

#### 权限系统

- 完整的 RBAC（基于角色的访问控制）权限系统
- 动态路由生成（基于用户权限）
- 按钮级权限控制（`v-permission` 指令）
- 编程式权限检查（`usePermission` composable）
- 权限组件封装（`<PermissionButton>`）

#### Pro 组件库

- **ProTable** — 配置化高级表格组件
  - 自动搜索表单生成
  - 13 种列渲染类型（text、date、tag、badge、money、progress 等）
  - 7 种搜索字段类型（input、select、date、range、number 等）
  - 表头筛选（关键字搜索 + 下拉选择）
  - 列拖拽调整宽度、列显隐、列固定
  - 表格密度切换（大/中/小）
  - 批量操作支持

- **ProForm** — 配置化高级表单组件
  - 20+ 字段类型（input、select、date、upload、editor 等）
  - 网格布局支持
  - 表单验证
  - 动态选项加载

- **ProModal** — 增强弹窗组件
  - 拖拽移动
  - 边缘缩放（8 方向）
  - 全屏切换（带动画）

- **ProDescriptions** — 描述列表组件
- **ProStatus** — 状态指示器组件
- **ProChart** — ECharts 图表封装
- **ProUpload** — 上传组件封装
- **ProDetail** — 详情页布局
- **ProStatCard** — 统计卡片
- **ProStepForm** — 步骤表单向导
- **ProSplitLayout** — 分栏布局
- **ProCodeEditor** — 代码编辑器（14 种语言、12 种主题）

#### 主题系统

- 6 种预设主题色（蓝、绿、紫、红、橙、青）
- 亮色 / 暗色 / 自动模式
- 侧边栏独立主题配置
- 100+ CSS 设计变量
- 圆形展开过渡动画

#### 国际化

- 内置中文（zh-CN）和英文（en-US）
- 日语（ja-JP）和韩语（ko-KR）部分支持
- 基于 vue-i18n，运行时动态切换
- 支持按需加载语言包

#### 布局系统

- 多标签页系统
  - KeepAlive 缓存
  - 固定标签
  - 右键菜单（刷新、关闭、关闭其他）
  - 拖拽排序
- 垂直 / 水平双布局模式
- 响应式设计
- 全局快捷搜索（Ctrl+K）

#### 系统模块

- **用户管理** — 用户增删改查、角色分配、状态管理
- **角色管理** — 角色定义、权限分配
- **权限管理** — 权限点树形维护
- **部门管理** — 组织架构树形管理
- **字典管理** — 字典类型和字典项管理
- **系统配置** — 站点级参数配置
- **文件管理** — 文件上传、下载、预览
- **日志管理** — 操作日志、登录日志查询

#### 开发工具

- Mock 数据系统（faker.js + vite-plugin-mock-dev-server）
- Axios HTTP 客户端封装
- 工具函数库（helpers、storage、request）
- Composables（usePermission、useFullscreen、useWatermark）

#### 示例页面

- 21 个示例页面，涵盖常见业务场景
- 脚手架示例（ProTable 高级、复杂表单、主从详情等）
- 功能示例（表单、表格、弹窗、编辑器等）
- 集成示例（外链、iframe）
- 异常页面（403/404/500）

### 技术栈

| 技术         | 版本 | 说明                   |
| ------------ | ---- | ---------------------- |
| Vue          | 3.4  | 渐进式 JavaScript 框架 |
| TypeScript   | 5    | JavaScript 的类型超集  |
| Vite         | 5    | 下一代前端构建工具     |
| Pinia        | 3    | Vue 状态管理           |
| Vue Router   | 5    | Vue 官方路由           |
| vue-i18n     | 11   | 国际化插件             |
| antdv-next   | 1.x  | Ant Design Vue 组件库  |
| Axios        | 1.14 | HTTP 客户端            |
| ECharts      | 6    | 数据可视化             |
| TipTap       | 3    | 富文本编辑器           |
| CodeMirror   | 6    | 代码编辑器             |
| Tailwind CSS | 4    | 原子化 CSS 框架        |

### 浏览器支持

| 浏览器  | 版本  |
| ------- | ----- |
| Chrome  | >= 87 |
| Firefox | >= 78 |
| Safari  | >= 14 |
| Edge    | >= 88 |

> **注意**：不支持 IE 浏览器

### 演示账号

| 用户名 | 密码   | 权限                   |
| ------ | ------ | ---------------------- |
| admin  | 123456 | 超级管理员（全部权限） |
| user   | 123456 | 普通用户（部分权限）   |

---

## 贡献指南

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）：**

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变动
- `ci`: CI/CD 配置变动

**示例：**

```
feat(user): 新增用户导入功能

- 支持 Excel 导入
- 支持数据校验
- 支持错误回执导出

Closes #123
```

---

## 版本规划

### [1.1.0] - 计划中

- [ ] 暗黑模式完善
- [ ] 移动端适配优化
- [ ] 更多 Pro 组件
- [ ] 单元测试覆盖
- [ ] E2E 测试

### [1.2.0] - 计划中

- [ ] 微前端架构支持
- [ ] 国际化完善（ja/ko 全量翻译）
- [ ] 性能监控面板
- [ ] AI 助手集成

---

## 链接

- [GitHub 仓库](https://github.com/yelog/antdv-next-admin)
- [在线文档](https://antdv-next-admin-doc.vercel.app)
- [问题反馈](https://github.com/yelog/antdv-next-admin/issues)
- [更新日志](/changelog)
