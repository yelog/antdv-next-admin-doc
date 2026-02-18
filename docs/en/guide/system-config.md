# System Configuration Module

## Overview

System configuration manages site-level parameters such as switches, thresholds, and defaults.

- Route: `/system/config`
- View: `src/views/system/config/index.vue`
- Permission: `system.config.view`
- API: `src/api/config.ts`

## Core Capabilities

- Grouped configuration listing
- Create/update/delete config entries
- Boolean/text/number setting support
- Change auditing (recommended)

## Implementation Notes

- Add confirmation for risky updates.
- Add extra validation for critical values.
- Plan export/rollback for key configs.

## Related Docs

- [Deployment](/en/guide/deployment)
- [API Integration](/en/guide/api-integration)
