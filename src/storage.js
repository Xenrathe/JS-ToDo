import { Project } from "./project.js";
import { TodoItem } from "./todo-item.js";
// storage.js handles all functionality related to using the localStorage stuff within the Web Storage API

export function clearAllProjects() {
  localStorage.clear();
}

export function storeProject(project){
  const projectNum = project.projectNum;
  let projectCount = localStorage.getItem("projectCount");
  if (!projectCount) {
    projectCount = 0;
  }

  //If a new project then increase projectCount
  if (!localStorage.getItem(`p-${projectNum}`)) {
    localStorage.setItem("projectCount", parseInt(projectCount) + 1);
  }

  if (project != null){
    localStorage.setItem(`p-${projectNum}`, JSON.stringify(project.stringify()));
  }
  else {
    localStorage.setItem(`p-${projectNum}`, "null");
  }
}

export function storeAllProjects(projects){

  projects.forEach((project) => {
    storeProject(project);
  });

  localStorage.setItem("projectCount", projects.length);
}

export function retrieveProjects() {
  let projects = [];
  const projectCount = localStorage.getItem("projectCount");

  //Create all project objects
  for (let i = 1; i <= projectCount; i++) {
    const projectJSON = JSON.parse(localStorage.getItem(`p-${i}`));

    // Create the project object
    let project = null;
    if (projectJSON != null){
      project = new Project(projectJSON.title, projectJSON.description, projectJSON.dueDate, projectJSON.priority, projectJSON.projectNum, null, projectJSON.isComplete);
      
      // Create all the Todo objects
      const todoItemsJSON = JSON.parse(projectJSON.todoItems);
      for (let j = 0; j < todoItemsJSON.length; j++) {
        
        const todoJSON = todoItemsJSON[j];
        let todoItem = null;
        if (todoJSON != null && todoJSON != 'null') {
          todoItem = new TodoItem(todoJSON.title, todoJSON.description, todoJSON.priority, todoJSON.todoNum, project, todoJSON.isComplete);
        }

        // insert todo object based on priority
        insertBasedOnPriority(todoItem, project.todoItems);
      }

      // insert project based on priority
      insertBasedOnPriority(project, projects);
    }
  }

  return projects;
}

function insertBasedOnPriority(item, collection){
  let inserted = false;
  if (item != null) {
    for (let j = 0; j < collection.length; j++) {
      if (collection[j] && item.priority < collection[j].priority) {
        collection.splice(j, 0, item);  // insert at the correct index
        inserted = true;
        break;
      }
    }
  }
  
  // put at end if otherwise not inserted
  if (!inserted) {
    collection.push(item);
  }

  return collection;
}

// projects aren't really removed but set to null
// which is necessary to maintain ordering integrity
export function removeProjectFromStorage(project) {
  localStorage.setItem(`p-${project.projectNum}`, "null");
}