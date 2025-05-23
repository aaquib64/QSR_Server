// models/Menu.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  image: String,
});

const MenuSchema = new mongoose.Schema({
  category: String,
  items: [ItemSchema],
});

module.exports = mongoose.model('menu', MenuSchema);
