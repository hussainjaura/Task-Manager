// importing dependencies and modules
import {
  taskArray,
  starredTasks,
  displayTasks,
  fetchTasks,
  updateDisplayBasedOnFilter,
} from "./main.js";
import { showPopup } from "./popup.js";
import { playSound } from "./sound.js";

import { createTaskElement } from "./dom.js";
import { addTask, deleteTask, updateTask } from "./tasks.js";
import { toggleStarHandler, toggleStar } from "./star.js";
import { toggleComplete } from "./completed.js";

console.log("uiManager.js loaded successfully");
// DOM Elements
const taskHeader = document.getElementById("task-name-input");
const taskDescription = document.getElementById("task-description-input");
const taskPriority = document.getElementById("task-priorities");
const modal = document.getElementById("add-task-modal");
const addTaskBtn = document.getElementById("add-task-btn");
const closeModal = document.querySelector(".close-modal");

// function to clear input fields
function clearInputs() {
  taskHeader.value = "";
  taskDescription.value = "";
  taskPriority.value = "Low";
}

// load tasks when page reloads or initially loads
document.addEventListener("DOMContentLoaded", fetchTasks);

// show modal when add task button is clicked
addTaskBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

// close when cross is clicked
closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
  clearInputs();
});

// close the popup modal when clicked anywhere outside modal
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    clearInputs();
  }
});

// Input validation: to limit task header length to 12 characters
taskHeader.addEventListener("input", () => {
  if (taskHeader.value.length > 12) {
    showPopup("Task header cannot exceed 12 characters!");
    taskHeader.value = taskHeader.value.slice(0, 12);
  }
});

// limit task description upto 200 characters
taskDescription.addEventListener("input", () => {
  if (taskDescription.value.length > 200) {
    showPopup("Task description cannot exceed 200 characters!");
    taskDescription.value = taskDescription.value.slice(0, 200);
  }
});

// handler to add a new task
document.getElementById("add-button").addEventListener("click", async () => {
  const taskHeaderValue = taskHeader.value.trim();
  const taskDescriptionValue = taskDescription.value.trim();
  const taskPriorityValue = taskPriority.value;

  if (!taskHeaderValue || !taskDescriptionValue || !taskPriorityValue) {
    showPopup("Please enter Task and Description!");
    return;
  }

  try {
    // sending a post request to server to add a new task
    const response = await fetch("http://127.0.0.1:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        header: taskHeaderValue,
        description: taskDescriptionValue,
        priority: taskPriorityValue,
        starred: false,
        completed: false,
      }),
    });

    if (response.ok) {
      const newTask = await response.json();

      // to create task element
      const taskElement = createTaskElement(
        {
          _id: newTask._id,
          header: newTask.header,
          description: newTask.description,
          priority: newTask.priority,
          starred: newTask.starred,
          completed: newTask.completed,
        },
        () => deleteTask(taskArray, taskElement, starredTasks),
        () => updateTask(taskArray, taskElement),
        () => toggleStar(taskArray, taskElement, starredTasks),
        () => toggleComplete(taskArray, taskElement)
      );

      // Add task to the array
      addTask(
        taskArray,
        newTask.header,
        newTask.description,
        newTask.priority,
        taskElement,
        newTask._id
      );

      // to clear input fields
      taskHeader.value = "";
      taskDescription.value = "";
      taskPriority.value = "Low";

      //   play add sound and show success popup
      playSound("add");
      showPopup("Task added successfully!", true);

      // notify other users about task add
      window.socket.emit("taskUpdated", {
        action: "add",
        task: newTask,
      });

      // Refresh the display
      if (!showingCompletedOnly && !showingStarredOnly) {
        displayTasks(taskArray.filter((task) => !task.completed));
      }

      // After successful task addition:
      modal.classList.remove("show");
      clearInputs();
    }
  } catch (error) {
    console.error("Error adding task:", error);
    showPopup("Failed to add task. Please try again.");
  }
});

// Event listener for clicking the "Star" or "Unstar" button
document.body.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("star-button")) {
    const taskId = event.target.dataset.taskId;
    const task = taskArray.find((t) => t._id === taskId);

    if (task) {
      // toggle star state and update UI
      task.starred = !task.starred;
      event.target.textContent = task.starred ? "Unstar" : "Star";

      // update starred task array
      if (task.starred) {
        if (!starredTasks.some((t) => t._id === taskId)) {
          starredTasks.push(task);
        }
      } else {
        const index = starredTasks.findIndex((t) => t._id === taskId);
        if (index !== -1) starredTasks.splice(index, 1);
      }
      //   rewfresh display
      displayTasks(taskArray.filter((t) => !t.completed));

      // notify other users through web socket
      window.socket.emit("taskUpdated", {
        action: "update",
        task: task,
      });
    }
  }
});

// to track which filter is active
let showingStarredOnly = false;
let showingCompletedOnly = false;

// to handle the navigation button clicks
document.addEventListener("DOMContentLoaded", () => {
  // get all navigation buttons
  const navButtons = document.querySelectorAll(".nav-link");

  // add click handlers for each button
  navButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // remove active class from all buttons
      navButtons.forEach((btn) => btn.classList.remove("active"));
      // add active class to clicked button
      this.classList.add("active");

      // check which button was clicked based on text content
      const buttonText = this.textContent.trim();

      if (buttonText.includes("Completed Tasks")) {
        showingCompletedOnly = true;
        showingStarredOnly = false;

        const completedTasks = taskArray.filter((task) => task.completed);
        if (completedTasks.length > 0) {
          displayTasks(completedTasks);
        } else {
          showPopup("No completed tasks to display!");
          displayTasks([]);
        }
      } else if (buttonText.includes("Starred Tasks")) {
        showingStarredOnly = true;
        showingCompletedOnly = false;

        if (starredTasks.length > 0) {
          displayTasks(starredTasks);
        } else {
          showPopup("No starred tasks to display!");
          displayTasks([]);
        }
      } else {
        // show regular tasks
        showingStarredOnly = false;
        showingCompletedOnly = false;
        displayTasks(taskArray.filter((task) => !task.completed));
      }
    });
  });
});
