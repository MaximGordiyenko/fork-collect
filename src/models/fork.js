const mongoose = require('mongoose');

const ForkSchema = new mongoose.Schema({
  creation_date: {
    type: Date
  },
  createForkName: {
    type: String,
    required: true,
    trim: true,
  },
  createForkMessage: {
    type: String,
    required: true,
    trim: true,
  },
  createForkType: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
    trim: true,
  }
});

const Truck = mongoose.model('Fork', ForkSchema);
module.exports = Truck;
