# Quick Start

## Prerequisites

Make sure your development environment meets the following requirements:

| Tool | Version | Note |
| --- | --- | --- |
| Node.js | >= 16 | LTS version recommended |
| npm | >= 8 | Or use pnpm (recommended) |
| Git | Latest | Version control |

::: tip Recommendation
We recommend using [pnpm](https://pnpm.io/) as your package manager for faster installs and less disk usage.

```bash
npm install -g pnpm
```
:::

## Get the Code

```bash
git clone https://github.com/yelog/antdv-next-admin.git
cd antdv-next-admin
```

## Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

## Start Dev Server

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

Once started, open [http://localhost:3000](http://localhost:3000) in your browser.

Log in with the demo accounts:
- **Admin**: `admin` / `123456` (full permissions)
- **User**: `user` / `123456` (limited permissions)

## Build & Preview

```bash
# Type check
pnpm type-check

# Production build
pnpm build

# Type check + production build
pnpm build:check

# Preview the build output
pnpm preview
```

## Environment Variables

The project uses `.env` files to manage environment variables:

| File | Description |
| --- | --- |
| `.env` | Variables shared across all environments |
| `.env.development` | Development environment variables |
| `.env.production` | Production environment variables |

### Key Variables

```bash
# Application title
VITE_APP_TITLE=Antdv Next Admin

# API base URL
VITE_API_BASE_URL=/api

# Enable mock data (enabled by default in development)
VITE_USE_MOCK=true
```

::: warning Note
You need to restart the dev server after modifying environment variables.
:::

## Next Steps

- Read [Project Structure](/en/guide/project-structure) to understand code organization
- Learn about the [Routing System](/en/guide/routing) to see how pages are organized
- Check the [Permission System](/en/guide/permission) for access control
- Use [Pro Components](/en/components/pro-table) to quickly build business pages
