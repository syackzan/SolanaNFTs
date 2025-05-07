const express = require('express');
const router = express.Router();
const uploadRoutes = require('./upload');
const nftRoutes = require('./nft');
const userRoutes = require('./users');
const gameRoutes = require('./game');
const stripeRoutes = require('./stripe');
const characterRoutes = require('./character');
const whitelistRoutes = require('./whitelist');
const timezoneRoutes = require('./time')

// Combine all route files
router.use('/upload', uploadRoutes);
router.use('/nft', nftRoutes);
router.use('/user', userRoutes );
router.use('/boohbrawlers', gameRoutes);
router.use('/stripe', stripeRoutes);
router.use('/character-submission', characterRoutes);
router.use('/whitelist', whitelistRoutes);
router.use('/timezone', timezoneRoutes);

module.exports = router;
