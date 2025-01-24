const express = require('express');
const router = express.Router();
const uploadRoutes = require('./upload');
const nftRoutes = require('./nft');
const userRoutes = require('./users');
const gameRoutes = require('./game');

// Combine all route files
router.use('/upload', uploadRoutes);
router.use('/nft', nftRoutes);
router.use('/user', userRoutes );
router.use('/boohbrawlers', gameRoutes);

module.exports = router;
