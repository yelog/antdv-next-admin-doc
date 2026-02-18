# Role Management Module

## Overview

Role management maintains role definitions and permission sets in the RBAC model.

- Route: `/organization/role`
- View: `src/views/system/role/index.vue`
- Permission: `system.role.view`
- API: `src/api/role.ts`

## Core Capabilities

- Paginated role query
- Create/update/delete roles
- Bind menu and button permissions
- Role status management

## Implementation Notes

- Prefer a tree-selection interaction for permission assignment.
- Protect super admin roles from accidental deletion.
- Refresh permission state after role updates.

## Related Docs

- [Permission](/en/guide/permission)
- [State Management](/en/guide/state-management)
