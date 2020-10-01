const { Schema, model } = require("mongoose");


const paymentSchema = new Schema({
  id: { type: String, required: true, unique: true },
});

const Payment = model("Payment", paymentSchema);

module.exports = Payment;