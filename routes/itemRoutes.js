const express = require("express");
const router = express.Router();
const Item = require("../models/Item.js");
const upload = require("../config/cloudinary.js"); // Import the upload middleware

// @route   POST api/items
// @desc    Report a new item with an image
// 'image' must match the 'name' attribute of the file input on the frontend
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const itemData = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      category: req.body.category,
      location: req.body.location,
      // If a file was uploaded, read the Cloudinary path URL, otherwise default to empty string
      image: req.file ? req.file.path : "",
    };

    const newItem = new Item(itemData);
    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET route remains unchanged...
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ dateReported: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
