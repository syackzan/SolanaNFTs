const NftMetadata = require('../Models/NftMetadata');

// Helper function to validate NFT data
async function validateNFT(nft) {
  try {
    if (!nft._id) {
      throw new Error('NFT object is missing _id.');
    }

    // Fetch the NFT data from the database using the model
    const storedNFT = await NftMetadata.findById(nft._id);

    if (!storedNFT) {
      throw new Error(`NFT with ID ${nft._id} not found in the database.`);
    }

    // Compare the fields of the NFT object with the database entry
    if (
      storedNFT.name !== nft.name ||
      storedNFT.storeInfo?.metadataUri !== nft.storeInfo?.metadataUri
    ) {
      throw new Error('NFT data does not match the database record.');
    }

    // Validation passed
    return { success: true, message: 'NFT data is valid.' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { validateNFT };