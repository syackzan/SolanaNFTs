const {PinataSDK} = require("pinata-web3");
require('dotenv').config();

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.PINATA_GATEWAY,
});

const uploadMetadata = async (metadata) => {
    try {
        const { _id, _v, ...offChainMetadata } = metadata; // Extract database _id & _v from off-chain data
        const upload = await pinata.upload.json(offChainMetadata);

        if (!upload.IpfsHash) {
            throw new Error("Metadata upload failed: Missing IPFS hash from Pinata");
        }

        const metadataUriBase = process.env.PINATA_METADATA_URI || null;

        if (!metadataUriBase) {
            throw new Error("PINATA_URI is not defined");
        }

        const metadataUri = `${metadataUriBase}${upload.IpfsHash}`;
        return metadataUri;
    } catch (e) {
        console.error(`Failed Transaction: ${e.message}`);
        throw e; // Propagate the error
    }
};

module.exports = {uploadMetadata};