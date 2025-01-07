import axios from 'axios';

import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
  });

export const uploadMetadata = async (metadata) => {

    try{

        const upload = await pinata.upload.json(metadata);

        console.log(upload);
        const metadataUri = `${import.meta.env.VITE_METADATA_URI}${upload.IpfsHash}`

        return metadataUri;

    }catch(e){
        console.log(`Failed Transaction: ${e}`);
    }
    
}

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