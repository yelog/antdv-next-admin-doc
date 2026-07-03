# JsonInput 层级拖拽实现方案

## 一、方案概述

### 目标

为 JsonInput 组件添加跨层级拖拽能力，支持将字段从一个对象节点拖拽到另一个嵌套对象节点，同时保留当前的同级排序功能。

### 设计原则

1. **渐进增强** - 在现有 vuedraggable 基础上扩展，不破坏现有功能
2. **直觉交互** - 采用行业内成熟的交互模式（水平方向触发层级变化）
3. **安全优先** - 完善的验证和回滚机制，防止非法操作
4. **视觉清晰** - 明确的拖拽指示和层级反馈

---

## 二、交互模式设计

### 2.1 三种拖拽操作

```
┌─────────────────────────────────────────────────────────────────┐
│                    拖拽操作示意图                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 同级排序（上下移动）                                         │
│     ┌──────────┐                                                │
│     │ 字段 A   │  ↑ 上移                                        │
│     ├──────────┤                                                │
│     │ 字段 B   │  ← 当前位置                                    │
│     ├──────────┤                                                │
│     │ 字段 C   │  ↓ 下移                                        │
│     └──────────┘                                                │
│                                                                 │
│  2. 提升层级（左移超过阈值）                                     │
│                                                                 │
│     parent:                                                     │
│       child1:                                                   │
│         field_a: "value"  ←── 左移 ──→  field_a: "value"        │
│         field_b: "value"                  child1:                │
│                                            field_b: "value"     │
│                                                                 │
│  3. 降低层级（右移超过阈值）                                     │
│                                                                 │
│     parent:                                                     │
│       child1: {}                                                │
│       field_a: "value"  ←── 右移 ──→  child1:                   │
│       field_b: "value"                    field_a: "value"      │
│                                           field_b: "value"      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 视觉反馈

| 状态 | 视觉表现 |
|------|----------|
| 拖拽中（同级） | 半透明 ghost + 水平插入指示线 |
| 拖拽中（左移） | 显示"提升"箭头指示 + 目标层级高亮 |
| 拖拽中（右移） | 显示"降低"箭头指示 + 目标容器高亮 |
| 非法操作 | 红色禁止图标 + 震动反馈 |

---

## 三、技术实现方案

### 3.1 核心改动点

#### 3.1.1 JsonFieldTreeList.vue 改动

```typescript
// 扩展拖拽事件载荷
interface DragStartPayload {
  path: string[];
  oldIndex?: number;
  clientX: number;      // 新增：记录起始 X 坐标
  clientY: number;      // 新增：记录起始 Y 坐标
}

interface DragEndPayload {
  path: string[];
  oldIndex?: number;
  newIndex?: number;
  clientX: number;      // 新增：记录结束 X 坐标
  clientY: number;      // 新增：记录结束 Y 坐标
}
```

**模板改动**：

```html
<draggable
  v-model="fieldOrder"
  :item-key="getFieldItemKey"
  handle=".drag-handle"
  :group="dragGroup"
  :animation="150"
  :fallback-on-body="true"
  :swap-threshold="0.65"
  class="field-list"
  @start="handleDragStart"
  @end="handleDragEnd"
  @add="handleDragAdd"
  @remove="handleDragRemove"
>
```

**新增 props**：

```typescript
const props = defineProps({
  // ... 现有 props
  dragGroup: {
    type: String,
    default: 'json-tree',  // 所有层级共享同一 group
  },
  maxDepth: {
    type: Number,
    default: 8,  // 最大嵌套深度
  },
});
```

**新增事件**：

```typescript
const emit = defineEmits<{
  // ... 现有事件
  (e: 'drag-add', payload: DragAddPayload): void;
  (e: 'drag-remove', payload: DragRemovePayload): void;
}>();
```

#### 3.1.2 index.vue 改动

**新增状态变量**：

```typescript
// 拖拽快照（用于回滚）
const dragSnapshot = ref<{
  data: JsonObject;
  fieldOrderMap: Record<string, string[]>;
  expandedPathKeys: string[];
} | null>(null);

// 拖拽起始信息
const dragStartInfo = ref<{
  path: string[];
  fieldKey: string;
  clientX: number;
  clientY: number;
} | null>(null);

