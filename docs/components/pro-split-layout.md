# ProSplitLayout 分栏布局

左右分栏布局组件，适用于左侧导航树 + 右侧内容的常见后台页面结构。

## 基础用法

```vue
<template>
  <ProSplitLayout :side-width="280">
    <template #side>
      <!-- 左侧导航/树 -->
      <a-tree :tree-data="treeData" />
    </template>
    <template #main>
      <!-- 右侧内容 -->
      <ProTable :columns="columns" :request="loadData" />
    </template>
  </ProSplitLayout>
</template>
```

## 右侧导航

通过 `sidePosition="right"` 将侧栏放到右侧。

```vue
<ProSplitLayout :side-width="240" side-position="right">
  <template #side>
    <div>右侧面板</div>
  </template>
  <template #main>
    <div>主内容区</div>
  </template>
</ProSplitLayout>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| sideWidth | 侧栏宽度 | `number \| string` | `280` |
| sidePosition | 侧栏位置 | `'left' \| 'right'` | `'left'` |
| gap | 两栏间距 | `number \| string` | `16` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| side | 侧栏内容 |
| main | 主内容区 |
| default | 同 main（备用） |

## 使用场景

- 部门管理：左侧组织树 + 右侧部门详情
- 字典管理：左侧字典类型列表 + 右侧字典数据表格
- 系统配置：左侧配置分组 + 右侧配置项列表
