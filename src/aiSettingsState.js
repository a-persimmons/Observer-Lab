export const AI_SETTINGS_STATE_KEY = "observer-lab.ai-settings.v1";

export const roleDefinitions = [
  ["Tutor", "导师", "逐问引导，先让你形成自己的答案", 0.3],
  ["Coach", "教练", "安排节奏、反思与迁移训练", 0.5],
  ["Researcher", "研究员", "比较来源并提出证据候选", 0.2],
  ["Critic", "反方", "攻击假设、遗漏变量与证据薄弱点", 0.7],
  ["Auditor", "审计员", "检查结构、引用与复盘质量", 0.1],
];

export const defaultAiSettings = Object.freeze({
  connections: [],
  roles: roleDefinitions.map(([id, name, mission, temperature]) => ({ id, name, mission, connectionId: "", model: "", temperature, context: 12000, web: false, enabled: false, systemPrompt: "" })),
  defaultConnectionId: "",
  defaultSystemPrompt: "",
});

function validArray(value) {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];
}

export function normalizeAiSettings(value) {
  const source = value && typeof value === "object" ? value : {};
  const rolesById = new Map(validArray(source.roles).map((role) => [role.id, role]));

  return {
    connections: validArray(source.connections),
    roles: roleDefinitions.map(([id, name, mission, temperature]) => ({
      ...defaultAiSettings.roles.find((role) => role.id === id),
      ...rolesById.get(id),
      id,
      name,
      mission,
      temperature: Number.isFinite(Number(rolesById.get(id)?.temperature)) ? Number(rolesById.get(id).temperature) : temperature,
      context: Number.isFinite(Number(rolesById.get(id)?.context)) ? Number(rolesById.get(id).context) : 12000,
      web: Boolean(rolesById.get(id)?.web),
      enabled: Boolean(rolesById.get(id)?.enabled),
    })),
    defaultConnectionId: typeof source.defaultConnectionId === "string" ? source.defaultConnectionId : "",
    defaultSystemPrompt: typeof source.defaultSystemPrompt === "string" ? source.defaultSystemPrompt : "",
  };
}

export function readAiSettings(storage) {
  if (!storage) return normalizeAiSettings();
  try {
    const stored = storage.getItem(AI_SETTINGS_STATE_KEY);
    return stored ? normalizeAiSettings(JSON.parse(stored)) : normalizeAiSettings();
  } catch {
    return normalizeAiSettings();
  }
}

export function writeAiSettings(storage, state) {
  const normalized = normalizeAiSettings(state);
  storage?.setItem(AI_SETTINGS_STATE_KEY, JSON.stringify(normalized));
  return normalized;
}
