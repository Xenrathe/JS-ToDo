// Automatically adjusts the height of all the various textareas (both growing and getting smaller)
export function addTextAreaHeightAdjusters(){
  const textAreas = document.querySelectorAll('textarea');
  textAreas.forEach((textArea) => {
    textArea.addEventListener('input', () => {
      textArea.style.height = 'auto'; // Reset the height
      let newHeight = textArea.scrollHeight;
      console.log(`newHeight is ${newHeight}`);

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
export function addNewTodoInDOM(projectElement, projectNum, todoNum) {
  let newTodoDiv = document.createElement("div");
  newTodoDiv.classList.add('todo-item', 'incomplete');
  newTodoDiv.id = `p${projectNum}-t${todoNum}`;
  newTodoDiv.innerHTML = `
    <div class="top-bar">
      <textarea id="p${projectNum}-t${todoNum}-title" rows="1" class="title highlighted-input noborder">Todo #${todoNum}</textarea>
      <div class="buttons">
        <button class="delete"><span>x</span></button>
        <button class="finish-todo"><span>✓</span></button>
        <button class="drag"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>drag</title><path d="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z" /></svg></button>
      </div>
    </div>
    <textarea id="p${projectNum}-t${todoNum}-desc" class="description noborder highlighted-input">[description here]</textarea>
  `;

  // The New Todo button should always be last
  const newTodoDivBtn = projectElement.querySelector('.new-todo');
  projectElement.insertBefore(newTodoDiv, newTodoDivBtn);

  return newTodoDiv;
}

// Create new project in the #content div
export function addNewProjectInDOM(projectNum) {
  const contentDiv = document.querySelector('#content');
  var newProjectDiv = document.createElement("div");
  newProjectDiv.classList.add('project', 'incomplete');
  newProjectDiv.id = `p${projectNum}`;
  newProjectDiv.innerHTML = `
    <div class="top-bar">
        <div class="title-and-due">
          <textarea id="p${projectNum}-title" rows="1" class="title highlighted-input noborder">Project #${projectNum}</textarea>
          <div>
            <label for="p${projectNum}-date">Due: </label>
            <input type="date" class="noborder highlighted-input" value="2024-09-08" id="p${projectNum}-date">
          </div>
        </div>
        <div class="buttons buttons">
          <button class="delete"><span>x</span></button>
          <button class="finish-proj"><span>✓</span></button>
          <button class="drag"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>drag</title><path d="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z" /></svg></button>
        </div>
      </div>
      <textarea id="p${projectNum}-desc" class="description highlighted-input noborder">[description here]</textarea>
    </div>
    <div class="new-todo todo-item" id="p${projectNum}-t0">
        + New
    </div>
  `;

  contentDiv.appendChild(newProjectDiv);
  return newProjectDiv;
}

export function toggleCompletionInDOM(element) {

  // finish button has special behavior here:
  // lower tier (i.e. todo finish buttons) ARE disabled
  // but current tier (i.e. proj finish on proj or todo finish on todo) are NOT disabled
  let childElements = element.querySelectorAll('button:not(.finish-todo), input, textarea');
  if (element.classList.contains('project')) {
    childElements = element.querySelectorAll('button:not(.finish-proj), input, textarea')
  }

  if (element.classList.contains('incomplete')) {
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
      console.log(element);
      element.disabled = false;
    });
  }
}

export function removeObjectInDOM(element) {
  element.remove();
}