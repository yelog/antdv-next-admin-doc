# デプロイガイド

## ビルド

### ビルド前チェック

```bash
# 型チェック
pnpm type-check

# 型チェック + ビルド
pnpm build:check
```

### プロダクションビルド

```bash
pnpm build
```

ビルド成果物は `dist/` ディレクトリに出力され、任意の静的ファイルサーバーに直接デプロイできます。

### 環境変数の設定

`.env.production` を編集してプロダクション環境を設定します：

```bash
# アプリケーションタイトル
VITE_APP_TITLE=Antdv Next Admin

# API ベースパス（実際のバックエンドを指定）
VITE_API_BASE_URL=https://api.example.com

# Mock データを無効化
VITE_USE_MOCK=false
```

## Nginx デプロイ

```nginx
server {
    listen 80;
    server_name admin.example.com;
    root /var/www/antdv-next-admin/dist;

    # gzip 圧縮
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # 静的リソースキャッシュ
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA ルーティングフォールバック
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API プロキシ（オプション）
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

::: tip 重要な設定
プロジェクトはクライアントサイドルーティング（Vue Router history モード）を使用しているため、すべてのパスを `index.html` にフォールバックする `try_files $uri $uri/ /index.html` の設定が必須です。
:::

## Docker デプロイ

### Dockerfile

```dockerfile
# ビルド段階
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# 実行段階
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### ビルドと実行

```bash
# イメージのビルド
docker build -t antdv-next-admin .

# コンテナの実行
docker run -d -p 80:80 antdv-next-admin
```

## Vercel デプロイ

1. プロジェクトを GitHub にプッシュ
2. [Vercel](https://vercel.com) でリポジトリをインポート
3. フレームワークに **Vite** を選択
4. ビルドコマンド：`pnpm build`
5. 出力ディレクトリ：`dist`
6. デプロイをクリック

## Netlify デプロイ

1. プロジェクトを GitHub にプッシュ
2. [Netlify](https://netlify.com) でリポジトリをインポート
3. ビルドコマンド：`pnpm build`
4. 公開ディレクトリ：`dist`
5. `public/` に `_redirects` ファイルを追加：

```
/*    /index.html   200
```

## 注意事項

- プロダクション環境では Mock データを無効化（`VITE_USE_MOCK=false`）
- `VITE_API_BASE_URL` が実際のバックエンド API を指していることを確認
- 静的リソースは hash ファイル名を使用し、長期キャッシュを安全に有効化可能
- CDN を使用する場合は、`base` オプション（`vite.config.ts`）を設定する必要あり
