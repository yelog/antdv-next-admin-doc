# User Management Module

## Overview

The user management page maintains accounts, role bindings, and status transitions.

- Route: `/organization/user`
- View: `src/views/system/user/index.vue`
- Permission: `system.user.view`
- API: `src/api/user.ts`

## Core Capabilities

- Paginated user list query
- Keyword filters for username/phone/status
- Create, update, and delete users
- Role assignment and status switching

## Typical Data Structure

```ts
interface UserItem {
  id: string
  username: string
  realName: string
  phone?: string
  email?: string
  status: 'active' | 'inactive'
  roleIds: string[]
}
```

## Implementation Notes

1. Use `ProTable` for listing, filters, and batch actions.
2. Use `ProModal + ProForm` for create/edit dialogs.
3. Always confirm destructive actions.
4. Mask sensitive fields when needed.

## Related Docs

- [Permission](/en/guide/permission)
- [API Integration](/en/guide/api-integration)
- [Examples](/en/guide/examples)
