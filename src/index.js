import { Project } from "./project.js";
import { addTextAreaHeightAdjusters, addDragAndReorder, addEventListenersToProject, addProjectInDOM, removeObjectInDOM, updateCompletionInDOM, draggedItem } from "./domController.js"
import { getInitialDateAsString } from "./dates.js";
import { storeProject, retrieveProjects, removeProjectFromStorage } from "./storage.js";
import "./styles/styles.css";
import "./styles/classes.css";
import "./styles/buttons.css";
import "./styles/inputs.css";

// index.js is the entry-point for javascript functionality in this project
// primarily it handles the initial javascript calling as well as the overall projects array

let currProjectNum = 0;
let projects = [];

// Runs when the New Project button is clicked
function newProject() {
  currProjectNum += 1;

  //Because of dynamic variable / closure reasons
  const projectNum = currProjectNum;

  //Create new Project object, add it into DOM, add eventListeners
  const dueDate = getInitialDateAsString(); // A Date object, set to one week from today
  const newProject = new Project(`Project #${projectNum}`, '[description here]', dueDate, 1, projectNum, null, false);
  const DOMelement = addProjectInDOM(newProject);
  newProject.DOMelement = DOMelement;
  addEventListenersToProject(newProject, removeProject);
  storeProject(newProject);

  projects.push(newProject);
}

function removeProject(projectNum) {
  if (confirm(`Are you sure to wish to delete ${projects[projectNum - 1].title}?`)){
    removeObjectInDOM(projects[projectNum - 1].DOMelement);

    removeProjectFromStorage(projects[projectNum - 1]);

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

  // Load up stored projects or add a default one
  projects = retrieveProjects();
  if (projects.length == 0){
    newProject();
  }
  else {
    projects.forEach((project) => {
      project.DOMelement = addProjectInDOM(project);
      addEventListenersToProject(project, removeProject);
      project.addTodosToDOM();
      updateCompletionInDOM(project.DOMelement, project.isComplete);
    });
  }
}

onPageLoad();