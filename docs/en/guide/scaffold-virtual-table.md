# Virtual Table Scaffold

## Scenario

This example demonstrates virtual scrolling for large datasets, suitable for browsing and filtering thousands to tens of thousands of rows.

- Route: `/examples/virtual-table`
- Page: `src/views/examples/scaffold/virtual-table/index.vue`

## Core Capabilities

- Virtual scrolling to reduce initial render and scrolling overhead
- Fixed height container with on-demand rendering for visible area
- Integration with filter conditions and pagination parameters
- Consistent row styles and status tags

## Performance Best Practices

1. Keep row height stable to avoid scrolling jitter from dynamic heights.
2. Keep single-row rendering logic as pure functions to reduce reactive dependencies.
3. Apply debouncing to high-frequency filter inputs to avoid continuous re-calculation.
4. Truncate large content fields in list view; expand in detail view.

## Related Documentation

- [ProTable Advanced Scaffold](/en/guide/scaffold-pro-table-advanced)
- [ProTable Component](/en/components/pro-table)
