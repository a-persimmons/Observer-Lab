export const WORKSPACE_STATE_KEY = "observer-lab.workspace-state.v1";

export const defaultWorkspaceState = Object.freeze({
  projects: [],
  judgments: [],
  history: [],
  connections: [],
});

function validArray(value) {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];
}

export function normalizeWorkspaceState(value) {
  if (!value || typeof value !== "object") return { ...defaultWorkspaceState };

  return {
    projects: validArray(value.projects),
    judgments: validArray(value.judgments),
    history: validArray(value.history),
    connections: validArray(value.connections),
  };
}

export function readWorkspaceState(storage) {
  if (!storage) return { ...defaultWorkspaceState };

  try {
    const stored = storage.getItem(WORKSPACE_STATE_KEY);
    return stored ? normalizeWorkspaceState(JSON.parse(stored)) : { ...defaultWorkspaceState };
  } catch {
    return { ...defaultWorkspaceState };
  }
}

export function writeWorkspaceState(storage, state) {
  const normalized = normalizeWorkspaceState(state);
  storage?.setItem(WORKSPACE_STATE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatActivityTime(date = new Date()) {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
