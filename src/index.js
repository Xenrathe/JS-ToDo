import { Project } from "./project.js";
import { addTextAreaHeightAdjusters, addDragAndReorder, addNewProjectInDOM, removeObjectInDOM, setDraggable, draggedItem } from "./domController.js"
import { getInitialDueDate } from "./dates.js";
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

  var DOMelement = addNewProjectInDOM(projectNum);
  const dueDate = getInitialDueDate(); // A Date object, set to one week from today
  const newProject = new Project(`Project #${projectNum}`, '[description here]', dueDate, 1, projectNum, DOMelement);
  projects.push(newProject);

  // Add eventListener for new todo
  const newTodoItem = DOMelement.querySelector('.new-todo');
  newTodoItem.addEventListener('click', newProject.addNewTodo.bind(newProject));

  // Add eventListeners on other buttons
  const toggleCompleteBTN = DOMelement.querySelector('.finish-proj');
  toggleCompleteBTN.addEventListener('click', newProject.toggleComplete.bind(newProject));
  const deleteProjectBTN = DOMelement.querySelector('.delete');
  deleteProjectBTN.addEventListener('click', () => removeProject(projectNum));
  const dragProjectBTN = DOMelement.querySelector('.drag');
  // Only want the drag button to enable dragging
  dragProjectBTN.addEventListener('mousedown', () => setDraggable(DOMelement, true));
  DOMelement.addEventListener('dragend', () => setDraggable(DOMelement, false));
}

function removeProject(projectNum) {
  if (confirm(`Are you sure to wish to delete ${projects[projectNum - 1].title}?`)){
    removeObjectInDOM(projects[projectNum - 1].DOMelement);

    //Set project to null instead of removing
    //This maintains number consistency across all aspects
    projects[projectNum - 1] = null;
  }
}

function updatePriorities () {
  if (draggedItem.classList.contains('project')) {
    updateProjectPriorities();
  }
  else {
    updateTodoItemsPriorities();
  }
}

function updateProjectPriorities() {
  const projectElements = document.querySelectorAll('#content .project');
  
  projectElements.forEach((projectElement, index) => {
    const projectNum = projectElement.id.replace('p', '') - 1; // #p1 is actually the 0th item in projects array
    const project = projects[projectNum];

    if (project) {
      // update the priority property
      project.priority = index + 1;
    }
  });
}

function updateTodoItemsPriorities() {
  const projectNum = draggedItem.id.split('-')[0].slice(1) - 1; // e.g. p6-t12 will return '5' for use in array
  const project = projects[projectNum];
  project.updatePriorities();
}

// Run 1x on page load, mostly adding event handlers
function onPageLoad() {
  addTextAreaHeightAdjusters();

  // eventListeners on #content
  addDragAndReorder();
  const contentDiv = document.querySelector('#content');
  contentDiv.addEventListener('drop', updatePriorities);

  const newProjectBtn = document.querySelector('#new-project');
  newProjectBtn.addEventListener('click', newProject);

  //Add a default project
  newProject();
}

onPageLoad();