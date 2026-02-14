# 部署指南

## 构建

### 构建前检查

```bash
# 类型检查
pnpm type-check

# 类型检查 + 构建
pnpm build:check
```

### 生产构建

```bash
pnpm build
```

构建产物输出到 `dist/` 目录，可直接部署到任意静态文件服务器。

### 环境变量配置

编辑 `.env.production` 配置生产环境：

```bash
# 应用标题
VITE_APP_TITLE=Antdv Next Admin

# API 基础路径（指向真实后端）
VITE_API_BASE_URL=https://api.example.com

# 关闭 Mock 数据
VITE_USE_MOCK=false
```

## Nginx 部署

```nginx
server {
    listen 80;
    server_name admin.example.com;
    root /var/www/antdv-next-admin/dist;

    # gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # 静态资源缓存
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理（可选）
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

::: tip 关键配置
由于项目使用客户端路由（Vue Router history 模式），必须配置 `try_files $uri $uri/ /index.html` 将所有路径回退到 `index.html`。
:::

## Docker 部署

### Dockerfile

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 构建和运行

```bash
# 构建镜像
docker build -t antdv-next-admin .

# 运行容器
docker run -d -p 80:80 antdv-next-admin
```

## Vercel 部署

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入仓库
3. 框架选择 **Vite**
4. 构建命令：`pnpm build`
5. 输出目录：`dist`
6. 点击部署

## Netlify 部署

1. 将项目推送到 GitHub
2. 在 [Netlify](https://netlify.com) 中导入仓库
3. 构建命令：`pnpm build`
4. 发布目录：`dist`
5. 添加 `_redirects` 文件到 `public/`：

```
/*    /index.html   200
```

## 注意事项

- 确保生产环境已关闭 Mock 数据（`VITE_USE_MOCK=false`）
- 确保 `VITE_API_BASE_URL` 指向真实的后端 API
- 静态资源使用 hash 文件名，可安全开启长期缓存
- 如使用 CDN，需配置 `base` 选项（`vite.config.ts`）
