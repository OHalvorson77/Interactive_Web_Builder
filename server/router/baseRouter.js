const express = require("express");
const router = express.Router();
const Page = require("../models/pages");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid"); 

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, passwordToCompare: password });
    await user.save();
    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("Testing user:", user);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    console.log(password, user.password);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    
    res.json({token: true});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/page/:id", async (req, res) => {
  const { components } = req.body;
  const { id } = req.params;

  try {
    const page = await Page.findOneAndUpdate(
      { id },
      { id, components },
      { upsert: true, new: true }
    );
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: "Failed to save page" });
  }
});

router.get("/page/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const page = await Page.findOne({ id });
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: "Failed to load page" });
  }
});

// Create new page for logged-in user
router.post("/pages", async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id; // assuming you set req.user in auth middleware

    const page = new Page({
      id: uuidv4(),
      name: name || "Untitled Canvas",
      components: [],
      userId
    });

    await page.save();
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ error: "Failed to create page" });
  }
});

router.get("/pages", async (req, res) => {
  try {
    const userId = req.user._id;
    const pages = await Page.find({ userId });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load pages" });
  }
});

module.exports = router;
