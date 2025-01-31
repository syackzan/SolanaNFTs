import axios from 'axios';

import { PinataSDK } from "pinata-web3";

import { fetchUsdToSolPrice, getSolPriceInUSD } from './getSolanaPrice';

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

export const uploadIcon = async (image) => {

    if (!image) return; // Return early if no file is selected

    const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/upload`;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

    console.log(CLOUDINARY_UPLOAD_URL);
    console.log(UPLOAD_PRESET);

    const formData = new FormData();
    formData.append('file', image); // Append the file to the form data
    formData.append('upload_preset', UPLOAD_PRESET); // Append your upload preset

    try {
        // Use axios or fetch to upload the image to Cloudinary
        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Upload successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

export const fetchData = async () => {
    const url = 'https://booh-brawler-msmetanin-booh-world.vercel.app/user?wallet=wejdf23p9ijre3e2h9jf290uhf2dwfadssdfdsf2erf';
    // const token = import.meta.env.VITE_TOKEN_BEARER;
    const token = 'bUU4cVd5cnJzSUY2UVZ4RTdOaUQ3TkVsb0w4OGppVEVvd1hpWElSUjFOeGJjT0xuemowQjN3SUl5MVVTemU3Rg=='

    try {
        const response = await fetch(url, {
            method: 'GET', // or 'POST', 'PUT', etc.
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Adjust based on your API
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

export const voteForNFT = async (nftId, walletAddress) => {
    try {
        const response = await fetch('/api/nft/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nftId, voterAddress: walletAddress }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Thank you for voting! Total votes: ${data.votes}`);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error while voting:", error);
    }
};

export const priceToSol = async (payment, mintCosts = 0) => {
    try {

        console.log('Entering Pricing Method 1');
        const paymentInSol = await fetchUsdToSolPrice(payment);

        console.log("Captured pricing method 1");
        return Number(paymentInSol + mintCosts);

    } catch (e) {
        try{
            console.log("Failed to capture pricing Data from Jupiter");
            const SOL_TO_USD = await getSolPriceInUSD();

            const paymentInSol = Number((payment / SOL_TO_USD).toFixed(6));
            console.log("capture pricing data 2")

            return Number(paymentInSol + mintCosts);
        } catch(e){

            console.log("Failed to capture pricing data 2");
            const paymentInSol =Number(payment/200).toFixed(6)

            return Number(paymentInSol + mintCosts);
        }
    }
}

