export class User {
  // TODO: private email field
  #email;
  constructor(id, name, email) {
    // TODO
    if (typeof id === "number") {
      this.id = id;
    } else {
      throw new TypeError("Invalid ID.");
    }
    if (typeof name === "string" && name.length > 0) {
      this.name = name;
    } else {
      throw new TypeError("Invalid Name.");
    }
    if (typeof email === "string" && email.length > 0 && email.includes("@")) {
      this.#email = email;
    } else throw new TypeError("Invalid Email.");
  }

  getEmail() {
    // TODO
    return this.#email;
  }

  updateEmail(newEmail) {
    // TODO
    if (
      typeof newEmail === "string" &&
      newEmail.length > 0 &&
      newEmail.includes("@")
    ) {
      this.#email = newEmail;
    } else throw new TypeError("Invalid email provided, update failed.");
  }
}

export class Task {
  // TODO: private completion-state field
  #completion_state = false;
  constructor(id, title, status, priority, ownerId) {
    // TODO
    if (typeof id === "number") {
      this.id = id;
    } else {
      throw new TypeError("Invalid task id.");
    }
    if (typeof title === "string" && title.length > 0) {
      this.title = title.trim();
    } else {
      throw new TypeError("Invalid title.");
    }
    if (typeof status === "string" && status.length > 0) {
      this.status = status.trim();
      this.#completion_state = status === "completed";
    } else {
      throw new TypeError("Invalid status.");
    }
    if (typeof priority === "string" && priority.length > 0) {
      this.priority = priority.trim();
    } else {
      throw new TypeError("Invalid priority.");
    }
    if (typeof ownerId === "number") {
      this.ownerId = ownerId;
    } else {
      throw new TypeError("Invalid ownerId.");
    }
  }

  get isCompleted() {
    // TODO
    return this.#completion_state;
  }

  markCompleted() {
    // TODO
    this.#completion_state = true;
    this.status = "completed";
    return this.status;
  }
}

export class UrgentTask extends Task {
  constructor(id, title, status, priority, ownerId, escalationNote) {
    // TODO
    super(id, title, status, priority, ownerId);
    if (typeof escalationNote === "string" && escalationNote.length > 0) {
      this.escalationNote = escalationNote;
    } else {
      throw new TypeError("Invalid Escalation Note.");
    }
  }

  getEscalationLabel() {
    // TODO
    return `URGENT: ${this.escalationNote}`;
  }
}
