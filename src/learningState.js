export const LEARNING_STATE_KEY = "observer-lab.learning-state.v1";

export const defaultLearningState = Object.freeze({
  startedAt: null,
  currentWeek: 1,
  currentStep: 0,
  completedWeeks: 0,
  completedTrainingDates: [],
});

export function normalizeLearningState(value) {
  if (!value || typeof value !== "object") return { ...defaultLearningState };

  return {
    startedAt: typeof value.startedAt === "string" ? value.startedAt : null,
    currentWeek: Number.isInteger(value.currentWeek) && value.currentWeek >= 1 && value.currentWeek <= 12 ? value.currentWeek : 1,
    currentStep: Number.isInteger(value.currentStep) && value.currentStep >= 0 && value.currentStep <= 7 ? value.currentStep : 0,
    completedWeeks: Number.isInteger(value.completedWeeks) && value.completedWeeks >= 0 && value.completedWeeks <= 12 ? value.completedWeeks : 0,
    completedTrainingDates: Array.isArray(value.completedTrainingDates)
      ? value.completedTrainingDates.filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
      : [],
  };
}

export function readLearningState(storage) {
  if (!storage) return { ...defaultLearningState };

  try {
    const stored = storage.getItem(LEARNING_STATE_KEY);
    return stored ? normalizeLearningState(JSON.parse(stored)) : { ...defaultLearningState };
  } catch {
    return { ...defaultLearningState };
  }
}

export function writeLearningState(storage, state) {
  const normalized = normalizeLearningState(state);
  storage?.setItem(LEARNING_STATE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 5) return "夜深了";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  return "晚上好";
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatSnapshotDate(date = new Date()) {
  const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()];
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日 · ${weekday}训练快照`;
}

export function buildWeekRhythm(date = new Date(), completedDates = []) {
  const mondayOffset = (date.getDay() + 6) % 7;
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - mondayOffset);
  const todayKey = getLocalDateKey(date);
  const completed = new Set(completedDates);
  const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  return weekdays.map((day, index) => {
    const itemDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index);
    const key = getLocalDateKey(itemDate);
    return {
      day,
      date: `${itemDate.getMonth() + 1}/${itemDate.getDate()}`,
      status: completed.has(key) ? "done" : key === todayKey ? "today" : "empty",
    };
  });
}

export function getCourseStatus(week, state) {
  if (week <= state.completedWeeks) return "done";
  if (week === state.currentWeek) return state.startedAt ? "active" : "next";
  return "locked";
}
