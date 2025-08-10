const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const pageRoutes = require("./router/baseRouter"); // your router file

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/pagebuilder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api", pageRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
