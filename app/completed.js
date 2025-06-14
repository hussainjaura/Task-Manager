import { showPopup } from "./popup.js";
import {
  taskArray,
  starredTasks,
  showingStarredOnly,
  showingCompletedOnly,
  displayTasks,
} from "./main.js";
import { playSound } from "./sound.js";

// this function toggles the complete task
export async function toggleComplete(taskArray, taskElement) {
  // get tasks unique id
  const taskId = taskElement.dataset.taskId;
  //   to find the object using id
  const task = taskArray.find((task) => task._id === taskId);
  const completeButton = taskElement.querySelector(".complete-button");

  if (!task) {
    showPopup("Task not found!");
    return;
  }

  try {
    // send a put request to backend to update task complete status from false to true
    const response = await fetch(
      `http://localhost:3000/api/tasks/${task._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // include all the tasks and make task from false to true
        body: JSON.stringify({
          ...task,
          completed: !task.completed,
        }),
      }
    );

    // if response was successfull give task object completed status
    if (response.ok) {
      const updatedTask = await response.json();
      task.completed = updatedTask.completed;
      // to update the DOM and UI elements
      if (task.completed) {
        completeButton.textContent = "✘";
        completeButton.classList.add("completed-task");
        taskElement.classList.add("completed");
        // play complete sound up on cicking tick
        playSound("complete");
      } else {
        // otherwise reset the button icon
        completeButton.textContent = "✔";
        completeButton.classList.remove("completed-task");
        taskElement.classList.remove("completed");
        // play the sound again
        playSound("complete");
      }

      // emit socket event for task update
      window.socket.emit("taskUpdated", {
        action: "update",
        task: updatedTask,
      });
      //   show the popup upon decision made by user
      showPopup(task.completed ? "Task completed!" : "Task uncompleted!", true);
    }
  } catch (error) {
    console.error("Error toggling complete:", error);
    showPopup("Failed to update completion status");
  }
}
