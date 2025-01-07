const express = require('express');
const router = express.Router();
const uploadRoutes = require('./upload');
const nftRoutes = require('./nft');

// Combine all route files
router.use('/upload', uploadRoutes);
router.use('/nft', nftRoutes);

module.exports = router;
