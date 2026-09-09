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
  let url = new URL(baseUrl);
  url.pathname += `/users/7`;
  // console.log(url);
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new TypeError("Failed to fetch Current User.");
    }
    return res.json();
  });
}

export async function fetchTasks(baseUrl, options = {}) {
  // TODO
  const url = buildTasksUrl(baseUrl, options);
  // console.log(url);
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new TypeError("Failed to fetch Current User.");
    }
    return res.json();
  });
}

export function createTaskInstances(records) {
  // TODO

  const task_instances = records.map((rec) => {
    if (rec.priority === "urgent") {
      return new UrgentTask(
        rec.id,
        rec.title,
        rec.status,
        rec.priority,
        rec.ownerId,
        rec.escalationNote,
      );
    } else {
      return new Task(rec.id, rec.title, rec.status, rec.priority, rec.ownerId);
    }
  });
  console.log(task_instances);
  return task_instances;
}

export function summarizeTasks(tasks) {
  // TODO
  //   {
  //   total,
  //   completed,
  //   active,
  //   urgent
  // }
  const task_summary = tasks.reduce(
    (acc, curr) => {
      return {
        total: (acc.total += 1),
        completed:
          curr.status === "completed" ? (acc.completed += 1) : acc.completed,
        active: curr.status !== "completed" ? (acc.active += 1) : acc.active,
        urgent: curr.priority === "urgent" ? (acc.urgent += 1) : acc.urgent,
      };
    },
    { total: 0, completed: 0, active: 0, urgent: 0 },
  );
  console.log(task_summary);
  return task_summary;
}

export function rankTasks(tasks) {
  // TODO
}
