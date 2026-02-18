# Permission Management Module

## Overview

Permission management maintains permission points (for example `system.user.create`) used by route and button guards.

- Route: `/organization/permission`
- View: `src/views/system/permission/index.vue`
- Permission: `system.permission.view`
- API: `src/api/permission.ts`

## Naming Strategy

- Use `domain.resource.action`, for example `system.user.delete`
- Route-level guard via `requiredPermissions`
- Button-level guard via `v-permission` or `PermissionButton`

## Core Capabilities

- Permission tree maintenance
- Create/update/delete permission points
- Role-permission linkage

## Best Practices

1. Define permission dictionary first.
2. Keep permission keys stable.
3. Treat frontend checks as UX optimization; backend is final authority.

## Related Docs

- [Permission](/en/guide/permission)
- [Routing](/en/guide/routing)
