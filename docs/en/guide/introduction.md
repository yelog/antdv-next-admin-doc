# Introduction

## What is Antdv Next Admin

**Antdv Next Admin** is a modern admin scaffold built with Vue 3 + TypeScript + Ant Design Vue. It provides an out-of-the-box enterprise-grade admin solution to help developers quickly build fully-featured management systems with great user experience.

## Core Features

### Modern Tech Stack

- **Vue 3.4** — Composition API with `<script setup>` syntax
- **TypeScript 5** — Strict type checking with complete type definitions
- **Vite 5** — Ultra-fast dev server and build tool
- **Pinia** — Next-gen state management (Setup Store syntax)
- **Vue Router 4** — Dynamic routing with permission filtering

### Permission System

A complete RBAC (Role-Based Access Control) permission system:

- **Route-level** — Dynamically generated routes based on user roles
- **Button-level** — Control visibility via `v-permission` directive
- **Programmatic** — Check permissions in logic with `usePermission()` composable
- **Component-based** — Wrap elements with `<PermissionButton>` component

### Pro Components

Efficient configuration-driven components:

| Component | Description |
| --- | --- |
| **ProTable** | Advanced table with search form, toolbar, pagination, value types, column filtering, and resizing |
| **ProForm** | Advanced form with 20+ field types, grid layout, validation, and dynamic options |
| **ProModal** | Advanced modal with drag, edge resizing, and fullscreen toggle |

### Theme System

- 6 preset theme colors: Blue (default), Green, Purple, Red, Orange, Cyan
- Light / Dark / Auto modes
- Independent sidebar theming
- 100+ CSS design tokens

### Internationalization

- Built-in Chinese and English
- Runtime language switching
- Based on vue-i18n, easily extensible

### More Features

- Multi-tab system (KeepAlive caching, context menu, pinned tabs)
- Vertical / Horizontal layout modes
- Mobile responsive design
- Mock data system (powered by faker.js)
- Global keyboard search (`Ctrl+K`)
- Rich text editor (TipTap)
- ECharts integration

## Tech Stack

| Technology | Version | Description |
| --- | --- | --- |
| Vue | 3.4 | Progressive JavaScript framework |
| TypeScript | 5 | Typed JavaScript superset |
| Vite | 5 | Next-gen build tool |
| Pinia | 2 | Vue state management |
| Vue Router | 4 | Official Vue router |
| vue-i18n | 11 | Internationalization plugin |
| antdv-next | 1.x | Ant Design Vue component library |
| Axios | 1.6 | HTTP client |
| ECharts | 5 | Data visualization |
| TipTap | 3 | Rich text editor |

## Browser Compatibility

Supports all modern browsers. IE is not supported.

| Browser | Version |
| --- | --- |
| Chrome | >= 87 |
| Firefox | >= 78 |
| Safari | >= 14 |
| Edge | >= 88 |

## Demo Accounts

| Username | Password | Description |
| --- | --- | --- |
| `admin` | `123456` | Administrator with full permissions |
| `user` | `123456` | Regular user with limited permissions |
