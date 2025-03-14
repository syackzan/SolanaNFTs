const express = require('express');
const {getWhitelistAddresses, submitAddress} = require('../controllers/whitelistController')
const router = express.Router();

//GET /api/nft/all
router.get('/get', getWhitelistAddresses);

router.post('/add', submitAddress);

module.exports = router;