export class TodoItem {
  constructor(title, description, priority, DOMelement) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.DOMElement = DOMelement;
    this.isComplete = false;
  }

  toggleComplete(){
    this.isComplete = !this.isComplete;
  }
}