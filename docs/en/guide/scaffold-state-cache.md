# State Cache Scaffold

## Scenario

This example demonstrates state caching with Pinia persistence, `KeepAlive`, and tab pinning.

- Route: `/examples/state-cache`
- View: `src/views/examples/scaffold/state-cache/index.vue`

## Core Capabilities

- Persist form inputs with `demoStateCache` store
- Cache local panel states with `keep-alive`
- Pin current tab with `tabs` store
- Reset and restore flows

## Implementation Notes

1. Separate persistent state from transient UI state.
2. Add TTL and schema version for cached data.
3. Use `keepAlive` selectively to control memory growth.

## Related Docs

- [State Management](/en/guide/state-management)
- [Tabs System](/en/guide/tabs)
