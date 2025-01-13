const express = require('express');
const {verifyApiKey} = require('../Middleware/authMiddleware')
const {checkUserRole} = require('../controllers/userController');
const router = express.Router();

//GET /api/nft/all
router.post('/role', checkUserRole);

module.exports = router;
