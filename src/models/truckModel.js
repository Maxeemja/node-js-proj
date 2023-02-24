const mongoose = require('mongoose');
const {TRUCK_TYPES} = require('../const');

const Truck = mongoose.model('Truck', {
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
  },

  status: {
    type: String,
    enum: ['OL', 'IS'],
    default: 'IS',
  },

  type: {
    type: String,
    enum: Object.keys(TRUCK_TYPES),
  },

  created_date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = {Truck};
