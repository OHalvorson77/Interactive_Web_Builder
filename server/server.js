const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const pageRoutes = require("./router/baseRouter"); // your router file
const cors = require("cors");


const app = express();

// Middleware
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/Interactive_ui", {
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
