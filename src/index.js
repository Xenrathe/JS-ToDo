import { Project } from "./project.js";
import { addTextAreaHeightAdjusters, addNewProjectInDOM, removeObjectInDOM } from "./domController.js"
import "./styles/styles.css";
import "./styles/classes.css";
import "./styles/buttons.css";
import "./styles/inputs.css";

let currProjectNum = 0;
let projects = [];

// Runs when the New Project button is clicked
function newProject() {
  currProjectNum += 1;

  //Because of dynamic variable / closure reasons
  const projectNum = currProjectNum;

  var domElement = addNewProjectInDOM(projectNum);
  const newProject = new Project(`Project #${projectNum}`, '[description here]', '2024-09-08', 1, projectNum, domElement);
  projects.push(newProject);

  // Add eventListener for new todo
  const newTodoItem = domElement.querySelector('.new-todo');
  newTodoItem.addEventListener('click', newProject.addNewTodo.bind(newProject));

  // Add eventListeners on other buttons
  const toggleCompleteBTN = domElement.querySelector('.finish-proj');
  toggleCompleteBTN.addEventListener('click', () => newProject.toggleComplete.bind(newProject));
  const deleteProjectBTN = domElement.querySelector('.delete');
  deleteProjectBTN.addEventListener('click', () => removeProject(projectNum));
}

function removeProject(projectNum) {
  if (confirm(`Are you sure to wish to delete ${projects[projectNum - 1].title}?`)){
    removeObjectInDOM(projects[projectNum - 1].DOMelement);

    //Set project to null instead of removing
    //This maintains number consistency across all aspects
    projects[projectNum - 1] = null;
  }
}

// Run 1x on page load, mostly adding event handlers
function onPageLoad() {
  addTextAreaHeightAdjusters();
  const newProjectBtn = document.querySelector('#new-project');
  newProjectBtn.addEventListener('click', newProject);

  //Add a default project
  newProject();
}

onPageLoad();