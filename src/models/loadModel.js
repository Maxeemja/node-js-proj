const mongoose = require('mongoose');
const {loadStatus, loadStates} = require('../const');

const Load = mongoose.model('Load', {
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
  },

  status: {
    type: String,
    enum: Object.keys(loadStatus),
    default: 'NEW',
    require: true,
  },

  state: {
    type: String,
    enum: loadStates,
  },

  name: {
    type: String,
    required: true,
  },

  payload: {
    type: Number,
    required: true,
  },

  pickup_address: {
    type: String,
    required: true,
  },

  delivery_address: {
    type: String,
    required: true,
  },

  dimensions: {
    type: Object,
    width: {
      required: true,
      type: String,
    },
    height: {
      required: true,
      type: String,
    },
    length: {
      required: true,
      type: String,
    },
  },

  logs: {
    type: [{
      message: String,
      time: {
        type: Date,
        default: Date.now(),
      },
    }],
  },

  created_date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = {Load};
