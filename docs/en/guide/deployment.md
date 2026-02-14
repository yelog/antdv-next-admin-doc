# Deployment

## Build

### Pre-build Check

```bash
# Type check
pnpm type-check

# Type check + build
pnpm build:check
```

### Production Build

```bash
pnpm build
```

Build output goes to the `dist/` directory and can be deployed to any static file server.

### Environment Variables

Edit `.env.production` for production settings:

```bash
# Application title
VITE_APP_TITLE=Antdv Next Admin

# API base URL (point to real backend)
VITE_API_BASE_URL=https://api.example.com

# Disable mock data
VITE_USE_MOCK=false
```

## Nginx

```nginx
server {
    listen 80;
    server_name admin.example.com;
    root /var/www/antdv-next-admin/dist;

    # gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Static asset caching
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional)
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

::: tip Important
Since the project uses client-side routing (Vue Router history mode), you must configure `try_files $uri $uri/ /index.html` to fall back to `index.html` for all paths.
:::

## Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run

```bash
# Build image
docker build -t antdv-next-admin .

# Run container
docker run -d -p 80:80 antdv-next-admin
```

## Vercel

1. Push the project to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Select **Vite** as the framework
4. Build command: `pnpm build`
5. Output directory: `dist`
6. Click Deploy

## Netlify

1. Push the project to GitHub
2. Import the repo in [Netlify](https://netlify.com)
3. Build command: `pnpm build`
4. Publish directory: `dist`
5. Add a `_redirects` file to `public/`:

```
/*    /index.html   200
```

## Notes

- Make sure mock data is disabled in production (`VITE_USE_MOCK=false`)
- Ensure `VITE_API_BASE_URL` points to your real backend API
- Static assets use hashed filenames, so long-term caching is safe
- If using a CDN, configure the `base` option in `vite.config.ts`