// 层级变化阈值（像素）
const INDENT_THRESHOLD = 24;

// 最大嵌套深度
const MAX_DEPTH = 8;
```

**核心函数**：

```typescript
// 1. 拖拽开始 - 保存快照
function onDragStart(payload: DragStartPayload) {
  if (payload.oldIndex === undefined) {
    draggingFieldPathKey.value = "";
    return;
  }

  const currentOrder = getFieldOrderByPath(payload.path);
  const fieldKey = currentOrder[payload.oldIndex];

  if (!fieldKey) {
    draggingFieldPathKey.value = "";
    return;
  }

  draggingFieldPathKey.value = getFieldPathKey(payload.path, fieldKey);

  // 保存快照用于回滚
  dragSnapshot.value = {
    data: JSON.parse(JSON.stringify(editData.value)),
    fieldOrderMap: JSON.parse(JSON.stringify(fieldOrderMap.value)),
    expandedPathKeys: [...expandedPathKeys.value],
  };

  dragStartInfo.value = {
    path: [...payload.path],
    fieldKey,
    clientX: payload.clientX,
    clientY: payload.clientY,
  };
}

// 2. 拖拽结束 - 处理层级变化
function onDragEnd(payload: DragEndPayload) {
  draggingFieldPathKey.value = "";

  if (!dragStartInfo.value) {
    return;
  }

  const deltaX = payload.clientX - dragStartInfo.value.clientX;
  const sourcePath = dragStartInfo.value.path;
  const fieldKey = dragStartInfo.value.fieldKey;

  // 判断是否需要层级调整
  if (Math.abs(deltaX) >= INDENT_THRESHOLD) {
    if (deltaX < 0) {
      // 左移 - 提升层级
      promoteField(sourcePath, fieldKey);
    } else {
      // 右移 - 降低层级
      demoteField(sourcePath, fieldKey, payload.oldIndex);
    }
  }

  dragStartInfo.value = null;
  dragSnapshot.value = null;
}

// 3. 提升字段层级
function promoteField(sourcePath: string[], fieldKey: string) {
  // 不能提升根级字段
  if (sourcePath.length === 0) {
    message.warning("根级字段无法继续提升");
    rollbackDrag();
    return;
  }

  const sourceObj = getObjectByPath(sourcePath);
  if (!sourceObj || !Object.prototype.hasOwnProperty.call(sourceObj, fieldKey)) {
    rollbackDrag();
    return;
  }

  // 获取父级路径
  const parentPath = sourcePath.slice(0, -1);
  const parentKey = sourcePath[sourcePath.length - 1];
  const parentObj = getObjectByPath(parentPath);

  if (!parentObj) {
    rollbackDrag();
    return;
  }

  // 检查重名
  if (Object.prototype.hasOwnProperty.call(parentObj, fieldKey)) {
    message.warning(`父级对象已存在字段 "${fieldKey}"`);
    rollbackDrag();
    return;
  }

  // 执行提升
  const fieldValue = sourceObj[fieldKey];
  delete sourceObj[fieldKey];
  parentObj[fieldKey] = fieldValue;

  // 更新 fieldOrder
  const sourceOrder = getFieldOrderByPath(sourcePath).filter(k => k !== fieldKey);
  setFieldOrderByPath(sourcePath, sourceOrder);

  const parentOrder = getFieldOrderByPath(parentPath);
  // 插入到父级字段（parentKey）后面
  const parentIndex = parentOrder.indexOf(parentKey);
  const newParentOrder = [
    ...parentOrder.slice(0, parentIndex + 1),
    fieldKey,
    ...parentOrder.slice(parentIndex + 1),
  ];
  setFieldOrderByPath(parentPath, newParentOrder);

  // 迁移路径状态
  migratePathState([...sourcePath, fieldKey], [...parentPath, fieldKey]);

  // 展开父级
  setPathExpanded(parentPath, true);
}

