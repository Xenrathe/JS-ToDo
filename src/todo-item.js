export class TodoItem {
  constructor(title, description, priority) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.isComplete = false;
  }

  toggleComplete(){
    this.isComplete = !this.isComplete;
  }
}