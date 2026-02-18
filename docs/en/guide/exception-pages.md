# Exception Pages (403/404/500)

## Scenario

Exception pages handle forbidden, not found, and server error scenarios to avoid blank screens.

- Routes: `/examples/exception/403|404|500`
- Views: `src/views/examples/exception/*.vue`

## Design Goals

- 403: explain missing permission and provide return actions.
- 404: explain missing page and provide recovery navigation.
- 500: explain service failure and provide retry actions.

## Integration Notes

1. Handle forbidden access in route guards.
2. Redirect unmatched routes to `404`.
3. Route global runtime failures to `500` or a safe error view.

## Related Docs

- [Routing](/en/guide/routing)
- [FAQ](/en/guide/faq)
