# FAQ 与故障排查

本文档整理 Antdv Next Admin 项目中的常见问题及解决方案。

## 目录

- [安装依赖问题](#安装依赖问题)
- [开发环境问题](#开发环境问题)
- [路由问题](#路由问题)
- [权限问题](#权限问题)
- [Mock 数据问题](#mock-数据问题)
- [构建部署问题](#构建部署问题)
- [TypeScript 问题](#typescript-问题)
- [性能优化建议](#性能优化建议)

---

## 安装依赖问题

### Q: 安装依赖时卡住或超时

**解决方案：**

```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com

# 或使用 pnpm
pnpm install
```

### Q: 依赖冲突警告

**解决方案：**

```bash
# 删除 node_modules 重新安装
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 开发环境问题

### Q: 启动开发服务器后白屏

**可能原因及解决方案：**

1. **端口被占用**
```bash
# 更换端口
npm run dev -- --port 3001
```

2. **环境变量未生效**
```bash
# 重启开发服务器
# 修改 .env 文件后需要重启
```

3. **浏览器缓存**
```bash
# 强制刷新：Cmd/Ctrl + Shift + R
# 或清除浏览器缓存
```

### Q: 热更新（HMR）不生效

**解决方案：**

```bash
# 1. 检查 Vite 配置
# vite.config.ts 中确保 hmr 配置正确

server: {
  hmr: {
    overlay: true,
  },
}

# 2. 重启开发服务器
# 3. 检查浏览器控制台是否有 WebSocket 连接错误
```

### Q: 登录后跳转到空白页

**可能原因：**
1. 权限路由未正确生成
2. KeepAlive 缓存问题

**解决方案：**

```typescript
// 检查 permission store 是否正确生成路由
const permissionStore = usePermissionStore()
await permissionStore.generateRoutes()

// 清除缓存后重试
localStorage.clear()
location.reload()
```

---

## 路由问题

### Q: 刷新页面 404

**原因：** 前端路由模式为 history，需要服务器配置

**解决方案：**

**Nginx 配置：**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Vercel：**
```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Q: 新增页面后菜单不显示

**检查清单：**

1. 路由是否正确添加到 `routes.ts`
2. 路由 meta 中是否设置了 `title`
3. 是否有权限访问该路由
4. 重新登录（权限路由需要重新生成）

### Q: KeepAlive 缓存不生效

**可能原因：**

```typescript
// 1. 检查路由配置
{
  meta: {
    keepAlive: true,  // 确保设置为 true
    title: '页面标题' // 必须设置 title
  }
}

// 2. 检查组件 name 是否与路由 name 一致
export default {
  name: 'Dashboard',  // 必须与路由 name 一致
}

// 3. 检查缓存列表
tabsStore.cachedViews.includes('Dashboard')
```

---

## 权限问题

### Q: 按钮权限指令不生效

**排查步骤：**

```typescript
// 1. 检查权限码是否正确
<a-button v-permission="'user.create'">新增</a-button>

// 2. 检查用户是否拥有该权限
const authStore = useAuthStore()
console.log(authStore.userPermissions) // 查看用户权限列表

// 3. 确保用户已登录
console.log(authStore.isLoggedIn)
```

### Q: 路由守卫无限循环

**原因：** 路由守卫中逻辑错误导致循环跳转

**解决方案：**

```typescript
// 确保在路由守卫中正确判断
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // ✅ 正确：先判断是否登录
  if (!authStore.isLoggedIn && to.path !== '/login') {
    next('/login')
    return
  }
  
  // ✅ 正确：已登录访问登录页，跳转到首页
  if (authStore.isLoggedIn && to.path === '/login') {
    next('/')
    return
  }
  
  next()
})
```

---

## Mock 数据问题

### Q: Mock 接口不生效

**排查步骤：**

1. **检查环境变量**
```bash
# .env.development
VITE_USE_MOCK=true
```

2. **检查接口地址**
```typescript
// 必须以 /api 开头
request.get('/api/users')  // ✅ 正确
request.get('/users')       // ❌ 错误
```

3. **检查 Mock 文件**
```typescript
// mock/handlers/*.mock.ts
export default defineMock([
  {
    url: '/api/users',  // 必须以 /api 开头
    method: 'GET',
    // ...
  }
])
```

4. **重启开发服务器**

### Q: Mock 数据修改后不生效

**解决方案：**

Mock 服务器支持热更新，但有时需要重启：

```bash
# 重启开发服务器
npm run dev
```

---

## 构建部署问题

### Q: 构建失败

**常见错误及解决方案：**

1. **TypeScript 错误**
```bash
# 先运行类型检查，查看具体错误
npm run type-check

# 修复类型错误
```

2. **内存溢出**
```bash
# 增加 Node 内存限制
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

3. **路径错误**
```typescript
// vite.config.ts 中检查 base 配置
export default {
  base: '/',  // 根据部署环境调整
}
```

### Q: 部署后资源 404

**可能原因：**

1. **Base 路径配置错误**
```typescript
// 如果部署到子目录
export default {
  base: '/admin/',  // 子目录路径
}
```

2. **服务器配置问题**
- 确保静态资源目录配置正确
- 检查文件权限

### Q: 部署后白屏

**排查步骤：**

1. **检查浏览器控制台报错**
2. **检查网络请求是否成功**
3. **确认环境变量是否正确**
```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
```

---

## TypeScript 问题

### Q: 类型错误：Cannot find module '@/components/xxx'

**解决方案：**

```json
// tsconfig.json 中确保 paths 配置正确
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

重启 VS Code 或 TypeScript 服务

### Q: Vue 文件类型报错

**解决方案：**

```typescript
// 确保安装了 Vue 类型
npm install -D vue-tsc

// tsconfig.json 中包含 Vue 文件
{
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
```

### Q: Ref 类型推断错误

**解决方案：**

```typescript
// ✅ 正确：显式指定类型
const count = ref<number>(0)
const user = ref<User | null>(null)

// ✅ 正确：从初始值推断
const count = ref(0)  // 推断为 Ref<number>
```

---

## 性能优化建议

### 1. 首屏加载优化

```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 分包加载
          'vendor': ['vue', 'vue-router', 'pinia'],
          'antdv': ['antdv-next'],
        },
      },
    },
  },
}
```

### 2. 组件懒加载

```typescript
const Dashboard = () => import('@/views/dashboard/index.vue')
```

### 3. 图片优化

```vue
<!-- 使用 WebP 格式 -->
<img src="@/assets/logo.webp" alt="logo">

<!-- 或懒加载 -->
<img v-lazy="imageSrc" alt="image">
```

### 4. 避免内存泄漏

```typescript
// 清理定时器
onUnmounted(() => {
  clearInterval(timer)
})

// 清理事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 清理 Store 订阅
const unsubscribe = store.$subscribe(() => {})
onUnmounted(() => {
  unsubscribe()
})
```

---

## 如何获取帮助

1. **查看文档**：仔细阅读对应功能模块的文档
2. **查看示例**：参考 `src/views/examples/` 中的示例代码
3. **搜索 Issue**：在 GitHub Issues 中搜索类似问题
4. **提交 Issue**：如果问题未解决，请提交 Issue 并附带：
   - 问题描述
   - 复现步骤
   - 错误截图或日志
   - 环境信息（Node 版本、操作系统等）

---

## 调试技巧汇总

### Vue DevTools

1. 安装 [Vue DevTools 浏览器扩展](https://devtools.vuejs.org/)
2. 查看组件树和 Props
3. 检查 Pinia Store 状态
4. 查看路由信息

### 控制台调试

```typescript
// 打印路由信息
console.log('Current route:', router.currentRoute.value)

// 打印 Store 状态
console.log('Auth store:', authStore.$state)

// 打印环境变量
console.log('Env:', import.meta.env)
```

### Network 面板

1. 检查 API 请求是否成功
2. 查看请求参数和响应数据
3. 检查是否有跨域错误

---

## 下一步

- 查看 [开发工作流](/guide/development-workflow) 了解项目开发规范
- 阅读 [API 集成](/guide/api-integration) 学习后端对接
- 查看 [示例与实战](/guide/examples) 了解完整案例
