const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["Lost", "Found"], required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String },
  dateReported: { type: Date, default: Date.now },
  status: { type: String, enum: ["Active", "Resolved"], default: "Active" },
});

module.exports = mongoose.model("Item", ItemSchema);
