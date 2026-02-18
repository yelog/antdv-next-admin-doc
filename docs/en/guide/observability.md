# Observability in Practice

## Scenario

The `observability` example demonstrates request state modeling, error classification, and event tracking.

- Route: `/examples/observability`
- View: `src/views/examples/scaffold/observability/index.vue`

## State Model

Use a unified state model:

- `idle`: request not started
- `loading`: request in progress
- `success`: success with data
- `empty`: success with empty data
- `error`: request failed

## Error Layers

- Network errors: timeout, connection issues.
- Auth errors: 401/403 or token invalidation.
- Business errors: non-success business code.

## Implementation Notes

1. Centralize error classification.
2. Provide retry actions for failures.
3. Track critical events and failure counts.
4. Separate user-facing errors from log-only errors.

## Related Docs

- [API Integration](/en/guide/api-integration)
- [FAQ](/en/guide/faq)
