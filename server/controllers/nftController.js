const NftMetadata = require('../Models/NftMetadata');

exports.getAllMetadata = async (req, res) => {
  try {
    const metadataList = await NftMetadata.find(); // Retrieve all documents from the collection
    res.status(200).json(metadataList); // Send the data as JSON
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
};

exports.createNftMetadata = async (req, res) => {
  try {
    console.log("Insert new NFT")
    const metadata = new NftMetadata(req.body);
    const savedMetadata = await metadata.save();
    res.status(201).json(savedMetadata);
  } catch (error) {
    console.error('Error creating NFT metadata:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateNftMetadata = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from request parameters
    const updates = req.body; // Extract updates from request body

    // Fetch the current metadata
    const existingNft = await NftMetadata.findById(id);
    if (!existingNft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    // Check for changes
    const updatedFields = {};
    Object.keys(updates).forEach((key) => {
      if (JSON.stringify(existingNft[key]) !== JSON.stringify(updates[key])) {
        updatedFields[key] = updates[key];
      }
    });

    const updatedNft = await NftMetadata.findByIdAndUpdate(
      id,
      { $set: updates }, // Apply updates using $set
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    if (!updatedNft) {
      return res.status(404).json({ message: 'NFT not found' }); // Handle case when the document doesn't exist
    }

    res.status(200).json(updatedNft); // Respond with the updated document
  } catch (error) {
    console.error('Error updating NFT:', error);
    res.status(400).json({ error: error.message }); // Respond with a 400 status and the error message
  }
};

exports.updateMetadataUri = async (req, res) => {
  try {
    const { id } = req.params; // Extract the NFT ID from request parameters
    const { metadataUri } = req.body; // Extract metadataUri from request body

    console.log(id);
    console.log("hello");
    console.log(metadataUri);

    // Ensure metadataUri is provided
    if (!metadataUri) {
      return res.status(400).json({ message: 'metadataUri is required' });
    }

    // Update the storeInfo.metadataUri field
    const updatedNft = await NftMetadata.findByIdAndUpdate(
      id,
      { $set: { 'storeInfo.metadataUri': metadataUri } }, // Update only metadataUri
      { new: true, runValidators: true, context: 'query' } // Return updated document and run validation
    );

    // Handle case where NFT does not exist
    if (!updatedNft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    res.status(200).json(updatedNft); // Respond with the updated document
  } catch (error) {
    console.error('Error updating metadataUri:', error);
    res.status(400).json({ error: error.message }); // Respond with a 400 status and the error message
  }
};

exports.deleteNftMetadata = async (req, res) => {
  try {
    const deletedMetadata = await NftMetadata.findByIdAndDelete(req.params.id);
    if (!deletedMetadata) {
      return res.status(404).json({ error: 'Metadata not found' });
    }
    res.status(200).json({ message: 'Metadata deleted successfully' });
  } catch (error) {
    console.error('Error deleting NFT metadata:', error);
    res.status(500).json({ error: error.message });
  }
};
