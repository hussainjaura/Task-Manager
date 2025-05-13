import { showPopup } from "./popup.js";
import { toggleStarHandler, toggleStar } from "./star.js";
import { playSound } from "./sound.js";
import {
  showingStarredOnly,
  showingCompletedOnly,
  starredTasks,
  updateTaskView,
} from "./main.js";

//adding tasks to the main task array
export function addTask(
  taskArray,
  header,
  description,
  priority,
  taskElement,
  taskId
) {
  taskArray.push({
    header,
    description,
    priority,
    element: taskElement,
    _id: taskId,
  });
}

//delete tasks from the array and DOM:
export async function deleteTask(taskArray, taskElement, starredTasksArray) {
  const taskId = taskElement.dataset.taskId;
  //   to find the task in the array
  const taskForDelete = taskArray.find((task) => task._id === taskId);
  // if not found show an error
  if (!taskForDelete) {
    showPopup("Task not found for deletion!");
    return;
  }

  try {
    // send a delete requet to the backend
    const response = await fetch(
      `http://localhost:3000/api/tasks/${taskForDelete._id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      // Remove from DOM and arrays
      const parentContainer = taskElement.parentNode;
      if (!parentContainer) {
        showPopup("Error: Parent container not found!");
        return;
      }

      parentContainer.removeChild(taskElement);

      // remove tasks from main array
      const mainTaskIndex = taskArray.findIndex((task) => task._id === taskId);
      if (mainTaskIndex > -1) {
        taskArray.splice(mainTaskIndex, 1);
      }
      //   also remove from the starred task array if its inside the array
      if (starredTasksArray) {
        const starredIndex = starredTasksArray.findIndex(
          (task) => task._id === taskId
        );
        if (starredIndex > -1) {
          starredTasksArray.splice(starredIndex, 1);
        }
      }

      // notify other users about task deletion
      window.socket.emit("taskUpdated", {
        action: "delete",
        taskId: taskId,
      });
      //   play delete sound and update the user by popup
      playSound("delete");
      showPopup("Task deleted successfully!", true);
    } else {
      showPopup("Failed to delete task!");
    }
  } catch (error) {
    showPopup("Error deleting task. Please try again.");
  }
}

//function to update the task with modal popup
export async function updateTask(taskArray, taskElement) {
  const taskId = taskElement.dataset.taskId;
  //   find the task to update
  const task = taskArray.find((task) => task._id === taskId);

  if (!task) {
    showPopup("Task not found!");
    return;
  }

  // Get the modal and its elements
  const modal = document.getElementById("update-task-modal");
  const headerInput = document.getElementById("update-task-name");
  const descriptionInput = document.getElementById("update-task-description");
  const priorityInput = document.getElementById("update-task-priority");
  const saveButton = document.getElementById("save-update-btn");
  const closeButton = modal.querySelector(".close-modal");

  // Pre-fill the inputs with current task data
  headerInput.value = task.header;
  descriptionInput.value = task.description;
  priorityInput.value = task.priority;

  // show the modal
  modal.classList.add("show");

  // handle close button click
  closeButton.onclick = () => {
    modal.classList.remove("show");
  };

  // handle click outside modal
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.classList.remove("show");
    }
  };

  // this is to handle save button click
  saveButton.onclick = async () => {
    const newHeader = headerInput.value.trim();
    const newDescription = descriptionInput.value.trim();
    const newPriority = priorityInput.value;
    // validate inputs
    if (!newHeader || !newDescription) {
      showPopup("Please fill in all fields!");
      return;
    }
    // send a put request to the backend to update task
    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            header: newHeader,
            description: newDescription,
            priority: newPriority,
            starred: task.starred,
            completed: task.completed,
          }),
        }
      );

      if (response.ok) {
        const updatedTask = await response.json();
        // update task in the local array
        Object.assign(task, updatedTask);

        // notify other users using web sockets about task update
        window.socket.emit("taskUpdated", {
          action: "update",
          task: updatedTask,
        });
        // show sucess message and hide the modal
        showPopup("Task updated successfully!", true);
        modal.classList.remove("show");

        // Update the display
        if (window.displayTasks) {
          window.displayTasks(taskArray);
        }
      }
    } catch (error) {
      console.error("Error updating task:", error);
      showPopup("Failed to update task");
    }
  };
}
