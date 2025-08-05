const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  components: { type: Array, required: true },
});

module.exports = mongoose.model("Page", PageSchema);
