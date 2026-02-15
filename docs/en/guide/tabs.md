# Tabs System

This document details the multi-tab system in Antdv Next Admin, including KeepAlive caching, tab bar operations, context menu, and more.

## Table of Contents

- [Overview](#overview)
- [Basic Configuration](#basic-configuration)
- [KeepAlive Caching](#keepalive-caching)
- [Tab Bar Operations](#tab-bar-operations)
- [Context Menu](#context-menu)
- [Affix Tabs](#affix-tabs)
- [Programmatic Operations](#programmatic-operations)

---

## Overview

The multi-tab system is a core interaction pattern for admin systems, allowing users to open multiple pages and switch between them quickly.

### Features

- ✅ **KeepAlive Caching** - Maintain state when switching pages
- ✅ **Context Menu** - Refresh, close, close others, close all
- ✅ **Affix Tabs** - Important pages stay in tab bar
- ✅ **Drag Sorting** - Support drag to reorder tabs
- ✅ **Cache Control** - Fine-grained page cache management

---

## Basic Configuration

### Route Configuration

Configure tab-related properties in route `meta`:

```typescript
{
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    title: 'Dashboard',
    keepAlive: true,    // Enable caching
    affix: true,        // Fixed tab (cannot close)
  },
}
```

---

## KeepAlive Caching

Vue's `<KeepAlive>` component caches dynamic component state to avoid re-rendering.

### Using Tabs Store

```typescript
import { useTabsStore } from '@/stores/tabs'

const tabsStore = useTabsStore()

// Add cached page
tabsStore.addCachedView('Dashboard')

// Remove cache
tabsStore.removeCachedView('Dashboard')

// Clear all cache
tabsStore.clearCachedViews()
```

### Refresh Page

```typescript
// Refresh current page (clear cache and reload)
tabsStore.refreshTab(route.path)
```

---

## Tab Bar Operations

### Tabs Store API

```typescript
import { useTabsStore } from '@/stores/tabs'

const tabsStore = useTabsStore()

// Add tab
tabsStore.addTab({
  path: '/user/detail/123',
  title: 'User Detail - John',
  name: 'UserDetail',
  keepAlive: true,
  affix: false,
})

// Close tab
tabsStore.closeTab('/user/detail/123')

// Close other tabs
tabsStore.closeOthers('/user/detail/123')

// Close all tabs
tabsStore.closeAll()

// Refresh tab
tabsStore.refreshTab('/user/detail/123')
```

---

## Affix Tabs

Affix tabs cannot be closed and usually include Home, Dashboard, and other important pages.

### Configuration

```typescript
{
  path: '/dashboard',
  name: 'Dashboard',
  meta: {
    title: 'Dashboard',
    affix: true,  // Fixed tab
  },
}
```

---

## Next Steps

- Learn about [Layout System](/en/guide/layout)
- View [Examples](/en/guide/examples)
- Read [State Management](/en/guide/state-management)
