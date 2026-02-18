# Upload System Scaffold

## Scenario

This example demonstrates upload orchestration: drag upload, progress feedback, retry, and preview.

- Route: `/examples/upload-system`
- View: `src/views/examples/scaffold/upload-system/index.vue`

## Core Capabilities

- Drag-and-drop upload with `a-upload-dragger`
- Custom upload pipeline via `customRequest`
- Failure simulation and retry
- Image preview and clear-all actions

## Implementation Notes

1. Standardize upload states: `uploading/done/error`.
2. Extract retry logic for single and batch files.
3. Validate type and size before upload.
4. Sync uploaded file references to business entities.

## Related Docs

- [ProUpload](/en/components/pro-upload)
- [API Integration](/en/guide/api-integration)
