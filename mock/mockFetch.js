const CURRENT_USER = {
  id: 7,
  name: "Jordan Lee",
  email: "jordan@example.com",
};

const TASKS = [
  { id: 1, title: "Review pull request", status: "active", priority: "high", ownerId: 7 },
  { id: 2, title: "Deploy staging build", status: "completed", priority: "urgent", ownerId: 7, escalationNote: "Production review is waiting" },
  { id: 3, title: "Update documentation", status: "active", priority: "medium", ownerId: 7 },
  { id: 4, title: "Fix checkout regression", status: "active", priority: "urgent", ownerId: 7, escalationNote: "Checkout errors reported" },
  { id: 5, title: "Archive old feature flags", status: "completed", priority: "low", ownerId: 7 },
  { id: 6, title: "Prepare analytics query", status: "active", priority: "high", ownerId: 9 },
];

function jsonResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return structuredClone(data);
    },
  };
}

function installMockFetch(target = globalThis) {
  target.fetch = async function mockFetch(input) {
    const url = input instanceof URL ? input : new URL(String(input));

    if (url.pathname.endsWith("/users/7")) {
      return jsonResponse(CURRENT_USER);
    }

    if (url.pathname.endsWith("/tasks")) {
      let records = TASKS.map((task) => ({ ...task }));

      const ownerId = url.searchParams.get("ownerId");
      const status = url.searchParams.get("status");
      const priority = url.searchParams.get("priority");
      const limit = url.searchParams.get("limit");

      if (ownerId !== null) records = records.filter((task) => task.ownerId === Number(ownerId));
      if (status) records = records.filter((task) => task.status === status);
      if (priority) records = records.filter((task) => task.priority === priority);
      if (limit !== null) records = records.slice(0, Number(limit));

      return jsonResponse(records);
    }

    return jsonResponse({ message: "Not found" }, 404);
  };
}

installMockFetch();

export { CURRENT_USER, TASKS, installMockFetch };
