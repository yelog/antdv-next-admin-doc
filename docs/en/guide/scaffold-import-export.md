# Import / Export Scaffold

## Scenario

This example demonstrates the complete workflow for CSV template download, data import validation, result statistics, and error report export.

- Route: `/examples/import-export`
- Page: `src/views/examples/scaffold/import-export/index.vue`

## Core Capabilities

- Import template download (unified field headers)
- CSV import parsing and field validation (required, numeric range, integer validation)
- Incremental update by business key (update if exists, create if not)
- Import summary statistics (total, success, updated, failed)
- Error report export (row number + reason + original content)

## Implementation Best Practices

1. Define a unique key (e.g., `code`) to standardize "create/update" logic.
2. Validation failures should return precise row numbers for easy correction.
3. Validate template version before import to avoid field mismatches with legacy templates.
4. For large-scale imports, switch to async tasks with progress tracking.

## Recommended Workflow

1. Download template and fill in data.
2. Upload CSV and validate headers first.
3. Parse and validate each row's field legality.
4. Summarize success/failure results and notify user.
5. Export error report for secondary correction and re-import.

## Related Documentation

- [Utilities](/en/guide/utils)
- [ProTable Advanced Scaffold](/en/guide/scaffold-pro-table-advanced)
- [API Integration](/en/guide/api-integration)
