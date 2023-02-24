const mongoose = require('mongoose');

const Book = mongoose.model('Book', {
  title: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  genre: String,
  description: String,
  author: {
    type: String,
    required: true,
  },
  year: Number,
  pages: Number,
  rating: Number,
  language: String,
  tags: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = {Book};
