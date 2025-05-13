
// backend/models/Update.js
const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  farmer: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Update', updateSchema);
