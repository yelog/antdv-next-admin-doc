# Log Management Module

## Overview

Log management tracks operation and system events for auditing and troubleshooting.

- Route: `/system/log`
- View: `src/views/system/log/index.vue`
- Permission: `system.log.view`
- API: `src/api/log.ts`

## Core Capabilities

- Operation log query
- Login log query
- Filters (user/module/time)
- Export and archive (optional)

## Implementation Notes

- Use backend pagination for large log volumes.
- Keep longer retention for high-risk events.
- Provide quick filters for failures and exceptions.

## Related Docs

- [FAQ](/en/guide/faq)
- [Examples](/en/guide/examples)
