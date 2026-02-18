# Complex Form Scaffold

## Scenario

This example demonstrates multi-step form workflows with async validation, draft save, and dynamic rule lists.

- Route: `/examples/complex-form`
- View: `src/views/examples/scaffold/complex-form/index.vue`

## Core Capabilities

- `ProStepForm` multi-step flow
- Async validation
- Dynamic rule item add/remove
- Draft save and restore

## Implementation Notes

1. Validate step-by-step to reduce blocking.
2. Provide default rule rows with clear errors.
3. Add schema versioning for draft data.

## Related Docs

- [ProStepForm](/en/components/pro-step-form)
- [ProForm](/en/components/pro-form)
