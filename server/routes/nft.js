const express = require('express');
const { getAllMetadata, createNftMetadata, deleteNftMetadata, updateNftMetadata } = require('../controllers/nftController');
const router = express.Router();

//GET /api/nft/all
router.get('/all', getAllMetadata);

// POST /api/nft/create
router.post('/create', createNftMetadata);

//UPDATE /api/nft/update/:id
router.patch('/update/:id', updateNftMetadata)

// DELETE /api/nft/delete/:id
router.delete('/delete/:id', deleteNftMetadata);

module.exports = router;
