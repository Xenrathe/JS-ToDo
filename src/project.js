import { TodoItem } from "./todo-item.js";
import { addNewTodoInDOM } from "./domController.js";

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
    const todoItemNum = this.todoItems.length + 1;

    //Create in DOM
    let DOMelement = addNewTodoInDOM(this.DOMelement, this.projectNum, todoItemNum);

    //Create todo object
    const newTodoItem = new TodoItem("New", "A new todo item...", this.dueDate, todoItemNum, DOMelement);
    this.todoItems.push(newTodoItem);
  }

  // Remove anbased on indexNum (which the calling function should supply)
  removeTodo(indexNum) {
    this.todoItems.splice(indexNum, 1);
  }

  toggleComplete(){
    this.isComplete = !this.isComplete;
  }
}