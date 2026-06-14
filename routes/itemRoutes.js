const express = require("express");
const router = express.Router();
const Item = require("../models/Item.js");
const upload = require("../config/cloudinary.js"); // Import the upload middleware
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary within the router to allow deletions
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      contact: req.body.contact,
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

router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.Schatz || req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 1. If the item has an image, delete it from Cloudinary first
    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId);
    }

    // 2. Delete the document record from MongoDB
    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: "Item successfully resolved and data cleared clean." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
