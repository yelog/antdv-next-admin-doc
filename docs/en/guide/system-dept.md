# Department Management Module

## Overview

Department management maintains organization hierarchy, typically in a tree structure.

- Route: `/organization/dept`
- View: `src/views/system/dept/index.vue`
- Permission: `system.dept.view`
- API: `src/api/dept.ts`

## Core Capabilities

- Department tree load
- Create/update/delete departments
- Parent-child relation maintenance
- Manager and code binding

## UI Notes

- A master-detail layout (left tree + right detail) works well.
- Check child nodes before deleting parent nodes.
- Provide quick search by department name.

## Related Docs

- [ProSplitLayout](/en/components/pro-split-layout)
- [Examples](/en/guide/examples)
