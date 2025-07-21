const express = require('express');
const {verifyApiKey} = require('../Middleware/authMiddleware')
const {verifyAdminStatus} = require("../Middleware/adminCheck");
const {patchMissingAttributes, 
    deleteAttributeFromAllNfts,
     replaceAttributeAcrossNfts, 
     rollForAllServerItems,
    replaceBlueprintMetadata
} = require('../controllers/adminController');
const router = express.Router();

//Test Data
router.post('/patch', verifyAdminStatus, patchMissingAttributes);

router.post('/deleteAttri', verifyAdminStatus, deleteAttributeFromAllNfts);

router.post('/replaceAttri', verifyAdminStatus, replaceAttributeAcrossNfts);

router.post('/rollallitems', verifyAdminStatus, rollForAllServerItems);

router.post('/replaceBlueprintMD', verifyApiKey, verifyAdminStatus, replaceBlueprintMetadata)

module.exports = router;