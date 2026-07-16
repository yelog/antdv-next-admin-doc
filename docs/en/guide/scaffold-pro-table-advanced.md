# ProTable Advanced Scaffold

## Scenario

This example demonstrates production-style ProTable usage: query, batch actions, export, and status switch.

- Route: `/examples/pro-table-advanced`
- View: `src/views/examples/scaffold/pro-table-advanced/index.vue`

## Core Capabilities

- Column config and value-type rendering
- Query form + pagination flow
- Interactive 2/3/4/5 search-field layout control
- Batch selection, disable, and delete
- Toolbar export and column settings

## Reuse Notes

The layout control directly updates the real ProTable search configuration:

```vue
<ProTable
  :search="{
    formItems: searchFormItems,
    columnsPerRow: searchColumnsPerRow,
    collapsedRows: 1,
  }"
/>
```

It is local demo state and is not persisted as a user preference. Set the project default through `appDefaultSettings.proTable.search.columnsPerRow`.

1. Extract column definitions into reusable modules.
2. Standardize confirm/toast flow for batch actions.
3. Keep export filters aligned with current query state.

## Related Docs

- [ProTable](/en/components/pro-table)
- [Examples](/en/guide/examples)
