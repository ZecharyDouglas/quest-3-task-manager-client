import { UrgentTask } from "./models.js";

export function renderUser(user, documentRef = document) {
  // TODO
  const name_element = documentRef.getElementById("user-name");
  const email_element = documentRef.getElementById("user-email");

  name_element.textContent = user.name;
  email_element.textContent = user.getEmail();
}

export function renderTaskList(tasks, documentRef = document) {
  // TODO
  console.log(tasks);
  const task_list = documentRef.getElementById("task-list");
  const task_cards = tasks.forEach((task) => {
    const card = documentRef.createElement("div");
    card.className = "task-card";

    const title = documentRef.createElement("h3");
    title.className = "task-title";
    title.textContent = task.title;

    const status = documentRef.createElement("span");
    status.className = "task-status";
    status.textContent = task.status;

    const priority = documentRef.createElement("span");
    priority.className = "task-priority";
    priority.textContent = task.priority;

    const escalation = documentRef.createElement("span");
    escalation.className = "task-escalation";
    escalation.textContent = `URGENT: ${task.escalationNote}`;

    card.appendChild(title);
    card.appendChild(status);
    card.appendChild(priority);
    card.appendChild(escalation);
    task_list.appendChild(card);
  });
}

export function renderStats(summary, documentRef = document) {
  // TODO
}
