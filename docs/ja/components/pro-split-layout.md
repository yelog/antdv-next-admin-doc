# ProSplitLayout

A split-panel layout component for the common pattern of side navigation + main content in admin pages.

## Basic Usage

```vue
<template>
  <ProSplitLayout :side-width="280">
    <template #side>
      <!-- Side navigation / tree -->
      <a-tree :tree-data="treeData" />
    </template>
    <template #main>
      <!-- Main content -->
      <ProTable :columns="columns" :request="loadData" />
    </template>
  </ProSplitLayout>
</template>
```

## Right Side Panel

Use `sidePosition="right"` to place the side panel on the right.

```vue
<ProSplitLayout :side-width="240" side-position="right">
  <template #side>
    <div>Right panel</div>
  </template>
  <template #main>
    <div>Main content</div>
  </template>
</ProSplitLayout>
```

## API

### Props

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| sideWidth | Side panel width | `number \| string` | `280` |
| sidePosition | Side panel position | `'left' \| 'right'` | `'left'` |
| gap | Gap between panels | `number \| string` | `16` |

### Slots

| Slot | Description |
|------|-------------|
| side | Side panel content |
| main | Main content area |
| default | Alias for main |

## Use Cases

- Department management: org tree on the left + department details on the right
- Dictionary management: dict type list on the left + dict data table on the right
- System config: config groups on the left + config items on the right
