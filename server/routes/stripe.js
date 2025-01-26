const express = require('express');
const {getPaymentIntent} = require('../controllers/stripeController');
const router = express.Router();

// POST /api/upload
router.get('/payment', getPaymentIntent);

module.exports = router;