# Integration Navigation (External Link and IFrame)

## Scenario

The example module demonstrates common admin integration patterns: embedded IFrame and external links.

- Route group: `/examples/external/*`
- Views: `src/views/examples/external/*`

## Integration Modes

1. IFrame embedding for consistent in-app navigation.
2. External link navigation for independent portals.

## Configuration

- Use `meta.externalLink` for external targets.
- Restrict IFrame origins with allowlists and policies.
- Decide current-tab vs new-window behavior explicitly.

## Implementation Notes

- Add fallback UI for third-party downtime.
- Define cross-system auth strategy (SSO or isolated auth).
- Track outbound navigation events for auditing.

## Related Docs

- [Routing](/en/guide/routing)
- [Examples](/en/guide/examples)
