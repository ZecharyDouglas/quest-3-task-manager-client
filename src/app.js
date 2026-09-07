import {
  fetchCurrentUser,
  fetchTasks,
  createTaskInstances,
  summarizeTasks,
  rankTasks,
} from "./taskService.js";

import { Task, UrgentTask } from "./models.js";
import { renderUser, renderTaskList, renderStats } from "./ui.js";
import "../mock/mockFetch.js";

const BASE_URL = "http://quest3.local/api";
let currentTasks = [];

export async function initApp(documentRef = document) {
  // TODO
  //
  // Suggested first-load pipeline:
  // 1. show loading
  // 2. fetch current user + tasks
  // 3. create task instances
  // 4. rank
  // 5. summarize
  // 6. render
  // 7. hide loading
  //
  // Then wire:
  // - #filter-form submit
  // - #task-form submit
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    initApp().catch((error) => {
      const errorEl = document.getElementById("error-message");
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = error.message;
      }
    });
  });
}
