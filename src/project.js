import { TodoItem } from "./todo-item.js";

export class Project {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.todoItems = [];
  }

  // Adds an empty / default todoItem to the project
  addNewTodo(){
    this.todoItems.push(new TodoItem("New", "A new todo item...", this.dueDate, 1));
  }

  // Remove anbased on indexNum (which the calling function should supply)
  removeTodo(indexNum) {
    this.todoItems.splice(indexNum, 1);
  }
}