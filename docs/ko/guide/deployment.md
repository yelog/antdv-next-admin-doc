# 배포 가이드

## 빌드

### 빌드 전 체크

```bash
# 타입 검사
pnpm type-check

# 타입 검사 + 빌드
pnpm build:check
```

### 프로덕션 빌드

```bash
pnpm build
```

빌드 결과물은 `dist/` 디렉토리에 출력되며, 임의의 정적 파일 서버에 직접 배포할 수 있습니다.

### 환경 변수 설정

`.env.production`을 편집하여 프로덕션 환경을 설정합니다:

```bash
# 애플리케이션 타이틀
VITE_APP_TITLE=Antdv Next Admin

# API 베이스 경로(실제 백엔드 지정)
VITE_API_BASE_URL=https://api.example.com

# Mock 데이터 비활성화
VITE_USE_MOCK=false
```

## Nginx 배포

```nginx
server {
    listen 80;
    server_name admin.example.com;
    root /var/www/antdv-next-admin/dist;

    # gzip 압축
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # 정적 리소스 캐싱
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 라우팅 폴백
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 프록시(선택 사항)
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

::: tip 중요한 설정
프로젝트는 클라이언트 사이드 라우팅(Vue Router history 모드)을 사용하므로, 모든 경로를 `index.html`로 폴백하는 `try_files $uri $uri/ /index.html` 설정이 필수입니다.
:::

## Docker 배포

### Dockerfile

```dockerfile
# 빌드 단계
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# 실행 단계
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 빌드와 실행

```bash
# 이미지 빌드
docker build -t antdv-next-admin .

# 컨테이너 실행
docker run -d -p 80:80 antdv-next-admin
```

## Vercel 배포

1. 프로젝트를 GitHub에 푸시
2. [Vercel](https://vercel.com)에서 저장소 가져오기
3. 프레임워크로 **Vite** 선택
4. 빌드 명령: `pnpm build`
5. 출력 디렉토리: `dist`
6. 배포 클릭

## Netlify 배포

1. 프로젝트를 GitHub에 푸시
2. [Netlify](https://netlify.com)에서 저장소 가져오기
3. 빌드 명령: `pnpm build`
4. 게시 디렉토리: `dist`
5. `public/`에 `_redirects` 파일 추가:

```
/*    /index.html   200
```

## 주의 사항

- 프로덕션 환경에서 Mock 데이터 비활성화(`VITE_USE_MOCK=false`)
- `VITE_API_BASE_URL`이 실제 백엔드 API를 가리키는지 확인
- 정적 리소스는 해시 파일명을 사용하여 장기 캐싱을 안전하게 활성화 가능
- CDN을 사용하는 경우 `base` 옵션(`vite.config.ts`) 설정 필요
