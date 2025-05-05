// Import other modules
import { createTaskElement } from "./dom.js";
import { addTask, deleteTask, updateTask } from "./tasks.js";
import { showPopup } from "./popup.js";
import { toggleStarHandler, toggleStar } from "./star.js";
import { toggleComplete } from "./completed.js";
import { playSound } from "./sound.js";
import { initializeTimeDisplay } from "./time.js";
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

// to connect to render for deployement
const backendUrl =
  "https://task-manager-hoaa.onrender.com" || "http://127.0.0.1:3000";

// Initialize the Socket.IO client
window.socket = io(backendUrl, {
  transports: ["websocket"],
  withCredentials: true,
});

//console.log:
console.log("main.js working!");

// Change these declarations at the top of main.js
export let showingStarredOnly = false;
export let showingCompletedOnly = false;
export const taskArray = [];
export const starredTasks = [];

// to Make these available globally
window.taskArray = taskArray;
window.starredTasks = starredTasks;
window.showingStarredOnly = showingStarredOnly;
window.showingCompletedOnly = showingCompletedOnly;

// add a state variable to track what we're currently displaying
export function displayTasks(tasksToDisplay) {
  const taskContainer = document.getElementById("task-paragraph");
  taskContainer.innerHTML = "";

  // to filter out completed tasks from starred view
  let filteredTasks = tasksToDisplay;
  if (showingStarredOnly) {
    filteredTasks = tasksToDisplay.filter(
      (task) => task.starred && !task.completed
    );
  } else if (showingCompletedOnly) {
    filteredTasks = taskArray.filter((task) => task.completed);
  } else {
    filteredTasks = taskArray.filter((task) => !task.completed);
  }

  filteredTasks.forEach((task) => {
    if (!task) return;

    const taskElement = createTaskElement(
      {
        _id: task._id,
        header: task.header,
        description: task.description,
        priority: task.priority,
        starred: task.starred,
        completed: task.completed,
      },
      () => deleteTask(taskArray, taskElement, starredTasks),
      () => updateTask(taskArray, taskElement),
      () => toggleStar(taskArray, taskElement, starredTasks),
      () => toggleComplete(taskArray, taskElement)
    );

    taskContainer.appendChild(taskElement);
  });
}

// Make it globally available
window.displayTasks = displayTasks;

// added this function to fetch tasks from the database
export async function fetchTasks() {
  try {
    const response = await fetch(`${backendUrl}/api/tasks`);
    if (response.ok) {
      const tasks = await response.json();
      taskArray.length = 0;
      starredTasks.length = 0;

      tasks.forEach((task) => {
        const taskElement = createTaskElement(
          {
            _id: task._id,
            header: task.header,
            description: task.description,
            priority: task.priority,
            starred: task.starred,
            completed: task.completed,
          },
          () => deleteTask(taskArray, taskElement, starredTasks),
          () => updateTask(taskArray, taskElement),
          () => toggleStar(taskArray, taskElement, starredTasks),
          () => toggleComplete(taskArray, taskElement)
        );

        // added task to taskArray
        taskArray.push({
          _id: task._id,
          header: task.header,
          description: task.description,
          priority: task.priority,
          starred: task.starred,
          completed: task.completed,
          element: taskElement,
        });

        // only add to starredTasks if it's starred AND not completed
        if (task.starred && !task.completed) {
          starredTasks.push({
            _id: task._id,
            header: task.header,
            description: task.description,
            priority: task.priority,
            starred: task.starred,
            completed: task.completed,
            element: taskElement,
          });
        }
      });
      //   show tasks after fetching
      updateDisplayBasedOnFilter();
    } else {
      console.error("Failed to fetch tasks");
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    showPopup("Error fetching tasks from server");
  }
}

window.fetchTasks = fetchTasks;

// add this at the top with your other constants
const pageTitle = document.querySelector(".page-title");

// In your navigation click handler, update it to:
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-link");

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // to remove active class from all buttons
      navButtons.forEach((btn) => btn.classList.remove("active"));
      // to add active class to clicked button
      button.classList.add("active");

      // to check which button was clicked based on text content
      const buttonText = button.textContent.trim();

      if (buttonText.includes("Starred Tasks")) {
        showingStarredOnly = true;
        showingCompletedOnly = false;
        displayTasks(starredTasks);
        pageTitle.textContent = "Starred Tasks";
      } else if (buttonText.includes("Completed Tasks")) {
        showingStarredOnly = false;
        showingCompletedOnly = true;
        displayTasks(taskArray.filter((task) => task.completed));
        pageTitle.textContent = "Completed Tasks";
      } else {
        // regular tasks
        showingStarredOnly = false;
        showingCompletedOnly = false;
        displayTasks(taskArray.filter((task) => !task.completed));
        pageTitle.textContent = "Mr Jaura Tasks";
      }
    });
  });

  // initial load of tasks
  fetchTasks();

  // add this to your initialization code
  initializeTimeDisplay();
});

// this is a helper function to update display based on current filter
export function updateDisplayBasedOnFilter() {
  if (showingCompletedOnly) {
    displayTasks(taskArray.filter((task) => task.completed));
  } else if (showingStarredOnly) {
    // to only show starred tasks that are not completed
    displayTasks(starredTasks.filter((task) => !task.completed));
  } else {
    displayTasks(taskArray.filter((task) => !task.completed));
  }
}

// added this new function to handle view updates
export function updateTaskView() {
  if (showingStarredOnly) {
    displayTasks(starredTasks);
  } else if (showingCompletedOnly) {
    displayTasks(taskArray.filter((task) => task.completed));
  } else {
    displayTasks(taskArray.filter((task) => !task.completed));
  }
}
