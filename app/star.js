import { showPopup } from "./popup.js";
import {
  taskArray,
  starredTasks,
  showingStarredOnly,
  showingCompletedOnly,
  displayTasks,
  updateTaskView,
} from "./main.js";
import { playSound } from "./sound.js";

// to connect to render for deployement
const backendUrl =
  "https://task-manager-hoaa.onrender.com" || "http://127.0.0.1:3000";

// function for toggling star, used for reuseability
export const toggleStarHandler = async (taskElement) => {
  // passed starredTasks as an argument
  await toggleStar(taskArray, taskElement, starredTasks);
};

// main function to handle toggling the starred state of task
export async function toggleStar(taskArray, taskElement, starredTasksArray) {
  // extract task id
  const taskId = taskElement.dataset.taskId;
  const task = taskArray.find((task) => task._id === taskId);
  //   to get reference to star button inside task element
  const starButton = taskElement.querySelector(".star-button");

  if (!task) {
    showPopup("Task not found!");
    return;
  }

  try {
    // sending a put request to backend to update the starred state
    const response = await fetch(`${backendUrl}/api/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      // existing tasks and change the starred field from false to true
      body: JSON.stringify({
        ...task,
        starred: !task.starred,
      }),
    });
    // if the task star was successfull update the local state of tasks
    if (response.ok) {
      const updatedTask = await response.json();
      task.starred = updatedTask.starred;

      if (task.starred) {
        // update the star button to fill if task is starred
        starButton.textContent = "★";
        starButton.classList.add("starred");
        // add task to starred task array that is for filtering
        starredTasksArray.push({ ...task, element: taskElement });
        // play complete sound
        playSound("complete");
      } else {
        // else un fill the star button
        starButton.textContent = "☆";
        starButton.classList.remove("starred");
        // remove task from starredTaskArray
        const index = starredTasksArray.findIndex((t) => t._id === task._id);
        if (index > -1) {
          starredTasksArray.splice(index, 1);
        }
        // play sound on un star
        playSound("complete");
      }

      // notify other users about task update
      window.socket.emit("taskUpdated", {
        action: "update",
        task: updatedTask,
      });
      //   popup confirmation of task starred
      showPopup(task.starred ? "Task starred!" : "Task unstarred!", true);
    }
  } catch (error) {
    console.error("Error toggling star:", error);
    showPopup("Failed to update star status");
  }
}
