const mongoose = require('mongoose');

const requestItemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
    unique:false
  },
  tag: {
    type: String,
    required: true,
    trim: false,
    unique: false
  }
});

requestItemSchema.index({ userId: 1, tag: 1 }, { unique: true });


module.exports = mongoose.model('RequestItem', requestItemSchema);
