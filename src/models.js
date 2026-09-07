export class User {
  // TODO: private email field

  constructor(id, name, email) {
    // TODO
  }

  getEmail() {
    // TODO
  }

  updateEmail(newEmail) {
    // TODO
  }
}

export class Task {
  // TODO: private completion-state field

  constructor(id, title, status, priority, ownerId) {
    // TODO
  }

  get isCompleted() {
    // TODO
  }

  markCompleted() {
    // TODO
  }
}

export class UrgentTask extends Task {
  constructor(id, title, status, priority, ownerId, escalationNote) {
    // TODO
  }

  getEscalationLabel() {
    // TODO
  }
}
