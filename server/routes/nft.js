const express = require('express');
const {verifyApiKey} = require('../Middleware/authMiddleware')
const { 
    getAllNftConcepts, 
    addNftConcept, 
    deleteNftConcept, 
    updateNftConcept, 
    saveMetadataUri, 
    voteForNftConcept, 
    testData, 
    createAndSendNFT,
    getCoreNFTs,
    getNftConceptById,
    trackNftTransaction,
    getCoreNFTsDevNet } = require('../controllers/nftController');
const router = express.Router();

//Test Data
router.get('/hello', testData);

//GET /api/nft/concepts (get all nft concepts)
router.get('/concepts', getAllNftConcepts);

//GET /api/nft/concepts (get ONE nft concept)
router.get('/concepts/:id', getNftConceptById);

//POST /api/nft/concepts (add new entry)
router.post('/concepts', verifyApiKey, addNftConcept);

//UPDATE /api/nft/concepts/:id
router.patch('/concepts/:id', verifyApiKey, updateNftConcept);

//Lock /api/nft/locknft/:id
router.patch('/concepts/:id/metadata', verifyApiKey, saveMetadataUri);

// DELETE /api/nft/delete/:id
router.delete('/concepts/:id', deleteNftConcept);

router.patch('/concepts/:id/vote', verifyApiKey, voteForNftConcept);

// 🔹 Record NFT Create/Buy Transactions
router.patch('/concepts/:id/transaction', trackNftTransaction);

router.post('/createnft', createAndSendNFT);

router.post('/getCoreNfts', getCoreNFTs);

router.post('/getCoreNfts/Devnet', getCoreNFTsDevNet);

module.exports = router;
