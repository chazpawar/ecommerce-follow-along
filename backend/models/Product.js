const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  images: { type: [String], required: true },  // Array of image URLs
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
