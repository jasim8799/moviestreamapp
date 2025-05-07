const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tmdbId: {
    type: String,
  },
}, {
  timestamps: true,
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
