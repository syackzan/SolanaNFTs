const express = require('express');
const {verifyApiKey} = require('../Middleware/authMiddleware')
const {getInGameCurrency, deductInGameCurrency} = require('../controllers/gameController');
const router = express.Router();

//Test Data
router.get('/usercoins', verifyApiKey, getInGameCurrency);

router.post('/deductcoins', verifyApiKey, deductInGameCurrency);

module.exports = router;