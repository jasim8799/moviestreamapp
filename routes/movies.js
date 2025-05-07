const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const multer = require('multer');
const path = require('path');

// Multer setup for video uploads (optional)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists or create it
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  }
});
const upload = multer({ storage: storage });

// POST /api/movies - Add a new movie
router.post('/', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json({ message: 'Movie saved successfully', movieId: savedMovie._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/movies - List all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/movies/:id - Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = 'uploads';

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const Movie = require('../models/Movie');

// Optional: POST /api/movies/upload - Upload video file and create movie
router.post('/upload', (req, res) => {
  console.log('Upload request received');
  upload.single('video')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: 'Multer uploading error: ' + err.message });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ error: 'Unknown uploading error: ' + err.message });
    }

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File uploaded:', req.file.filename);

    // Create a new movie document with placeholder values and videoUrl set to uploaded file path
    try {
      const newMovie = new Movie({
        title: req.body.title || 'Untitled',
        category: req.body.category || 'Uncategorized',
        releaseDate: req.body.releaseDate || new Date(),
        videoUrl: '/uploads/' + req.file.filename,
        description: req.body.description || '',
        tmdbId: req.body.tmdbId || '',
      });
      const savedMovie = await newMovie.save();
      res.status(201).json({ message: 'File uploaded and movie created successfully', movie: savedMovie });
    } catch (saveError) {
      console.error('Error saving movie:', saveError);
      res.status(500).json({ error: 'File uploaded but failed to save movie: ' + saveError.message });
    }
  });
});

module.exports = router;
