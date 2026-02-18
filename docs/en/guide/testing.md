# Testing Strategy

## Current State

The project contains test templates, but a full runner setup is not enabled by default.

- Unit template: `tests/unit/keyword-search.spec.ts`
- E2E template: `tests/e2e/login-and-filter.spec.ts`

## Recommended Layers

1. Unit tests for utility and pure logic functions.
2. Component tests for form interactions and rendering behavior.
3. E2E tests for login, routing, and key business flows.

## Minimal Adoption Path

1. Start with stable unit tests for core utils.
2. Add critical E2E cases (login, permission, CRUD).
3. Run tests in CI for pull requests.

## Suggested Cases

- `auth`: login success/failure and logout.
- `permission`: role-based menu/button differences.
- `system.user`: create, edit, delete, and filters.
- `request-auth`: 401 refresh and concurrent retry.

## Related Docs

- [Development Workflow](/en/guide/development-workflow)
- [FAQ](/en/guide/faq)
