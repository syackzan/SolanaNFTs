const express = require('express');
const {verifyApiKey} = require('../Middleware/authMiddleware')
const {verifyAdminStatus} = require("../Middleware/adminCheck");
const {patchMissingAttributes, deleteAttributeFromAllNfts, replaceAttributeAcrossNfts} = require('../controllers/adminController');
const router = express.Router();

//Test Data
router.post('/patch', verifyAdminStatus, patchMissingAttributes);

router.post('/deleteAttri', verifyAdminStatus, deleteAttributeFromAllNfts);

router.post('/replaceAttri', verifyAdminStatus, replaceAttributeAcrossNfts);

module.exports = router;