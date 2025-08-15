const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  id: { type: String, required: true }, // your custom ID for frontend
  name: { type: String, default: "Untitled Canvas" },
  components: { type: Array, default: [] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Page", pageSchema);