// 4. 降低字段层级
function demoteField(sourcePath: string[], fieldKey: string, fieldIndex?: number) {
  const sourceObj = getObjectByPath(sourcePath);
  if (!sourceObj || !Object.prototype.hasOwnProperty.call(sourceObj, fieldKey)) {
    rollbackDrag();
    return;
  }

  // 获取前一个兄弟字段
  const sourceOrder = getFieldOrderByPath(sourcePath);
  const currentIndex = sourceOrder.indexOf(fieldKey);
  const prevSiblingIndex = currentIndex - 1;

  if (prevSiblingIndex < 0) {
    message.warning("没有前一个兄弟字段，无法降低层级");
    rollbackDrag();
    return;
  }

  const prevSiblingKey = sourceOrder[prevSiblingIndex];
  const prevSiblingPath = [...sourcePath, prevSiblingKey];
  const prevSiblingObj = getObjectByPath(prevSiblingPath);

  // 检查前一个兄弟是否为对象类型
  if (!prevSiblingObj || !isPlainObject(prevSiblingObj)) {
    message.warning("前一个兄弟字段必须是对象类型");
    rollbackDrag();
    return;
  }

  // 检查深度限制
  if (sourcePath.length + 1 >= MAX_DEPTH) {
    message.warning(`已达到最大嵌套深度 ${MAX_DEPTH}`);
    rollbackDrag();
    return;
  }

  // 检查重名
  if (Object.prototype.hasOwnProperty.call(prevSiblingObj, fieldKey)) {
    message.warning(`目标对象已存在字段 "${fieldKey}"`);
    rollbackDrag();
    return;
  }

  // 执行降低
  const fieldValue = sourceObj[fieldKey];
  delete sourceObj[fieldKey];
  prevSiblingObj[fieldKey] = fieldValue;

  // 更新 fieldOrder
  const newSourceOrder = sourceOrder.filter(k => k !== fieldKey);
  setFieldOrderByPath(sourcePath, newSourceOrder);

  const targetOrder = getFieldOrderByPath(prevSiblingPath);
  setFieldOrderByPath(prevSiblingPath, [...targetOrder, fieldKey]);

  // 迁移路径状态
  migratePathState([...sourcePath, fieldKey], [...prevSiblingPath, fieldKey]);

  // 展开目标容器
  setPathExpanded(prevSiblingPath, true);
}

// 5. 回滚拖拽操作
function rollbackDrag() {
  if (!dragSnapshot.value) {
    return;
  }

  editData.value = dragSnapshot.value.data;
  fieldOrderMap.value = dragSnapshot.value.fieldOrderMap;
  expandedPathKeys.value = dragSnapshot.value.expandedPathKeys;
  dragSnapshot.value = null;
}

// 6. 迁移路径状态
function migratePathState(oldPath: string[], newPath: string[]) {
  const oldPrefix = serializePath(oldPath);
  const newPrefix = serializePath(newPath);

  // 迁移 fieldOrderMap
  for (const pathKey of Object.keys(fieldOrderMap.value)) {
    if (pathKey === oldPrefix || pathKey.startsWith(oldPrefix + ',')) {
      const newKey = newPrefix + pathKey.slice(oldPrefix.length);
      fieldOrderMap.value[newKey] = fieldOrderMap.value[pathKey];
      delete fieldOrderMap.value[pathKey];
    }
  }

  // 迁移 dynamicTypeMap
  for (const pathKey of Object.keys(dynamicTypeMap.value)) {
    if (pathKey.startsWith(oldPrefix)) {
      const newKey = newPrefix + pathKey.slice(oldPrefix.length);
      dynamicTypeMap.value[newKey] = dynamicTypeMap.value[pathKey];
      delete dynamicTypeMap.value[pathKey];
    }
  }

  // 迁移 arrayTextBuffer
  for (const pathKey of Object.keys(arrayTextBuffer.value)) {
    if (pathKey.startsWith(oldPrefix)) {
      const newKey = newPrefix + pathKey.slice(oldPrefix.length);
      arrayTextBuffer.value[newKey] = arrayTextBuffer.value[pathKey];
      delete arrayTextBuffer.value[pathKey];
    }
  }

  // 迁移 expandedPathKeys
  expandedPathKeys.value = expandedPathKeys.value.map(key => {
    if (key === oldPrefix || key.startsWith(oldPrefix + ',')) {
      return newPrefix + key.slice(oldPrefix.length);
    }
    return key;
  });

  // 迁移 newFieldKeys
  newFieldKeys.value = newFieldKeys.value.map(key => {
    if (key.startsWith(oldPrefix)) {
      return newPrefix + key.slice(oldPrefix.length);
    }
    return key;
  });
}
```

### 3.2 跨列表拖拽支持

当用户直接拖拽到目标容器时（非水平方向触发），需要处理 `add` 和 `remove` 事件：

```typescript
// 处理拖拽添加（从其他列表拖入）
function handleDragAdd(payload: DragAddPayload) {
  const { item, newIndex, from } = payload;
  // 这里需要获取拖拽的字段信息
  // vuedraggable 会自动处理 DOM 移动
  // 我们需要同步更新数据结构
}

