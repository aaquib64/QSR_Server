const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
   role: {
    type: String,
    enum: ['employee', 'manager', 'supervisor'],
    default: 'employee',
  }
});

module.exports = mongoose.model("Employees", userSchema);
