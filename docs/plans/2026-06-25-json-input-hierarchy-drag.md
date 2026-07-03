# JsonInput Hierarchy Drag Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add one-step drag-and-drop hierarchy adjustment to `JsonInput` while preserving the current single-column editor experience.

**Architecture:** Keep the existing recursive `JsonFieldTreeList` rendering and enable cross-list dragging through a shared `vuedraggable` group. Centralize structural validation, rollback, data movement, and path-state migration in `JsonInput/index.vue` so child lists remain presentational.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, `vuedraggable`, Antdv Next, VitePress docs.

---

### Task 1: Enable Cross-Level Drag Events

**Files:**
- Modify: `antdv-next-admin/src/components/JsonInput/JsonFieldTreeList.vue`

**Steps:**
- Add a shared draggable group when `allowSort` is enabled.
- Emit drag metadata including source path, target path, old index, and new index.
- Keep drag initiation restricted to `.drag-handle`.

### Task 2: Implement Structural Move Orchestration

**Files:**
- Modify: `antdv-next-admin/src/components/JsonInput/index.vue`

**Steps:**
- Snapshot editor state at drag start.
- On drag end, detect same-parent reorder versus cross-parent move.
- Validate illegal moves: self/descendant target and duplicate keys in target parent.
- Move the real JSON value for cross-parent drops.
- Update field order for source and target parents.
- Migrate path-keyed state for moved subtrees.
- Roll back on invalid drops.

### Task 3: Add Drag Feedback Polish

**Files:**
- Modify: `antdv-next-admin/src/components/JsonInput/JsonFieldTreeList.vue`

**Steps:**
- Show a visual empty-object drop zone.
- Keep current row highlighting and drag handle behavior.

### Task 4: Update Documentation

**Files:**
- Modify: `antdv-next-admin-doc/docs/guide/json-input.md`
- Modify: `antdv-next-admin-doc/docs/en/guide/json-input.md`

**Steps:**
- Replace same-parent-only drag documentation.
- Document cross-parent hierarchy moves and conflict rules.

### Task 5: Verify

**Files:**
- Package: `antdv-next-admin/`

**Steps:**
- Run `npm run type-check`.
- If type-check fails due unrelated existing issues, report exact blocker.
