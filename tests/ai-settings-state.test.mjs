import assert from "node:assert/strict";
import test from "node:test";
import { defaultAiSettings, readAiSettings, writeAiSettings } from "../src/aiSettingsState.js";

test("AI configuration starts empty but includes five configurable roles", () => {
  const state = readAiSettings({ getItem: () => null });
  assert.equal(state.connections.length, 0);
  assert.equal(state.roles.length, 5);
  assert.equal(state.roles[0].id, "Tutor");
});

test("AI connection and role settings persist only in browser storage", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const saved = writeAiSettings(storage, { ...defaultAiSettings, connections: [{ id: "personal", name: "我的连接", baseUrl: "https://example.test/v1", apiKey: "key" }], roles: defaultAiSettings.roles.map((role) => role.id === "Tutor" ? { ...role, enabled: true, connectionId: "personal", model: "my-model" } : role) });

  assert.equal(saved.connections[0].name, "我的连接");
  assert.equal(readAiSettings(storage).roles[0].model, "my-model");
});
