const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
});

module.exports = mongoose.model("Employees", userSchema);
