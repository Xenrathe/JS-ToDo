import { TodoItem } from "./todo-item.js";
import { addNewTodoInDOM, toggleCompletionInDOM } from "./domController.js";

export class Project {
  constructor(title, description, dueDate, priority, projectNum, DOMelement) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.projectNum = projectNum;
    this.DOMelement = DOMelement;
    this.todoItems = [];
    this.isComplete = false;
  }

  // Adds an empty / default todoItem to the project
  addNewTodo(){
    if (this.isComplete)
      return;

    const todoItemNum = this.todoItems.length + 1;

    //Create in DOM
    const DOMelement = addNewTodoInDOM(this.DOMelement, this.projectNum, todoItemNum);

    //Create todo object
    const newTodoItem = new TodoItem("New", "A new todo item...", todoItemNum, this, DOMelement);
    this.todoItems.push(newTodoItem);

    // Add eventListeners on other buttons
    const toggleCompleteBTN = DOMelement.querySelector('.finish-todo');
    toggleCompleteBTN.addEventListener('click', newTodoItem.toggleComplete.bind(newTodoItem));
  }

  // Remove todo based on indexNum (which the calling function should supply)
  removeTodo(indexNum) {
    if (this.isComplete)
      return;

    this.todoItems.splice(indexNum, 1);
  }

  toggleComplete(){
    this.isComplete = !this.isComplete;
    toggleCompletionInDOM(this.DOMelement);
  }
}