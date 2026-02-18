# File Management Module

## Overview

File management handles upload, download, preview, and delete operations for attachments.

- Route: `/system/file`
- View: `src/views/system/file/index.vue`
- Permission: `system.file.view`
- API: `src/api/file.ts`

## Core Capabilities

- Upload with progress
- Paginated file list and filters
- Preview and download
- Delete and batch operations

## Implementation Notes

1. Validate type, size, and count before upload.
2. Provide retry for failed uploads.
3. Protect download APIs with proper auth.

## Related Docs

- [API Integration](/en/guide/api-integration)
- [ProUpload](/en/components/pro-upload)
