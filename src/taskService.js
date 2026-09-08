import { Task, UrgentTask } from "./models.js";

export function buildTasksUrl(baseUrl, options = {}) {
  // TODO
  // console.log(baseUrl);
  if (typeof baseUrl === "string" && baseUrl.length > 0) {
    baseUrl = baseUrl.trim();
    baseUrl = baseUrl.replace(/\/+$/, "");

    let url = new URL(baseUrl);
    url.pathname += "/tasks";

    if (options.ownerId && typeof options.ownerId === "number") {
      url.searchParams.set("ownerId", options.ownerId);
    }
    if (options.status && typeof options.status === "string") {
      url.searchParams.set("status", options.status);
    }
    if (options.priority && typeof options.priority === "string") {
      url.searchParams.set("priority", options.priority);
    }
    if (options.limit && typeof options.limit === "number") {
      url.searchParams.set("limit", options.limit);
    }
    return url;
    // console.log(url);
  } else {
    throw new TypeError("Invalid URL provided.");
  }
}

export async function fetchCurrentUser(baseUrl) {
  // TODO
}

export async function fetchTasks(baseUrl, options = {}) {
  // TODO
}

export function createTaskInstances(records) {
  // TODO
}

export function summarizeTasks(tasks) {
  // TODO
}

export function rankTasks(tasks) {
  // TODO
}
