const { Schema, model, Types } = require("mongoose");


const customerSchema = new Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  balance:  { type: Number, default: 0 },
  inviting: { type: String, default: '' },
  orders:   [{ type: Types.ObjectId, ref: 'order' }]
});

const Сustomer = model("Customer", customerSchema);

module.exports = Сustomer;