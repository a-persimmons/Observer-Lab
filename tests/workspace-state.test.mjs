import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultWorkspaceState,
  normalizeWorkspaceState,
  readWorkspaceState,
  writeWorkspaceState,
} from "../src/workspaceState.js";

test("a new workspace has no fabricated personal records", () => {
  assert.deepEqual(readWorkspaceState({ getItem: () => null }), defaultWorkspaceState);
});

test("workspace state persists only user-created collections", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const state = writeWorkspaceState(storage, { projects: [{ id: "project-1", title: "我的研究" }], judgments: [], history: [], connections: [] });

  assert.equal(state.projects[0].title, "我的研究");
  assert.equal(readWorkspaceState(storage).projects.length, 1);
});

test("malformed workspace values become safe empty collections", () => {
  assert.deepEqual(normalizeWorkspaceState({ projects: "not-an-array", judgments: null, history: [{}], connections: 4 }), {
    projects: [],
    judgments: [],
    history: [{}],
    connections: [],
  });
});
