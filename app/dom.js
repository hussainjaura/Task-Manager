// create a task DOM element:
export function createTaskElement(
  // destructure task objects and use them as callbacks
  { _id, header, description, priority, starred, completed },
  onDelete,
  onUpdate,
  onStar,
  onComplete
) {
  // array of border color classes
  const borderColors = [
    "border-blue",
    "border-yellow",
    "border-red",
    "border-green",
    "border-purple",
  ];

  // to get a random color class
  const randomBorderColor =
    borderColors[Math.floor(Math.random() * borderColors.length)];

  const taskElement = document.createElement("div");
  taskElement.className = `task-collection ${randomBorderColor}`;
  taskElement.dataset.taskId = _id;
  //   adding as class complete if task is marked complete
  if (completed) {
    taskElement.classList.add("completed");
  }
  // create a span elemeent with a classs name of task-name
  const taskName = document.createElement("span");
  taskName.classList.add("task-name");
  taskName.textContent = header;
  //   to create and populate the priority with destructured objects
  const priorityHeader = document.createElement("span");
  priorityHeader.classList.add("priority-header");
  priorityHeader.setAttribute("data-priority", priority);
  priorityHeader.textContent = priority;
  //   create task paragraph for task description
  const taskPara = document.createElement("p");
  taskPara.textContent = description;
  //   button container for our buttons of task boxes
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  // delete button setup
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "🗑";
  deleteButton.addEventListener("click", onDelete);
  // update button setup
  const updateButton = document.createElement("button");
  updateButton.classList.add("update-button");
  updateButton.textContent = "✎";
  updateButton.addEventListener("click", onUpdate);
  // star button setup
  const starButton = document.createElement("button");
  starButton.classList.add("star-button");
  //   using ternary operator if starred then fill otherwise dont fill
  starButton.textContent = starred ? "★" : "☆";
  if (starred) {
    starButton.classList.add("starred");
  }
  //   event listener to activate the star
  starButton.addEventListener("click", onStar);
  // complete button settup
  const completeButton = document.createElement("button");
  completeButton.classList.add("complete-button");
  completeButton.textContent = completed ? "✘" : "✔";
  if (completed) {
    completeButton.classList.add("completed-task");
  }
  //   event listener for click event and trigger task completion
  completeButton.addEventListener("click", onComplete);

  //   append all buttton to the button container for UI
  buttonContainer.appendChild(deleteButton);
  buttonContainer.appendChild(updateButton);
  buttonContainer.appendChild(starButton);
  buttonContainer.appendChild(completeButton);

  //   append all parts of task to task element
  taskElement.appendChild(taskName);
  taskElement.appendChild(priorityHeader);
  taskElement.appendChild(taskPara);
  taskElement.appendChild(buttonContainer);

  return taskElement;
}
