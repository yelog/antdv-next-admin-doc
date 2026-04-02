# Advanced Filter Scaffold

## Scenario

This example demonstrates a configurable filter builder, suitable for complex searches, audit queries, and operational dashboard filtering.

- Route: `/examples/advanced-filter`
- Page: `src/views/examples/scaffold/advanced-filter/index.vue`

## Core Capabilities

- Condition relation toggle: `AND` / `OR`
- Multi-field + multi-operator combination filtering (string, enum, number, date)
- Dynamic value input components (input, select, multi-select, range)
- Scheme save/restore/delete (Saved Schemes)

## Implementation Best Practices

1. Keep frontend condition structure in one-to-one mapping with backend query DSL.
2. Centrally maintain field configurations (type, operators, options) to avoid scattered logic.
3. Saved schemes need version numbers to identify and downgrade compatibility after field changes.
4. Validate upper/lower bounds for range conditions to avoid invalid requests.

## Recommended Parameter Structure

```json
{
  "relation": "AND",
  "conditions": [
    { "field": "status", "operator": "in", "value": ["active", "pending"] },
    { "field": "score", "operator": "between", "value": 70, "value2": 95 }
  ]
}
```

## Related Documentation

- [JsonInput Component](/en/guide/json-input)
- [I18nInput Component](/en/guide/i18n-input)
- [Examples](/en/guide/examples)
