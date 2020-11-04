const { Schema, model } = require("mongoose");


const customerSchema = new Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token:    { type: String, default: 0 },
  balance:  { type: Number, default: 0 },
  inviting: { type: String, default: '' },
  orders:   { type: Array , default: [] },
  summa:    { type: Number, default: 0 }
});

const Сustomer = model("Customer", customerSchema);

module.exports = Сustomer;