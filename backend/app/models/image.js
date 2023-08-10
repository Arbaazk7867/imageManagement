const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: String,
  description: String,
  keywords: [String],
  uniqueIdentifier: String,
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', imageSchema);
