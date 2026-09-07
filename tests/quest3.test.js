import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

import { User, Task, UrgentTask } from "../src/models.js";
import {
  buildTasksUrl,
  fetchCurrentUser,
  fetchTasks,
  createTaskInstances,
  summarizeTasks,
  rankTasks,
} from "../src/taskService.js";
import { renderUser, renderTaskList, renderStats } from "../src/ui.js";

import "../mock/mockFetch.js";

const BASE_URL = "http://quest3.local/api";

function makeDocument() {
  const dom = new JSDOM(`
    <!doctype html>
    <html><body>
      <div id="user-name"></div>
      <div id="user-email"></div>
      <div id="stat-total"></div>
      <div id="stat-completed"></div>
      <div id="stat-active"></div>
      <div id="stat-urgent"></div>
      <div id="task-list"></div>
    </body></html>
  `);
  return dom.window.document;
}

test("1) User stores private email and supports controlled updates", () => {
  const user = new User(7, "Jordan Lee", "jordan@example.com");
  assert.equal(user.id, 7);
  assert.equal(user.name, "Jordan Lee");
  assert.equal(user.getEmail(), "jordan@example.com");
  user.updateEmail("new@example.com");
  assert.equal(user.getEmail(), "new@example.com");
  assert.throws(() => user.updateEmail("   "), Error);
  assert.equal(Object.prototype.hasOwnProperty.call(user, "email"), false);
});

test("2) Task manages completion state through an instance method", () => {
  const task = new Task(1, "Review PR", "active", "high", 7);
  assert.equal(task.isCompleted, false);
  assert.equal(task.status, "active");
  const result = task.markCompleted();
  assert.equal(result, "completed");
  assert.equal(task.status, "completed");
  assert.equal(task.isCompleted, true);
});

test("3) UrgentTask inherits Task behavior and exposes escalation label", () => {
  const task = new UrgentTask(4, "Fix checkout", "active", "urgent", 7, "Checkout errors reported");
  assert.ok(task instanceof Task);
  assert.ok(task instanceof UrgentTask);
  assert.equal(task.getEscalationLabel(), "URGENT: Checkout errors reported");
  task.markCompleted();
  assert.equal(task.isCompleted, true);
});

test("4) buildTasksUrl preserves paths and adds supplied query parameters", () => {
  const options = { ownerId: 7, status: "active", priority: "high", limit: 3 };
  const original = { ...options };
  const url = buildTasksUrl("  http://quest3.local/api///  ", options);

  assert.ok(url instanceof URL);
  assert.equal(url.pathname, "/api/tasks");
  assert.equal(url.searchParams.get("ownerId"), "7");
  assert.equal(url.searchParams.get("status"), "active");
  assert.equal(url.searchParams.get("priority"), "high");
  assert.equal(url.searchParams.get("limit"), "3");
  assert.deepEqual(options, original);
});

test("5) fetchCurrentUser and fetchTasks parse mock API data", async () => {
  const user = await fetchCurrentUser(BASE_URL);
  assert.equal(user.name, "Jordan Lee");

  const tasks = await fetchTasks(BASE_URL, { ownerId: 7, status: "active" });
  assert.ok(Array.isArray(tasks));
  assert.ok(tasks.length > 0);
  assert.ok(tasks.every((task) => task.ownerId === 7));
  assert.ok(tasks.every((task) => task.status === "active"));
});

test("6) createTaskInstances returns actual Task subclasses", () => {
  const raw = [
    { id: 1, title: "Normal", status: "active", priority: "high", ownerId: 7 },
    { id: 2, title: "Urgent", status: "active", priority: "urgent", ownerId: 7, escalationNote: "Escalate now" },
  ];
  const copy = structuredClone(raw);
  const tasks = createTaskInstances(raw);

  assert.equal(tasks.length, 2);
  assert.ok(tasks[0] instanceof Task);
  assert.ok(!(tasks[0] instanceof UrgentTask));
  assert.ok(tasks[1] instanceof UrgentTask);
  assert.deepEqual(raw, copy);
});

test("7) summarizeTasks calculates totals from task state", () => {
  const tasks = [
    new Task(1, "A", "active", "high", 7),
    new Task(2, "B", "completed", "low", 7),
    new UrgentTask(3, "C", "active", "urgent", 7, "Now"),
    new UrgentTask(4, "D", "completed", "urgent", 7, "Now"),
  ];

  assert.deepEqual(summarizeTasks(tasks), {
    total: 4,
    completed: 2,
    active: 2,
    urgent: 2,
  });
});

test("8) rankTasks sorts a copy by priority and active/completed state", () => {
  const low = new Task(1, "Low", "active", "low", 7);
  const urgentCompleted = new UrgentTask(2, "Urgent done", "completed", "urgent", 7, "Done");
  const high = new Task(3, "High", "active", "high", 7);
  const urgentActive = new UrgentTask(4, "Urgent active", "active", "urgent", 7, "Now");

  const original = [low, urgentCompleted, high, urgentActive];
  const ranked = rankTasks(original);

  assert.deepEqual(ranked.map((task) => task.id), [4, 2, 3, 1]);
  assert.deepEqual(original.map((task) => task.id), [1, 2, 3, 4]);
  assert.notEqual(ranked, original);
});

test("9) renderUser writes values to expected DOM elements", () => {
  const document = makeDocument();
  const user = new User(7, "Jordan Lee", "jordan@example.com");

  renderUser(user, document);

  assert.equal(document.getElementById("user-name").textContent, "Jordan Lee");
  assert.equal(document.getElementById("user-email").textContent, "jordan@example.com");
});

test("10) renderTaskList creates task cards and urgent escalation content", () => {
  const document = makeDocument();

  const tasks = [
    new Task(1, "Review PR", "active", "high", 7),
    new UrgentTask(2, "Fix checkout", "active", "urgent", 7, "Checkout errors reported"),
  ];

  renderTaskList(tasks, document);

  const cards = [...document.querySelectorAll(".task-card")];

  assert.equal(cards.length, 2);
  assert.equal(cards[0].querySelector(".task-title").textContent, "Review PR");
  assert.equal(cards[0].querySelector(".task-status").textContent, "active");
  assert.equal(cards[0].querySelector(".task-priority").textContent, "high");
  assert.equal(cards[1].querySelector(".task-escalation").textContent, "URGENT: Checkout errors reported");
});

test("11) renderTaskList replaces old DOM and shows an empty state", () => {
  const document = makeDocument();
  const list = document.getElementById("task-list");

  const stale = document.createElement("div");
  stale.className = "stale-item";
  list.appendChild(stale);

  renderTaskList([], document);

  assert.equal(list.querySelector(".stale-item"), null);
  assert.equal(list.querySelectorAll(".empty-state").length, 1);
  assert.equal(list.children.length, 1);
});

test("12) renderStats writes all summary values into the DOM", () => {
  const document = makeDocument();

  renderStats({ total: 9, completed: 4, active: 5, urgent: 2 }, document);

  assert.equal(document.getElementById("stat-total").textContent, "9");
  assert.equal(document.getElementById("stat-completed").textContent, "4");
  assert.equal(document.getElementById("stat-active").textContent, "5");
  assert.equal(document.getElementById("stat-urgent").textContent, "2");
});
