# JsonInput Horizontal Drag Hierarchy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `JsonInput` adjust field hierarchy from horizontal mouse movement during drag, instead of requiring explicit drop zones.

**Architecture:** Keep `vuedraggable` responsible for vertical ordering. Capture drag start/end pointer X coordinates in `JsonFieldTreeList`, then let `JsonInput/index.vue` translate horizontal movement into a structural intent: left movement promotes one level, right movement demotes under the previous same-level object. The parent component remains the source of truth for JSON mutation, validation, rollback, and path-state migration.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, `vuedraggable`, Antdv Next, VitePress docs.

---

### Task 1: Capture Horizontal Drag Intent

**Files:**
- Modify: `antdv-next-admin/src/components/JsonInput/JsonFieldTreeList.vue`

**Steps:**
- Extend drag payloads with `clientX`.
- Remove the temporary footer drop zone UI.
- Keep drag handle-only dragging.

### Task 2: Convert Horizontal Movement to Hierarchy Changes

**Files:**
- Modify: `antdv-next-admin/src/components/JsonInput/index.vue`

**Steps:**
- Add an indent threshold constant, initially `24` pixels.
- If horizontal movement is less than the threshold, preserve normal sort/cross-list behavior.
- If the pointer moves left by at least one threshold, promote the field to its parent object's parent.
- If the pointer moves right by at least one threshold, demote the field under the previous same-level object when that object is an object field.
- Validate duplicate keys, self/descendant moves, and missing objects.
- Roll back invalid structural moves.

### Task 3: Keep State Migration Correct

**Files:**
- Modify: `antdv-next-admin/src/components/JsonInput/index.vue`

**Steps:**
- Reuse existing path-prefix migration helpers.
- Move the actual JSON value once per drag.
- Update source and target field orders consistently.

### Task 4: Update Documentation

**Files:**
- Modify: `antdv-next-admin-doc/docs/guide/json-input.md`
- Modify: `antdv-next-admin-doc/docs/en/guide/json-input.md`

**Steps:**
- Document vertical drag as ordering.
- Document left drag as promoting one level.
- Document right drag as demoting under the previous object sibling.

### Task 5: Verify

**Files:**
- Package: `antdv-next-admin/`

**Steps:**
- Run `npm run type-check`.
- Run `npm run lint`.