// 处理拖拽移除（拖到其他列表）
function handleDragRemove(payload: DragRemovePayload) {
  const { item, oldIndex } = payload;
  // 同步更新源列表的数据
}
```

---

## 四、视觉反馈实现

### 4.1 层级变化指示器

```scss
// 拖拽中的层级变化指示
.field-row {
  &.is-dragging {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 24px;
      background: var(--color-primary);
      border-radius: 2px;
      opacity: 0;
      transition: opacity 0.15s;
    }

    &.can-promote::before {
      opacity: 1;
      left: -8px;
    }

    &.can-demote::before {
      opacity: 1;
      right: -8px;
      left: auto;
    }
  }
}

// 目标容器高亮
.field-input-section {
  .object-field-wrapper {
    transition: all 0.15s;

    &.drop-target {
      border-color: var(--color-primary);
      background: var(--color-primary-bg);
      box-shadow: 0 0 0 2px var(--color-primary-1);
    }
  }
}
```

### 4.2 拖拽 Ghost 样式

```scss
// SortableJS ghost 样式覆盖
.sortable-ghost {
  opacity: 0.4;
  background: var(--color-primary-bg);
}

// 拖拽中的占位符
.sortable-drag {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}
```

---

## 五、验证规则

### 5.1 验证清单

| 规则 | 说明 | 错误提示 |
|------|------|----------|
| 根级提升 | 根级字段无法继续提升 | "根级字段无法继续提升" |
| 重名检查 | 目标对象已存在同名字段 | "目标对象已存在字段 xxx" |
| 深度限制 | 超过最大嵌套深度 | "已达到最大嵌套深度 N" |
| 类型限制 | 降低层级时目标必须是对象 | "前一个兄弟字段必须是对象类型" |
| 循环引用 | 不能拖入自身的子节点 | "不能将字段拖入自身的子节点" |

### 5.2 循环引用检测

```typescript
function isDescendantPath(childPath: string[], parentPath: string[]): boolean {
  if (childPath.length <= parentPath.length) {
    return false;
  }
  return parentPath.every((segment, index) => childPath[index] === segment);
}
```

---

## 六、实现步骤

### 第一阶段：基础跨列表拖拽（1-2 天）

1. 修改 `JsonFieldTreeList.vue`，为所有 `<draggable>` 添加统一的 `group` 配置
2. 扩展事件载荷，添加 `clientX`/`clientY` 坐标
3. 实现基础的跨列表数据同步

### 第二阶段：水平方向层级调整（2-3 天）

1. 实现 `promoteField` 和 `demoteField` 核心函数
2. 实现路径状态迁移逻辑
3. 实现验证和回滚机制

### 第三阶段：视觉反馈（1 天）

1. 添加层级变化指示器样式
2. 优化 ghost 和占位符样式
3. 添加非法操作的视觉反馈

### 第四阶段：测试和优化（1-2 天）

1. 单元测试覆盖核心函数
2. 边界情况测试（深度限制、重名、循环引用）
3. 性能优化和用户体验调优

---

## 七、技术风险和缓解措施

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| vuedraggable 跨列表同步问题 | 数据不一致 | 使用快照 + 回滚机制 |
| 深层嵌套性能 | 渲染卡顿 | 限制最大深度 + 虚拟滚动（可选） |
| 移动端触摸支持 | 无法使用 | 保留右键菜单作为备选 |
| 复杂路径状态迁移 | 状态丢失 | 完善的迁移函数 + 测试覆盖 |

---

## 八、后续扩展

1. **键盘快捷键** - 支持 Tab/Shift+Tab 进行 indent/outdent
2. **批量操作** - 支持多选字段后批量调整层级
3. **撤销/重做** - 基于快照实现完整的撤销重做功能
4. **拖拽到根级** - 支持将嵌套字段拖拽到根级对象
