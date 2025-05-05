// importing express
import express from "express";
import Task from "../database/taskSchema.js";
import { error } from "console";

const router = express.Router();

//router to add tasks:
router.post("/tasks", async (req, res) => {
  const { header, description, priority } = req.body;
  // to validate input
  if (!header || !description || !priority) {
    return res
      .status(400)
      .send(error)
      .json({ messge: "Task name, description and priority are required." });
  }

  try {
    // create and save the task
    const newTask = new Task({ header, description, priority });
    console.log("Task to Save:", newTask);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occuered while creating task:", error });
  }
});

//to retreive all tasks:
router.get("/tasks", async (req, res) => {
  // to fetch tasks from database
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "faced an error while fetching tasks", error });
  }
});

//to update the tasks:
// Updated PUT route to handle starred field
router.put("/tasks/:id", async (req, res) => {
  try {
    const updates = {
      header: req.body.header,
      description: req.body.description,
      priority: req.body.priority,
      starred: req.body.starred,
      completed: req.body.completed,
    };
    // to find and update the task
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//delete tasks by id
router.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Received DELETE request for task with ID: ${id}`);

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task is not found!" });
    }

    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Faced an error while Deleting task:", error });
  }
});

export default router;
