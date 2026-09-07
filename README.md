# Quest 3 — Task Manager Client

Quest 1 and Quest 2 are not gone. They have merely followed you into the browser. 👁️

This quest deliberately **reuses** earlier material while introducing browser-side JavaScript:

- classes / constructors
- inheritance with `extends` + `super()`
- private fields
- getters + instance methods
- `fetch`
- `async` / `await`
- URL + `URLSearchParams`
- `map`, `filter`, `reduce`, `sort`
- object transformation
- **NEW:** DOM selection
- **NEW:** DOM creation / rendering
- **NEW:** `addEventListener`
- **NEW:** forms + `preventDefault()`
- **NEW:** reading input values
- **NEW:** loading / error / empty / populated UI states

The point is cumulative retrieval. You should repeatedly have to remember older concepts instead of seeing them once and letting them evaporate.

## Scenario

You are building the browser client for a small task-management app.

The mock API exposes:

- `GET /users/7`
- `GET /tasks`
- task filtering through query parameters

The starter page contains:

- a signed-in user panel
- a task form
- status / priority filters
- task statistics
- a task list
- loading and error message areas

Your code should fetch domain data, transform it into class instances, summarize it, and render it into the page.

## Rules

1. Do not modify the tests.
2. Keep the supplied exports intact.
3. Do not mutate arrays unless the requirement explicitly allows it.
4. Do not replace the starter HTML IDs. The tests rely on them.
5. Use browser DOM APIs. Do not install React for this quest.
6. There are **12 tests**.
7. No solution file is included. You drive. The tests bite.

Run:

```bash
npm install
npm test
```

To open the app itself, use VS Code Live Server or:

```bash
npm start
```

Then open `http://localhost:5500`.

# Part 1 — Domain models

File: `src/models.js`

## 1. `User`

Constructor:

```js
new User(id, name, email)
```

Requirements:

- store `id`
- store `name`
- store email in a **private field**
- expose `getEmail()`
- expose `updateEmail(newEmail)`
- reject blank email values with an `Error`

## 2. `Task`

Constructor:

```js
new Task(id, title, status, priority, ownerId)
```

Requirements:

- store `id`
- store `title`
- store `status`
- store `priority`
- store `ownerId`
- store completion state in a **private field**
- initial completion state is based on whether `status === "completed"`
- expose read-only `isCompleted`
- `markCompleted()` should set status to `"completed"`, update private completion state, and return the updated status

## 3. `UrgentTask extends Task`

Constructor:

```js
new UrgentTask(id, title, status, priority, ownerId, escalationNote)
```

Requirements:

- use `super(...)`
- store `escalationNote`
- expose `getEscalationLabel()`
- return `URGENT: <escalationNote>`

This is here so inheritance does not quietly evaporate after Quest 2.

# Part 2 — Service / data pipeline

File: `src/taskService.js`

## 4. `buildTasksUrl(baseUrl, options)`

Return a `URL`.

Endpoint:

```text
/tasks
```

Supported optional query parameters:

- `ownerId`
- `status`
- `priority`
- `limit`

Requirements:

- tolerate surrounding whitespace in `baseUrl`
- tolerate one or more trailing slashes
- preserve an existing path such as `/api`
- add only supplied options
- do not mutate `options`

## 5. `fetchCurrentUser(baseUrl)`

Fetch `/users/7`.

Requirements:

- use `fetch`
- throw an `Error` when response is not OK
- return parsed JSON

## 6. `fetchTasks(baseUrl, options)`

Requirements:

- use `buildTasksUrl`
- use `fetch`
- throw an `Error` when response is not OK
- return parsed JSON

## 7. `createTaskInstances(records)`

Transform raw API records into actual class instances.

Rules:

- priority `"urgent"` -> `UrgentTask`
- otherwise -> `Task`
- return a **new array**
- do not mutate input records

Choose the array method yourself.

## 8. `summarizeTasks(tasks)`

Return:

```js
{
  total,
  completed,
  active,
  urgent
}
```

## 9. `rankTasks(tasks)`

Return a **new array** ordered by:

1. `urgent` → `high` → `medium` → `low`
2. within equal priority, active before completed

Do not mutate the original array.

Yes, the comparator demon has returned.

# Part 3 — Browser DOM

File: `src/ui.js`

## 10. `renderUser(user, documentRef = document)`

Render into `#user-name` and `#user-email` using `textContent`.

## 11. `renderTaskList(tasks, documentRef = document)`

Render into `#task-list`.

Requirements:

- clear old contents first
- if empty, render exactly one `.empty-state`
- otherwise create one `.task-card` per task
- each card must contain:
  - `.task-title`
  - `.task-status`
  - `.task-priority`
- urgent tasks also render `.task-escalation`
- use `createElement()` / `appendChild()`
- do not build the whole list as one giant `innerHTML` string

## 12. `renderStats(summary, documentRef = document)`

Render numeric values into:

- `#stat-total`
- `#stat-completed`
- `#stat-active`
- `#stat-urgent`

# Part 4 — Event wiring

File: `src/app.js`

The 12 tests grade the pieces above. The actual browser app is intentionally left partly unfinished so you also practice event-driven code.

Complete `initApp()`.

Suggested first-load pipeline:

```text
show loading
    ↓
fetch current user + tasks
    ↓
create task instances
    ↓
rank tasks
    ↓
summarize
    ↓
render user + stats + tasks
    ↓
hide loading
```

Then wire:

### Filter form

`#filter-form`

On submit:

- `preventDefault()`
- read `#status-filter`
- read `#priority-filter`
- refetch tasks using selected query params
- rerender task list and stats

### Task form

`#task-form`

On submit:

- `preventDefault()`
- read `#task-title-input`
- read `#task-priority-input`
- reject empty title in the UI
- create a local `Task` / `UrgentTask`
- add it to current task state
- rerender
- clear the title input

You decide how to store current client-side task state.

# Mental checklist

```text
CONTRACT
What exactly comes in and what must go out?

STATE
What does each variable represent right now?

TRACE
Can I manually walk one tiny example?

MUTATION
Am I changing the original or creating a new value?

FLOW
Where does this returned value go next?

DOM
Am I holding an element, a string, an event, or application data?
```

That last one is here because Amazon assessment ghosts deserve closure.
