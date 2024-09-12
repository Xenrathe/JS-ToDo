import { Project } from "./project.js";
import { addTextAreaHeightAdjusters, addDragAndReorder, addEventListenersToProject, addProjectInDOM, removeObjectInDOM, updateCompletionInDOM, draggedItem } from "./domController.js"
import { getInitialDateAsString } from "./dates.js";
import { storeProject, storeAllProjects, retrieveProjects, removeProjectFromStorage } from "./storage.js";
import "./styles/styles.css";

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
  const newProject = new Project(`Project #${projectNum}`, '[description here]', dueDate, projectNum, projectNum, null, false);
  const DOMelement = addProjectInDOM(newProject);
  newProject.DOMelement = DOMelement;
  addEventListenersToProject(newProject, removeProject);
  storeProject(newProject);

  projects.push(newProject);
}

// Helper function
function getProjectByProjectNum(projectNum) {
  const foundProject = projects.find((project) => {
    return project != null && project.projectNum == projectNum;
  });

  return foundProject || null;
}

function removeProject(projectNum) {
  const project = getProjectByProjectNum(projectNum);
  if (confirm(`Are you sure to wish to delete ${project.title}?`)){
    removeObjectInDOM(project.DOMelement);
    removeProjectFromStorage(project);
    const projectIndex = projects.indexOf(project);
    projects.splice(projectIndex, 1);
  }
}

function updatePriorities () {
  console.log('update priorities called');
  if (draggedItem.classList.contains('project')) {
    updateProjectPriorities();
  }
  else {
    updateTodoItemsPriorities();
  }
}

function updateProjectPriorities() {
  console.log('update project prio called');
  const projectElements = document.querySelectorAll('#content .project');
  projectElements.forEach((projectElement, index) => {
    const projectNum = projectElement.id.replace('p', '');
    const project = getProjectByProjectNum(projectNum);

    if (project) {
      project.priority = index + 1;
    }
  });

  storeAllProjects(projects);
}

function updateTodoItemsPriorities() {
  console.log('update todo prio called');
  const projectNum = draggedItem.id.split('-')[0].slice(1); // e.g. p6-t12 will return '6'
  const project = getProjectByProjectNum(projectNum);
  project.updatePriorities();
  storeProject(project);
}

// Run 1x on page load, mostly adding event handlers
function onPageLoad() {
  addTextAreaHeightAdjusters();

  // Load up stored projects or add a default one
  projects = retrieveProjects();
  currProjectNum = projects.length;
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

  // eventListeners on #content
  addDragAndReorder();
  const contentDiv = document.querySelector('#content');
  contentDiv.addEventListener('drop', (e) => {
    e.preventDefault();
    console.log("Drop event triggered", e);
    updatePriorities();
  });

  const newProjectBtn = document.querySelector('#new-project');
  newProjectBtn.addEventListener('click', newProject);
}

onPageLoad();