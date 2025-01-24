const express = require('express');
const {verifyApiKey} = require('../Middleware/authMiddleware')
const {getInGameCurrency} = require('../controllers/gameController');
const router = express.Router();

//Test Data
router.get('/usercoins', getInGameCurrency);

module.exports = router;