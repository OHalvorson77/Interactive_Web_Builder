const express = require("express");
const router = express.Router();
const Page = require("./models/Page");

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

module.exports = router;
