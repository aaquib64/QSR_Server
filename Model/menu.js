const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String, // e.g., "Beverages", "Snacks"
});

module.exports = mongoose.model("menu", menuSchema, "menu");
