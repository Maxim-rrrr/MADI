const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  email: String,
  password: String,
  balance: {
    type: Number,
    default: 0
  }
});

const Сustomer = mongoose.model("customer", customerSchema);

module.exports = Сustomer;