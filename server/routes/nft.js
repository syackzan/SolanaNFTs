const express = require('express');
const {verifyApiKey} = require('../Middleware/authMiddleware')
const { 
    getAllMetadata, 
    createNftMetadata, 
    deleteNftMetadata, 
    updateNftMetadata, 
    updateMetadataUri, 
    voteForNFT, 
    testData, 
    createAndSendNFT,
    getCoreNFTs,
    getMetadataById } = require('../controllers/nftController');
const router = express.Router();

//Test Data
router.get('/hello', testData);

router.get('/getnftmetadata/:id', getMetadataById);

//GET /api/nft/all
router.get('/all', getAllMetadata);

// POST /api/nft/create
router.post('/create', verifyApiKey, createNftMetadata);

//UPDATE /api/nft/update/:id
router.patch('/update/:id', verifyApiKey, updateNftMetadata);

//Lock /api/nft/locknft/:id
router.patch('/locknft/:id', verifyApiKey, updateMetadataUri);

router.patch('/vote', verifyApiKey, voteForNFT);

// DELETE /api/nft/delete/:id
router.delete('/delete/:id', deleteNftMetadata);

router.post('/createnft', createAndSendNFT);

router.post('/getCoreNfts', getCoreNFTs);

module.exports = router;
