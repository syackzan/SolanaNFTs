const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // MongoDB connection
const routes = require('./routes'); // All routes combined

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// API routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

