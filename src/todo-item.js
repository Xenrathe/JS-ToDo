import { updateCompletionInDOM } from "./domController.js";
// todo-item.js handles the TodoItem class

export class TodoItem {
  constructor(title, description, priority, todoNum, parentProject, isComplete) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.parentProject = parentProject;
    this.todoNum = todoNum;
    this.DOMelement = null;
    this.isComplete = isComplete;
  }

  stringify() {
    const stringObject = {title: this.title, description: this.description, priority: this.priority, todoNum: this.todoNum, isComplete: this.isComplete};

    return stringObject;
  }

  toggleComplete(){
    if (this.parentProject.isComplete)
      return;

    this.isComplete = !this.isComplete;
    updateCompletionInDOM(this.DOMelement, this.isComplete);
    this.parentProject.updateValues();
  }

  updateValues() {
    //title
    const titleDOM = this.DOMelement.querySelector(".title");
    this.title = titleDOM.value;

    //description
    const descDOM = this.DOMelement.querySelector(".description");
    this.description = descDOM.value;

    this.parentProject.updateValues();
  }
}