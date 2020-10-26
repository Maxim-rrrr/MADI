const { Schema, model } = require("mongoose");


const taskSchema = new Schema({
  name: { type: String, required: true, unique: true },
  model: { type: Number, required: true, default: 0 },
  public: { type: Boolean, default: false },
  tasks: { type: Array, default: [] }
});

const Task = model("Task", taskSchema);

module.exports = Task;