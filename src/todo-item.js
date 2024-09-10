import { toggleCompletionInDOM } from "./domController.js";

export class TodoItem {
  constructor(title, description, priority, parentProject, DOMelement) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.parentProject = parentProject;
    this.DOMelement = DOMelement;
    this.isComplete = false;
  }

  toggleComplete(){
    if (this.parentProject.isComplete)
      return;

    this.isComplete = !this.isComplete;
    toggleCompletionInDOM(this.DOMelement);
  }
}