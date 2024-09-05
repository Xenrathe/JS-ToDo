import { Project } from "./project.js";
import { addTextAreaHeightAdjusters, addNewProjectInDOM } from "./domController.js"
import "./styles/styles.css";
import "./styles/classes.css";
import "./styles/buttons.css";
import "./styles/inputs.css";

let currProjectNum = 1;
let projects = [];

// Run 1x on page load, mostly adding event handlers
function onPageLoad() {
  addTextAreaHeightAdjusters();
  const newProjectBtn = document.querySelector('#new-project');
  newProjectBtn.addEventListener('click', newProject);
}

// Runs when the New Project button is clicked
function newProject() {
  currProjectNum += 1;

  var domElement = addNewProjectInDOM(currProjectNum);
  const newProject = new Project(`Project #${currProjectNum}`, '[description here]', '2024-09-08', 1, currProjectNum, domElement);
  projects.push(newProject);

  // Add eventHandler for new todo
  console.log(newProject.todoItems);
  const newTodoItem = domElement.querySelector('.new-todo');
  newTodoItem.addEventListener('click', newProject.addNewTodo.bind(newProject));
}

onPageLoad();