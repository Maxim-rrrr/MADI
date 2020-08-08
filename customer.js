const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  email: String,
  password: String,
  balance: {
    type: Number,
    default: 0
  },
  invitation: {
    type: Boolean,
    default: false,
  },
  inviting: {
    type: String,
    default: ''
  }
});

const Сustomer = mongoose.model("customer", customerSchema);

module.exports = Сustomer;