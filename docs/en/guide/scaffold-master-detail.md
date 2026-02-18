# Master Detail Scaffold

## Scenario

This example demonstrates list + drawer detail interaction for tickets, approvals, and alert workflows.

- Route: `/examples/master-detail`
- View: `src/views/examples/scaffold/master-detail/index.vue`

## Core Capabilities

- Open detail drawer from table row
- `ProDetail` summary + tab panels
- Timeline log display
- Centralized status mapping

## Implementation Notes

1. Avoid row-click and action-click event conflicts.
2. Use `destroy-on-close=false` for smooth detail interactions.
3. Keep status color/text mappings centralized.

## Related Docs

- [ProDetail](/en/components/pro-detail)
- [ProDescriptions](/en/components/pro-descriptions)
