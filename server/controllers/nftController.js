const NftMetadata = require('../Models/NftMetadata');

const {
  generateSigner,
  publicKey,
  transactionBuilder,
} = require('@metaplex-foundation/umi');

const {
  create,
  fetchCollection,
  fetchAssetsByOwner,
  transferV1,
  addPlugin
} = require('@metaplex-foundation/mpl-core');

const { PublicKey } = require('@solana/web3.js'); 

const { initializeUmi, softInitUmi } = require('../config/umiInstance');
const { validateNFT } = require('../utils/validateNFT');
const { getPriorityFee } = require('../utils/transactionHelpers');

const { base58 } =  require("@metaplex-foundation/umi/serializers");

const umi = initializeUmi();

const CORE_COLLECTION_ADDRESS = process.env.IS_MAINNET === "true" ? "CnRTKtN1piFJcrchQPgPN1AH7hagLbAMtkXuhabcruNz" : 'AQWGjfgwj8fuQsQFrfN58JzVxWG6dAosU33e35amUcPo';

exports.testData = async (req, res) => {
  try {
    const metadataList = "hello from server"
    res.status(200).json(metadataList); // Send the data as JSON
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
}

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
    console.log("Insert new NFT");

    // Ensure `votes` field is properly initialized
    const requestData = {
      ...req.body,
      votes: {
        count: 0, // Default count
        voters: [], // Default empty array for voters
      },
    };

    const metadata = new NftMetadata(requestData);
    const savedMetadata = await metadata.save();

    res.status(201).json(savedMetadata);
  } catch (error) {
    console.error("Error creating NFT metadata:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateNftMetadata = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from request parameters
    const updates = req.body; // Extract updates from request body

    console.log(updates);

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

exports.voteForNFT = async (req, res) => {
  try {
    const { nftId, voterAddress } = req.body;

    // Fetch the NFT by ID
    const nft = await NftMetadata.findById(nftId);
    if (!nft) return res.status(404).json({ error: "NFT not found" });

    // Prevent the creator from voting on their own NFT
    if (nft.creator === voterAddress) {
      return res.status(403).json({ error: "You cannot vote on your own NFT" });
    }

    // Check if the user has already voted
    if (nft.votes.voters.includes(voterAddress)) {
      return res.status(403).json({ error: "You have already voted for this NFT" });
    }

    // Update the NFT votes
    nft.votes.count += 1;
    nft.votes.voters.push(voterAddress);
    await nft.save();

    res.json({ success: true, votes: nft.votes.count });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


exports.createAndSendNFT = async (req, res) => {

  const { nft, receiverPubKey } = req.body;
  console.log(receiverPubKey);

  const isValidated = await validateNFT(nft);

  console.log(isValidated);

  if (isValidated.success) {
    try {

      // Fetch the collection
      const collection = await fetchCollection(umi, CORE_COLLECTION_ADDRESS);
      console.log("Collection fetched successfully:", collection);

      // Generate a new signer for the asset
      const assetSigner = generateSigner(umi);

      let perComputeUnit;
      try {
        perComputeUnit = await getPriorityFee();
      } catch (error) {
        console.error("Failed to fetch priority fee, using default value:", error.message);
        perComputeUnit = 3500000; // Fallback value
      }

      console.log(perComputeUnit);

      console.log(nft.storeInfo.metadataUri);

      // Build the transaction
      let builder = transactionBuilder()
        // .add(setComputeUnitLimit(umi, { units: 600_000 }))
        // .add(setComputeUnitPrice(umi, { microLamports: perComputeUnit }))
        .add(create(umi, {
          asset: assetSigner,
          collection: collection,
          name: nft.name,
          uri: nft.storeInfo.metadataUri,
        })).add(addPlugin(umi, {
          asset: assetSigner.publicKey,
          collection: collection,
          plugin: {
            type: 'ImmutableMetadata',
          },
        }))
        .add(transferV1(umi, {
          asset: publicKey(assetSigner.publicKey),
          newOwner: publicKey(receiverPubKey),
          collection: CORE_COLLECTION_ADDRESS
        }))

      // Send and confirm the transaction
      const { signature } = await builder.sendAndConfirm(umi);

      const serializedSignature = base58.deserialize(signature)[0];

      console.log("NFT created and sent successfully:", serializedSignature);

      // Return success response
      return res.status(200).json({ success: true, serializedSignature });
    } catch (e) {
      console.error("Error creating and sending NFT:", e);
      return res.status(500).json({ success: false, error: e.message });
    }
  } else {
    console.error("Error creating and sending NFT:", e);
    return res.status(500).json({ success: false, error: e.message });
  }
}

exports.getCoreNFTs = async (req, res) => {

  console.log(req.body.walletPublicKey);

  try {
    // Extract wallet public key from the request
    const ownerType = new PublicKey(req.body.walletPublicKey); // Ensure `walletPublicKey` is sent in the request body

    // Fetch assets owned by the specified wallet
    const fetchedAssets = await fetchAssetsByOwner(umi, ownerType, {
      skipDerivePlugins: false,
    });

    // console.log('Fetched assets:', assetsByOwner);

    // Remove unnecessary fields (rentEpoch, lamports, pluginHeader, immutableMetadata)
    const sanitizedAssets = fetchedAssets.map(({ header, pluginHeader, immutableMetadata, ...asset }) => {
      const { rentEpoch, lamports, ...sanitizedHeader } = header; // Remove rentEpoch and lamports
      return {
        ...asset,
        header: sanitizedHeader, // Include sanitized header without rentEpoch and lamports
      };
    });

    console.log(sanitizedAssets);

    // Return the assets as a response
    res.status(200).json({
      success: true,
      message: 'Assets fetched successfully',
      address: ownerType.toString(), // Return the address as a string
      data: sanitizedAssets,
    });
  } catch (error) {
    console.error('Error fetching assets:', error);

    // Return an error response
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assets',
      error: error.message || 'An unexpected error occurred',
    });
  }
};



//DEAD CODE - REPLACED BY createAndSendNFT
// exports.signAndConfirmTransaction = async (req, res) => {

//   try {

//     console.log("Inside the send transaction");
//     const { transaction: base64Transaction, assetSigner } = req.body;

//     if (!base64Transaction || !assetSigner) {
//       return res.status(400).json({ error: 'Transaction data is required.' });
//     }

//     console.log('Received Transaction');
//     // console.log(assetSigner);

//     // Convert the assetSigner back to a Keypair
//     const reconstructedSigner = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(assetSigner.secretKey));
//     const signer2 = createSignerFromKeypair(umi, reconstructedSigner);
//     // console.log('Reconstructed Signer:', reconstructedSigner);

//     const mySigners = [signer, signer2];

//     // Convert Base64 string back to Uint8Array
//     const transactionArray = Uint8Array.from(Buffer.from(base64Transaction, 'base64'));

//     // console.log(transactionArray);

//     // Deserialize the transaction using Umi
//     let myTransaction = umi.transactions.deserialize(transactionArray);

//     // console.log(myTransaction);

//     console.log(myTransaction.message.accounts[0]);

//     myTransaction.message.accounts[0] = signer.publicKey;

//     console.log(myTransaction.message.accounts[0]);

//     const signedTransaction = await signTransaction(myTransaction, mySigners);
//     console.log(signedTransaction);

//     // const signedTransactions = await signAllTransactions([
//     //   {transaction: myFirstTransaction, signers: [mySigners]},
//     //   {transaction: mySecondTransaction, signers: [mySigners.signer]}
//     // ])

//     const signature = await umi.rpc.sendTransaction(signedTransaction);
//     console.log(signature);

//     // Confirm the transaction
//     // const confirmation = await umi.rpc.confirmTransaction(signature, 'confirmed');

//     res.json({
//       success: true,
//       signature,
//       // confirmation,
//     });
//   } catch (error) {
//     console.error('Error signing and confirming transaction:', error);
//     res.status(500).json({
//       error: 'Failed to sign and confirm transaction',
//       details: error.message,
//     });
//   }
// };
