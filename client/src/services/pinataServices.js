import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
});

export const uploadMetadata = async (metadata) => {
    try {
        const { _id, _v, ...offChainMetadata } = metadata; // Extract database _id & _v from off-chain data
        const upload = await pinata.upload.json(offChainMetadata);

        if (!upload.IpfsHash) {
            throw new Error("Metadata upload failed: Missing IPFS hash from Pinata");
        }

        const metadataUriBase = import.meta.env.VITE_METADATA_URI || null;

        if (!metadataUriBase) {
            throw new Error("VITE_METADATA_URI is not defined");
        }

        const metadataUri = `${metadataUriBase}${upload.IpfsHash}`;
        return metadataUri;
    } catch (e) {
        console.error(`Failed Transaction: ${e.message}`);
        throw e; // Propagate the error
    }
};
