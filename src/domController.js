import { getInitialDateAsString } from "./dates.js";
import { Project } from "./project.js";
import { storeProject } from "./storage.js";

// domController.js handles all functionality related to adjusting the actual DOM
// this includes setting eventListeners on various DOM objects

// Automatically adjusts the height of all the various textareas (both growing and getting smaller)
export function addTextAreaHeightAdjusters(){
  const textAreas = document.querySelectorAll('textarea');
  textAreas.forEach((textArea) => {
    textArea.addEventListener('input', () => {
      textArea.style.height = 'auto'; // Reset the height
      let newHeight = textArea.scrollHeight;

      // Optional: Adjust for padding and borders if needed
      const computedStyle = window.getComputedStyle(textArea);
      
      const lineHeight = parseInt(computedStyle.lineHeight);
      const padding = parseInt(computedStyle.paddingTop) + parseInt(computedStyle.paddingBottom);
      const border = parseInt(computedStyle.borderTopWidth) + parseInt(computedStyle.borderBottomWidth);

      // Ensure minimum height is maintained if necessary
      newHeight = Math.max(newHeight, lineHeight + padding + border);

      textArea.style.height = `${newHeight}px`; // Set the new height
    });
  });
};

// Create new todo in the given project div
export function addTodoInDOM(todoObject) {
  const projectNum = todoObject.parentProject.projectNum;
  const todoNum = todoObject.todoNum;
  const projectElement = todoObject.parentProject.DOMelement;

  let newTodoDiv = document.createElement("div");
  newTodoDiv.classList.add('todo-item', 'incomplete');
  newTodoDiv.id = `p${projectNum}-t${todoNum}`;
  newTodoDiv.innerHTML = `
    <div class="top-bar">
      <textarea id="p${projectNum}-t${todoNum}-title" rows="1" class="title highlighted-input noborder">${todoObject.title}</textarea>
      <div class="buttons">
        <button class="delete"><span>x</span></button>
        <button class="finish-todo"><span>✓</span></button>
        <button class="drag"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>drag</title><path d="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z" /></svg></button>
      </div>
    </div>
    <textarea id="p${projectNum}-t${todoNum}-desc" class="description noborder highlighted-input">${todoObject.description}</textarea>
  `;

  // The New Todo button should always be last
  const newTodoDivBtn = projectElement.querySelector('.new-todo');
  projectElement.insertBefore(newTodoDiv, newTodoDivBtn);

  return newTodoDiv;
}

// Create new project in the #content div
export function addProjectInDOM(project) {
  if (project == null)
    return;

  const contentDiv = document.querySelector('#content');
  var newProjectDiv = document.createElement("div");
  newProjectDiv.classList.add('project', 'incomplete');
  newProjectDiv.id = `p${project.projectNum}`;
  newProjectDiv.innerHTML = `
    <div class="top-bar">
        <div class="title-and-due">
          <textarea id="p${project.projectNum}-title" rows="1" class="title highlighted-input noborder">${project.title}</textarea>
          <div>
            <label for="p${project.projectNum}-date">Due: </label>
            <input type="date" class="noborder highlighted-input" value="${project.dueDate}" id="p${project.projectNum}-date">
          </div>
        </div>
        <div class="buttons buttons">
          <button class="delete"><span>x</span></button>
          <button class="finish-proj"><span>✓</span></button>
          <button class="drag"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>drag</title><path d="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z" /></svg></button>
        </div>
      </div>
      <textarea id="p${project.projectNum}-desc" class="description highlighted-input noborder">${project.description}</textarea>
    </div>
    <div class="new-todo" id="p${project.projectNum}-t0">
        + New
    </div>
  `;

  contentDiv.appendChild(newProjectDiv);

  return newProjectDiv;
}

export function addEventListenersToProject(project, removeProjectFunction) {
  const DOMelement = project.DOMelement;
  const projectNum = project.projectNum;

  // Add eventListener for new todo
  const newTodoItem = DOMelement.querySelector('.new-todo');
  newTodoItem.addEventListener('click', project.addNewTodo.bind(project));

  // Add eventListeners on other buttons
  const toggleCompleteBTN = DOMelement.querySelector('.finish-proj');
  toggleCompleteBTN.addEventListener('click', project.toggleComplete.bind(project));
  const deleteProjectBTN = DOMelement.querySelector('.delete');
  deleteProjectBTN.addEventListener('click', () => removeProjectFunction(projectNum));
  const dragProjectBTN = DOMelement.querySelector('.drag');
  // Only want the drag button to enable dragging
  dragProjectBTN.addEventListener('mousedown', () => setDraggable(DOMelement, true));
  DOMelement.addEventListener('dragend', () => setDraggable(DOMelement, false));

  // Add eventListeners on text areas and date
  const titleText = DOMelement.querySelector(`#p${project.projectNum}-title`);
  titleText.addEventListener('input', project.updateValues.bind(project));
  const descText = DOMelement.querySelector(`#p${project.projectNum}-desc`);
  descText.addEventListener('input', project.updateValues.bind(project));
  const dateInput = DOMelement.querySelector(`#p${project.projectNum}-date`);
  dateInput.addEventListener('change', project.updateValues.bind(project));
}

