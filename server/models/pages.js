const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, default: "Untitled Canvas" },
  components: { type: Array, default: [] },
  userId: { type: String, required: true }
});

module.exports = mongoose.model("Page", pageSchema);
