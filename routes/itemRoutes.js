const express = require("express");
const router = express.Router();
const Item = require("../models/Item.js");

// @route   POST api/items
// @desc    Report a new lost/found item
router.post("/", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET api/items
// @desc    Get all reported items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ dateReported: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
