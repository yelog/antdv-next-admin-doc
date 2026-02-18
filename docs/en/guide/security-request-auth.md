# Request Auth and Token Refresh

## Scenario

The `request-auth` example demonstrates how to refresh access tokens and replay failed requests.

- Route: `/examples/request-auth`
- View: `src/views/examples/scaffold/request-auth/index.vue`

## Flow

1. Send requests with `accessToken`.
2. On `401`, enter refresh flow.
3. If refresh is in progress, queue subsequent requests.
4. Replay requests after refresh success; require relogin on failure.

## Key Implementation Points

- Use a shared `refreshPromise` to avoid duplicate refresh calls.
- Resolve queued requests after refresh completion.
- Clear tokens and surface relogin state on refresh failure.

## Common Risks

- Refresh endpoint returning `401` repeatedly.
- Race conditions overwriting tokens.
- Replayed non-idempotent writes causing duplicates.

## Best Practices

- Add retry limits for refresh logic.
- Add idempotency for critical write APIs.
- Record `401 -> refresh -> retry` chain in logs.

## Related Docs

- [API Integration](/en/guide/api-integration)
- [Permission](/en/guide/permission)
