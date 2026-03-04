# 快速上手

## 环境准备

在开始之前，请确保你的开发环境满足以下要求：

| 工具 | 版本要求 | 说明 |
| --- | --- | --- |
| Node.js | >= 16 | 推荐使用 LTS 版本 |
| npm | >= 8 | 或使用 pnpm（推荐） |
| Git | 最新版 | 版本控制 |

::: tip 推荐
建议使用 [pnpm](https://pnpm.io/) 作为包管理工具，安装速度更快、磁盘占用更少。

```bash
npm install -g pnpm
```
:::

## 获取代码

```bash
git clone https://github.com/yelog/antdv-next-admin.git
cd antdv-next-admin
```

## 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

## 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

启动成功后，浏览器访问 [http://localhost:3000](http://localhost:3000)。

使用演示账号登录：
- **管理员**：`admin` / `123456`（拥有全部权限）
- **普通用户**：`user` / `123456`（有限权限）

## 构建与预览

```bash
# 类型检查
pnpm type-check

# 生产构建
pnpm build

# 类型检查 + 生产构建
pnpm build:check

# 预览构建产物
pnpm preview
```

## 环境变量

项目使用 `.env` 文件管理环境变量：

| 文件 | 说明 |
| --- | --- |
| `.env` | 所有环境通用的基础变量 |
| `.env.development` | 开发环境变量（Mock 模式） |
| `.env.production` | 生产环境变量（静态部署配置） |

### 关键变量

```bash
# 是否启用 Mock 数据
VITE_USE_MOCK=true

# API 基础路径
# 开发环境：/api（使用 vite-plugin-mock-dev-server）
# 生产环境：空（使用客户端 Mock 拦截器）或实际 API 地址
VITE_API_BASE_URL=/api
```

### 环境配置示例

**开发环境** `.env.development`:
```bash
VITE_USE_MOCK=true
VITE_API_BASE_URL=/api
```

**生产环境（静态部署）** `.env.production`:
```bash
VITE_USE_MOCK=true
VITE_API_BASE_URL=
```

**生产环境（连接后端）** `.env.production`:
```bash
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://api.example.com
```

::: warning 注意
修改环境变量后需要重启开发服务器才能生效。
:::

## 下一步

- 了解 [项目结构](/guide/project-structure) 熟悉代码组织
- 阅读 [路由系统](/guide/routing) 了解页面是如何组织的
- 查看 [权限系统](/guide/permission) 掌握权限控制方案
- 使用 [Pro 组件](/components/pro-table) 快速开发业务页面
