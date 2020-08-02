const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  email: String,
  password: String,
  balance: Number
});

const Сustomer = mongoose.model("customer", customerSchema);

module.exports = Сustomer;