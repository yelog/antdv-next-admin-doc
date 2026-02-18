# RBAC Flow in Practice

## Scenario

The `rbac-flow` example shows the full chain from login to route, button, and data-level permissions.

- Route: `/examples/rbac-flow`
- View: `src/views/examples/scaffold/rbac/index.vue`

## Permission Chain

1. Load user profile, roles, and permissions after login.
2. Generate accessible routes in `permission store`.
3. Control page access with `requiredPermissions`.
4. Control button visibility with `v-permission` / `PermissionButton`.
5. Apply data masking or backend rejection for sensitive fields.

## Naming Convention

- `system.user.view`
- `system.user.create`
- `system.user.edit`
- `system.user.delete`

## Implementation Notes

- Centralize checks in `usePermission`.
- Avoid complex inline template expressions.
- Sync route and UI state after permission changes.

## Validation

- Compare behavior with `admin/123456` and `user/123456`.
- Verify masked fields such as phone/email.

## Related Docs

- [Permission](/en/guide/permission)
- [State Management](/en/guide/state-management)
- [Routing](/en/guide/routing)
