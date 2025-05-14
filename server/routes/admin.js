const express = require('express');
const {verifyApiKey} = require('../Middleware/authMiddleware')
const {verifyAdminStatus} = require("../Middleware/adminCheck");
const {patchMissingAttributes, deleteAttributeFromAllNfts} = require('../controllers/adminController');
const router = express.Router();

//Test Data
router.post('/patch', verifyAdminStatus, patchMissingAttributes);

router.post('/deleteAttri', verifyAdminStatus, deleteAttributeFromAllNfts);

module.exports = router;