# Dictionary Management Module

## Overview

Dictionary management maintains static options and status mappings grouped by dictionary types.

- Route: `/system/dict`
- View: `src/views/system/dict/index.vue`
- Permission: `system.dict.view`
- API: `src/api/dict.ts`

## Core Capabilities

- Dictionary type management
- Dictionary item maintenance (`label/value`)
- Status and ordering
- Frontend cache reuse (`dict store`)

## Best Practices

1. Keep dictionary `value` stable and language-agnostic.
2. Preload high-frequency dictionaries after login.
3. Reuse dictionary options in `ProTable/ProForm`.

## Related Docs

- [State Management](/en/guide/state-management)
- [Utils](/en/guide/utils)
