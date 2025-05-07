const express = require('express');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movies');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // Changed port to 3000

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB Atlas
const mongoURI = 'mongodb+srv://mdjasimm107:rsCioL4KMPdSISS0@movipro.cziuwhh.mongodb.net/';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/movies', movieRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
