import { TodoItem } from "./todo-item.js";
import {
  addTodoInDOM,
  updateCompletionInDOM,
  removeObjectInDOM,
  addEventListenersToTodo,
} from "./domController.js";
import { storeProject } from "./storage.js";
// project.js handles the Project class

export class Project {
  constructor(
    title,
    description,
    dueDate,
    priority,
    projectNum,
    DOMelement,
    isComplete
  ) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.projectNum = projectNum;
    this.DOMelement = DOMelement;
    this.todoItems = [];
    this.isComplete = isComplete;
  }

  // Adds an empty / default todoItem to the project
  addNewTodo() {
    if (this.isComplete) return;

    const todoItemNum = this.todoItems.length + 1;

    //Create todo object
    const newTodoItem = new TodoItem(
      `Todo #${todoItemNum}`,
      "[description here]",
      todoItemNum,
      todoItemNum,
      this,
      false
    );
    newTodoItem.DOMelement = addTodoInDOM(newTodoItem);
    addEventListenersToTodo(newTodoItem);

    this.todoItems.push(newTodoItem);
    storeProject(this);
  }

  // Should only be called upon pageload
  addTodosToDOM() {
    this.todoItems.forEach((todoItem) => {
      if (todoItem != null) {
        todoItem.DOMelement = addTodoInDOM(todoItem);
        addEventListenersToTodo(todoItem);
        updateCompletionInDOM(todoItem.DOMelement, todoItem.isComplete);
      }
    });
  }

  // Helper function
  getTodoByTodoNum(todoNum) {
    const foundTodo = this.todoItems.find((todoItem) => {
      return todoItem != null && todoItem.todoNum == todoNum;
    });

    return foundTodo || null;
  }

  // Remove todo based on indexNum (which the calling function should supply)
  removeTodo(todoItem) {
    if (this.isComplete) return;

    if (confirm(`Are you sure to wish to delete ${todoItem.title}?`)) {
      removeObjectInDOM(todoItem.DOMelement);

      //Set todo to null instead of removing
      //This maintains number consistency across all aspects
      const index = this.todoItems.indexOf(todoItem);
      this.todoItems[index] = null;
      storeProject(this);
    }
  }

  stringify() {
    const todoItemStrings = [];
    this.todoItems.forEach((todoItem) => {
      if (todoItem != null) {
        todoItemStrings.push(todoItem.stringify());
      } else {
        todoItemStrings.push("null");
      }
    });

    const stringObject = {
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      projectNum: this.projectNum,
      isComplete: this.isComplete,
      todoItems: JSON.stringify(todoItemStrings),
    };

    return stringObject;
  }

  updateValues() {
    //title
    const titleDOM = this.DOMelement.querySelector(
      `#p${this.projectNum}-title`
    );
    this.title = titleDOM.value;

    //description
    const descDOM = this.DOMelement.querySelector(`#p${this.projectNum}-desc`);
    this.description = descDOM.value;

    //dueDate
    const dateDOM = this.DOMelement.querySelector(`#p${this.projectNum}-date`);
    this.dueDate = dateDOM.value;

    storeProject(this);
  }

  updatePriorities() {
    const todoElements = this.DOMelement.querySelectorAll(".todo-item");
    todoElements.forEach((todoElement, index) => {
      const todoNum = todoElement.id.split("-")[1].slice(1); // p6-t12 becomes '12'
      const todoItem = this.getTodoByTodoNum(todoNum);

      // Because some may be null
      if (todoItem) {
        todoItem.priority = index + 1;
      }
    });
  }

  toggleComplete() {
    this.isComplete = !this.isComplete;
    updateCompletionInDOM(this.DOMelement, this.isComplete);
    storeProject(this);
  }
}
