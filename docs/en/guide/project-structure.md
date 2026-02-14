# Project Structure

## Directory Overview

```
antdv-next-admin/
├── mock/                          # Mock data
│   ├── data/                      # Data sources (faker.js)
│   │   ├── auth.data.ts
│   │   ├── user.data.ts
│   │   ├── role.data.ts
│   │   └── ...
│   └── handlers/                  # Request handlers
│       ├── auth.mock.ts
│       ├── user.mock.ts
│       └── ...
├── public/                        # Static assets
│   └── logo.svg
├── src/
│   ├── api/                       # API modules
│   │   ├── auth.ts                # Authentication API
│   │   ├── user.ts                # User management API
│   │   ├── role.ts                # Role management API
│   │   └── ...
│   ├── assets/                    # Project assets
│   │   └── styles/
│   │       └── variables.css      # CSS design tokens (100+)
│   ├── components/                # Shared components
│   │   ├── Icon/                  # Icon component
│   │   ├── IconPicker/            # Icon picker
│   │   ├── Permission/            # Permission components
│   │   │   └── PermissionButton.vue
│   │   └── Pro/                   # Pro components
│   │       ├── ProTable/          # Advanced table
│   │       ├── ProForm/           # Advanced form
│   │       └── ProModal/          # Advanced modal
│   ├── composables/               # Composables
│   │   ├── usePermission.ts       # Permission checks
│   │   └── ...
│   ├── directives/                # Custom directives
│   │   └── permission.ts          # v-permission directive
│   ├── layouts/                   # Layout components
│   │   └── AdminLayout.vue
│   ├── locales/                   # Internationalization
│   │   ├── index.ts               # i18n setup
│   │   ├── zh-CN.ts               # Chinese
│   │   └── en-US.ts               # English
│   ├── router/                    # Routing
│   │   ├── index.ts               # Router instance
│   │   ├── routes.ts              # Route definitions
│   │   └── guards.ts              # Navigation guards
│   ├── stores/                    # State management (Pinia)
│   │   ├── auth.ts                # Auth state
│   │   ├── permission.ts          # Permission state
│   │   ├── theme.ts               # Theme state
│   │   ├── layout.ts              # Layout state
│   │   ├── tabs.ts                # Tab state
│   │   └── settings.ts            # User settings
│   ├── types/                     # Type definitions
│   │   ├── api.ts                 # API types
│   │   ├── auth.ts                # Auth types
│   │   ├── router.ts              # Router types
│   │   ├── layout.ts              # Layout types
│   │   └── pro.ts                 # Pro component types
│   ├── utils/                     # Utilities
│   │   ├── request.ts             # Axios wrapper
│   │   └── ...
│   ├── views/                     # Page views
│   │   ├── dashboard/             # Dashboard
│   │   ├── login/                 # Login page
│   │   ├── organization/          # Organization management
│   │   ├── system/                # System management
│   │   ├── examples/              # Example pages
│   │   └── error/                 # Error pages
│   ├── App.vue                    # Root component
│   └── main.ts                    # App entry
├── .env                           # Shared env variables
├── .env.development               # Dev env variables
├── .env.production                # Production env variables
├── index.html                     # HTML entry
├── package.json
├── tsconfig.json                  # TypeScript config
└── vite.config.ts                 # Vite config
```

## Key Directories

### `src/api/`

API modules organized by business domain. Each file corresponds to a feature module, using the Axios instance from `@/utils/request.ts`.

### `src/components/Pro/`

Core Pro components — configuration-driven advanced business components. See [ProTable](/en/components/pro-table), [ProForm](/en/components/pro-form), and [ProModal](/en/components/pro-modal) docs.

### `src/stores/`

All stores use Pinia **Setup Store** syntax (`defineStore('name', () => { ... })`), not Options Store. Store initialization is triggered by router guards, not by components directly.

### `src/router/routes.ts`

Routes are organized in three tiers:
- **staticRoutes** — No auth required (login, error pages)
- **basicRoutes** — Auth required (dashboard, profile)
- **asyncRoutes** — Permission required (system management, organization, etc.)

### `src/types/`

Centralized TypeScript type definitions. `pro.ts` contains all Pro component interfaces — an essential reference for Pro component development.

### `mock/`

The mock system uses a two-layer architecture: `data/` for data generation (using faker.js), and `handlers/` for request handling logic.

## Path Alias

The project uses the `@/` alias pointing to the `src/` directory:

```typescript
// Equivalent to import { useAuthStore } from '../stores/auth'
import { useAuthStore } from '@/stores/auth'
```

This alias is configured in both `vite.config.ts` and `tsconfig.json`.
