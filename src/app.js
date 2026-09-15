import {
  fetchCurrentUser,
  fetchTasks,
  createTaskInstances,
  summarizeTasks,
  rankTasks,
} from "./taskService.js";

import { Task, UrgentTask, User } from "./models.js";
import { renderUser, renderTaskList, renderStats } from "./ui.js";
import "../mock/mockFetch.js";

const BASE_URL = "http://quest3.local/api";
let currentTasks = [];

export async function initApp(documentRef = document) {
  // TODO
  //
  // Suggested first-load pipeline:
  // 1. show loading
  const loadingState = documentRef.getElementById("loading-message");
  loadingState.hidden = false;
  // 2. fetch current user + tasks
  const tasks = await fetchTasks(BASE_URL);
  const user_fetch = await fetchCurrentUser(BASE_URL);
  const user = new User(user_fetch.id, user_fetch.name, user_fetch.email);
  // 3. create task instances
  const task_instances = createTaskInstances(tasks);
  //current tasks are instances that will have new task objects appended to them onSubmit
  currentTasks = task_instances;
  // 4. rank
  const ranked_task_instances = rankTasks(currentTasks);
  // 5. summarize
  const summary = summarizeTasks(ranked_task_instances);
  // 6. render
  renderUser(user);
  renderTaskList(ranked_task_instances);
  renderStats(summary);
  // 7. hide loading
  loadingState.hidden = true;
  //
  // Then wire:
  // - #filter-form submit
  const filter_form = documentRef.getElementById("filter-form");
  filter_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = documentRef.getElementById("status-filter").value;
    const priority = documentRef.getElementById("priority-filter").value;
    const query_params = {
      status,
      priority,
    };
    const new_tasks = await fetchTasks(BASE_URL, query_params);
    const new_task_instances = createTaskInstances(new_tasks);
    const new_ranked_tasks = rankTasks(new_task_instances);
    currentTasks = new_task_instances;
    const new_summary = summarizeTasks(new_ranked_tasks);
    renderTaskList(currentTasks);
    renderStats(new_summary);
  });
  // - #task-form submit

  const task_form = documentRef.getElementById("task-form");

  //adding the escalation note to be hidden conditionally
  const escalation_note_title = documentRef.createElement("div");
  escalation_note_title.textContent = "Escalation Note";
  const escalation_note = documentRef.createElement("input");
  escalation_note.hidden = true;
  escalation_note_title.hidden = true;
  task_form.appendChild(escalation_note_title);
  task_form.appendChild(escalation_note);
  //priority element to toggle escalation note
  const priority = documentRef.getElementById("task-priority-input");

  //toggle trigger
  priority.addEventListener("change", (event) => {
    event.preventDefault();
    if (priority.value === "urgent") {
      escalation_note.hidden = false;
      escalation_note_title.hidden = false;
    } else {
      escalation_note.hidden = true;
      escalation_note_title.hidden = true;
    }
  });
  //submission form event listener
  task_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = documentRef.getElementById("task-title-input");
    const error_message = documentRef.getElementById("task-form-error");

    //error processing
    if (title.value == "") {
      error_message.hidden = false;
      error_message.textContent = "Title field cannot be empty.";
      return;
    }
    let new_task;
    let new_task_id = currentTasks.reduce((acc, curr) => {
      acc = Math.max(curr.id, acc);
    }, 0);
    new_task_id += 1;
    if (priority.value === "urgent") {
      new_task = new UrgentTask(
        new_task_id,
        title.value,
        "active",
        priority.value,
        user.id,
        escalation_note.value,
      );
    } else {
      //to fix later
      new_task = new Task(
        new_task_id,
        title.value,
        "active",
        priority.value,
        user.id,
      );
    }
    currentTasks.push(new_task);
    renderTaskList(currentTasks);
    const new_ranked_tasks = rankTasks(currentTasks);
    const new_summary = summarizeTasks(new_ranked_tasks);
    renderStats(new_summary);
    error_message.hidden = true;
    error_message.textContent = "";
    title.value = "";
    escalation_note.value = "";
  });
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    initApp().catch((error) => {
      console.log(error);
      const errorEl = document.getElementById("error-message");
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = error.message;
      }
    });
  });
}
