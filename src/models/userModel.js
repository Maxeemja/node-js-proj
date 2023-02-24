const mongoose = require('mongoose');

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    unique: true,
  },

  role: {
    type: String,
    required: true,
    enum: ['SHIPPER', 'DRIVER'],
  },

  password: {
    type: String,
    required: true,
  },

  created_date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = {User};
