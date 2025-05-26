const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
 menuItems: {
    type: [String],  // Array of strings for menu item names
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  paymentMode: String,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
