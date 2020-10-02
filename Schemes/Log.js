const { Schema, model } = require("mongoose");


const logSchema = new Schema({
  time:     { type: String, required: true},
  status:   { type: String },
  message:  { type: String }
});

const Log = model("Log", logSchema);

module.exports = Log;