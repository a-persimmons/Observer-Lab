import assert from "node:assert/strict";
import test from "node:test";
import {
  buildWeekRhythm,
  defaultLearningState,
  formatSnapshotDate,
  getCourseStatus,
  getGreeting,
  readLearningState,
} from "../src/learningState.js";

test("a new user starts at week 1 with no fabricated progress", () => {
  const state = readLearningState({ getItem: () => null });

  assert.deepEqual(state, defaultLearningState);
  assert.equal(getCourseStatus(1, state), "next");
  assert.equal(getCourseStatus(2, state), "locked");
});

test("greeting follows the visitor's local hour", () => {
  assert.equal(getGreeting(new Date(2026, 7, 13, 8)), "早上好");
  assert.equal(getGreeting(new Date(2026, 7, 13, 11)), "上午好");
  assert.equal(getGreeting(new Date(2026, 7, 13, 13)), "中午好");
  assert.equal(getGreeting(new Date(2026, 7, 13, 16)), "下午好");
  assert.equal(getGreeting(new Date(2026, 7, 13, 21)), "晚上好");
});

test("snapshot and weekly rhythm use the current local date", () => {
  const now = new Date(2026, 7, 13, 10);
  const week = buildWeekRhythm(now, []);

  assert.equal(formatSnapshotDate(now), "2026 年 8 月 13 日 · 周四训练快照");
  assert.deepEqual(week.map(({ day, date, status }) => [day, date, status]), [
    ["周一", "8/10", "empty"],
    ["周二", "8/11", "empty"],
    ["周三", "8/12", "empty"],
    ["周四", "8/13", "today"],
    ["周五", "8/14", "empty"],
    ["周六", "8/15", "empty"],
    ["周日", "8/16", "empty"],
  ]);
});
