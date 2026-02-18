# 项目结构

## 目录概览

```
antdv-next-admin/
├── mock/                          # Mock 数据
│   ├── data/                      # 数据源（faker.js 生成）
│   │   ├── auth.data.ts
│   │   ├── user.data.ts
│   │   ├── role.data.ts
│   │   └── ...
│   └── handlers/                  # 请求处理器
│       ├── auth.mock.ts
│       ├── user.mock.ts
│       └── ...
├── public/                        # 静态资源
│   └── logo.svg
├── src/
│   ├── api/                       # API 接口模块
│   │   ├── auth.ts                # 认证接口
│   │   ├── user.ts                # 用户管理接口
│   │   ├── role.ts                # 角色管理接口
│   │   └── ...
│   ├── assets/                    # 项目资源
│   │   └── styles/
│   │       └── variables.css      # CSS 设计变量（100+）
│   ├── components/                # 公共组件
│   │   ├── Icon/                  # 图标组件
│   │   ├── IconPicker/            # 图标选择器
│   │   ├── Layout/                # 布局组件
│   │   ├── Permission/            # 权限组件
│   │   │   └── PermissionButton.vue
│   │   └── Pro/                   # Pro 组件
│   │       ├── ProTable/          # 高级表格
│   │       ├── ProForm/           # 高级表单
│   │       └── ProModal/          # 高级弹窗
│   ├── composables/               # 组合式函数
│   │   ├── usePermission.ts       # 权限校验
│   │   └── ...
│   ├── directives/                # 自定义指令
│   │   └── permission.ts          # v-permission 指令
│   ├── locales/                   # 国际化
│   │   ├── index.ts               # i18n 配置
│   │   ├── zh-CN.ts               # 中文
│   │   └── en-US.ts               # 英文
│   ├── router/                    # 路由
│   │   ├── index.ts               # 路由实例
│   │   ├── routes.ts              # 路由配置
│   │   └── guards.ts              # 路由守卫
│   ├── stores/                    # 状态管理（Pinia）
│   │   ├── auth.ts                # 认证状态
│   │   ├── permission.ts          # 权限状态
│   │   ├── theme.ts               # 主题状态
│   │   ├── layout.ts              # 布局状态
│   │   ├── tabs.ts                # 标签页状态
│   │   └── settings.ts            # 用户设置
│   ├── types/                     # 类型定义
│   │   ├── api.ts                 # API 类型
│   │   ├── auth.ts                # 认证类型
│   │   ├── router.ts              # 路由类型
│   │   ├── layout.ts              # 布局类型
│   │   └── pro.ts                 # Pro 组件类型
│   ├── utils/                     # 工具函数
│   │   ├── request.ts             # Axios 请求封装
│   │   └── ...
│   ├── views/                     # 页面视图
│   │   ├── dashboard/             # 仪表盘
│   │   ├── login/                 # 登录页
│   │   ├── organization/          # 组织管理
│   │   ├── system/                # 系统管理
│   │   ├── examples/              # 示例页面
│   │   └── error/                 # 错误页面
│   ├── App.vue                    # 根组件
│   └── main.ts                    # 应用入口
├── .env                           # 通用环境变量
├── .env.development               # 开发环境变量
├── .env.production                # 生产环境变量
├── index.html                     # HTML 入口
├── package.json
├── tsconfig.json                  # TypeScript 配置
└── vite.config.ts                 # Vite 配置
```

## 关键目录说明

### `src/api/`

按业务领域组织的 API 接口模块。每个文件对应一个功能模块，使用 `@/utils/request.ts` 中封装的 Axios 实例发送请求。

### `src/components/Pro/`

核心 Pro 组件，配置化驱动的高级业务组件。详见 [ProTable](/components/pro-table)、[ProForm](/components/pro-form)、[ProModal](/components/pro-modal) 文档。

### `src/stores/`

所有 Store 使用 Pinia **Setup Store** 语法（`defineStore('name', () => { ... })`），而非 Options Store。Store 的初始化由路由守卫触发，而非组件直接触发。

### `src/router/routes.ts`

路由配置分三层：
- **staticRoutes** — 无需认证（登录、错误页）
- **basicRoutes** — 需要认证（仪表盘、个人中心）
- **asyncRoutes** — 需要权限（系统管理、组织管理等）

### `src/types/`

TypeScript 类型定义集中管理。`pro.ts` 包含所有 Pro 组件的接口定义，是开发 Pro 组件的重要参考。

### `mock/`

Mock 数据系统采用双层架构：`data/` 存放数据生成逻辑（使用 faker.js），`handlers/` 存放请求处理逻辑。

## 路径别名

项目配置了 `@/` 路径别名，指向 `src/` 目录：

```typescript
// 等价于 import { useAuthStore } from '../stores/auth'
import { useAuthStore } from '@/stores/auth'
```

该别名在 `vite.config.ts` 和 `tsconfig.json` 中均有配置。
