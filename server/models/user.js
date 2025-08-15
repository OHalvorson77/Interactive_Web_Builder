const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  passwordToCompare: { type: String, required: true }, // For comparison purposes
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);