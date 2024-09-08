import { TodoItem } from "./todo-item.js";
import { addNewTodoInDOM, toggleCompletionInDOM, removeObjectInDOM } from "./domController.js";

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
    const newTodoItem = new TodoItem(`Todo #${todoItemNum}`, "[description here]", todoItemNum, this, DOMelement);
    this.todoItems.push(newTodoItem);

    // Add eventListeners on other buttons
    const toggleCompleteBTN = DOMelement.querySelector('.finish-todo');
    toggleCompleteBTN.addEventListener('click', () => newTodoItem.toggleComplete.bind(newTodoItem));
    const deleteTodoBTN = DOMelement.querySelector('.delete');
    deleteTodoBTN.addEventListener('click', () => this.removeTodo(todoItemNum));
  }

  // Remove todo based on indexNum (which the calling function should supply)
  removeTodo(todoNum) {
    if (this.isComplete)
      return;

    if (confirm(`Are you sure to wish to delete ${this.todoItems[todoNum - 1].title}?`)){
      removeObjectInDOM(this.todoItems[todoNum - 1].DOMelement);
  
      //Set todo to null instead of removing
      //This maintains number consistency across all aspects
      this.todoItems[todoNum - 1] = null;
    }
  }

  toggleComplete(){
    this.isComplete = !this.isComplete;
    toggleCompletionInDOM(this.DOMelement);
  }
}