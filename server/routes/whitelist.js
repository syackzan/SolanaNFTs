const express = require('express');
const {getWhitelistAddresses, submitAddress, deductUsage} = require('../controllers/whitelistController')
const router = express.Router();

//GET /api/nft/all
router.get('/get', getWhitelistAddresses);

router.post('/add', submitAddress);

router.post('/deduct', deductUsage);

module.exports = router;