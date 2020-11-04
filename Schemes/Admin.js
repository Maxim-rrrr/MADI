const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  name:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token:    { type: String, required: true, unique: true }
});

const Admin = model("Admin", adminSchema);

module.exports = Admin;