export class TodoItem {
  constructor(title, description, dueDate, priority, checklist) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.checklist = checklist;
    this.isComplete = false;
  }

  toggleComplete(){
    this.isComplete = !this.isComplete;
  }
}