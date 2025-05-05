import mongoose from "mongoose";

// defined schema for tasks
const taskSchema = new mongoose.Schema({
  header: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, required: true },
  starred: { type: Boolean, default: false }, // Added the starred field, defaulting to false in db
  completed: { type: Boolean, default: false }, // Added completed field, default to false in db
});

// created a mongoose model based on task schema
const Task = mongoose.model("Task", taskSchema);

export default Task;
