const { Schema, model } = require("mongoose");


const taskSchema = new Schema({
  name: { type: String, required: true, unique: true },
  works: { type: Array, default: [] }
});

const Task = model("Task", taskSchema);

module.exports = Task;