export function addEventListenersToTodo(todoItem) {
  const DOMelement = todoItem.DOMelement;
  const project = todoItem.parentProject;

  // Add eventListeners on other buttons
  const toggleCompleteBTN = DOMelement.querySelector('.finish-todo');
  toggleCompleteBTN.addEventListener('click', todoItem.toggleComplete.bind(todoItem));
  const deleteTodoBTN = DOMelement.querySelector('.delete');
  deleteTodoBTN.addEventListener('click', () => project.removeTodo(todoItem));
  const dragTodoBTN = DOMelement.querySelector('.drag');
  // Only want the drag button to enable dragging
  dragTodoBTN.addEventListener('mousedown', () => setDraggable(DOMelement, true));
  DOMelement.addEventListener('dragend', () => setDraggable(DOMelement, false));

  // Add eventListeners on text areas and date
  const titleText = DOMelement.querySelector(".title");
  titleText.addEventListener('input', todoItem.updateValues.bind(todoItem));
  const descText = DOMelement.querySelector(".description");
  descText.addEventListener('input', todoItem.updateValues.bind(todoItem));
}

export function updateCompletionInDOM(element, isComplete) {

  // finish button has special behavior here:
  // lower tier (i.e. todo finish buttons) ARE disabled
  // but current tier (i.e. proj finish on proj or todo finish on todo) are NOT disabled
  let childElements = element.querySelectorAll('button:not(.finish-todo), input, textarea');
  if (element.classList.contains('project')) {
    childElements = element.querySelectorAll('button:not(.finish-proj), input, textarea')
  }

  if (isComplete) {
    element.classList.remove('incomplete');
    element.classList.add('complete');

    childElements.forEach((element) => {
      element.disabled = true;
    });
  }
  else {
    element.classList.add('incomplete');
    element.classList.remove('complete');

    childElements.forEach((element) => {
      element.disabled = false;
    });
  }
}

export function removeObjectInDOM(element) {
  element.remove();
}

export function clearObjectInDOM(element) {
  element.innerHTML = "";
}

// This will be called by clicking (or releasing) a drag button
export let draggedItem = null;
function setDraggable(element, state) {
  if (state) {
    element.setAttribute('draggable', 'true');
    element.classList.add('ghostly'); 
    draggedItem = element;
  }
  else {
    element.setAttribute('draggable', 'false');
    element.classList.remove('ghostly');
    draggedItem = null;
  }
}

// add drag and reorder event listener on #content div
export function addDragAndReorder() {
  const contentDiv = document.querySelector('#content');

  //These two preventDefaults() are required to have proper functioning of the 'drop' event, located elsewhere
  contentDiv.addEventListener('dragenter', (e) => {
    e.preventDefault();
  });

  contentDiv.addEventListener('dragover', (e) => {
    e.preventDefault();
    
    if (draggedItem.classList.contains('project')) {
      dragProject(e);
    } 
    else if (draggedItem.classList.contains('todo-item')){
      dragTodoItem(e);
    }
    
  });

  function dragProject(e) {
    const closestProject = e.target.closest('.project');

    if (closestProject && closestProject !== draggedItem) {
      const bounding = closestProject.getBoundingClientRect();
      const offsetY = e.clientY - bounding.top;
      
      if (offsetY < bounding.height / 2) {
        contentDiv.insertBefore(draggedItem, closestProject);
      } else {
        contentDiv.insertBefore(draggedItem, closestProject.nextSibling);
      }
    } else if (!closestProject && draggedItem) {
      // handle when dragging beyond the last item in the current row
      const lastProjectInRow = getLastProjectInRow(e.clientY);
      if (lastProjectInRow) {
        const bounding = lastProjectInRow.getBoundingClientRect();
        if (e.clientX > bounding.right) {
          contentDiv.insertBefore(draggedItem, lastProjectInRow.nextSibling);
        }
      }
    }
  }

  function dragTodoItem(e) {
    const projectDiv = e.target.closest('.project');
    // only allowing dragging / reordering within the todo-item's project
    if (projectDiv != null && projectDiv.id != draggedItem.id.split('-')[0])
      return;

    const closestTodoItem = e.target.closest('.todo-item');

    if (closestTodoItem && closestTodoItem !== draggedItem) {
      const bounding = closestTodoItem.getBoundingClientRect();
      const offsetY = e.clientY - bounding.top;
      
      if (offsetY < bounding.height / 2) {
        projectDiv.insertBefore(draggedItem, closestTodoItem);
      } else {
        projectDiv.insertBefore(draggedItem, closestTodoItem.nextSibling);
      }
    }
  }

  // helper function to get the last project in the row based on the Y position
  function getLastProjectInRow(clientY) {
    const allProjects = [...document.querySelectorAll('.project')];
    const projectsInSameRow = allProjects.filter((project) => {
      const bounding = project.getBoundingClientRect();
      return clientY >= bounding.top && clientY <= bounding.bottom;
    });

    if (projectsInSameRow.length > 0) {
      return projectsInSameRow[projectsInSameRow.length - 1]; // return the last project in the row
    }
    return null;
  }
}