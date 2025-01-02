import axios from 'axios';

export const uploadMetadata = async (info, imageURI) => {
    const data = {
        name: info.name,
        sybmol: info.symbol,
        description: info.description,
        image: imageURI,
    }

    console.log(data);

    const url = 'https://api.tusky.io/uploads';
    const apiKey = import.meta.env.VITE_TUSK_API_KEY; // Replace with your actual API key

    try {
        const response = await axios.post(url, data, {
            headers: {
                // 'Tus-resumable': '1.0.0',
                'Content-Type': 'application/json',
                'Api-Key': apiKey,
            },
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }

    // const options = {
    //     method: 'POST',
    //     url: 'https://docs.tusky.io/uploads',
    //     headers: { 'Content-Type': 'application/octet-stream', 'Api-Key': import.meta.env.VITE_TUSK_API_KEY },
    //     data: data
    // };

    // try {
    //     const { data } = await axios.request(options);
    //     console.log(data);
    // } catch (error) {
    //     console.error(error);
    // }

    // const url = 'https://docs.tusky.io/uploads';
    // const options = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', 'Api-Key': import.meta.env.VITE_TUSK_API_KEY },
    //     body: data
    // };

    // try {
    //     const response = await fetch(url, options);
    //     const data = await response.json();
    //     console.log(data);
    // } catch (error) {
    //     console.error(error);
    // }
    

    // try {
    //     const response = await fetch('http://localhost:5000/api/upload', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/octet-stream',
    //       },
    //       body: JSON.stringify(data),
    //     });
    //     const result = await response.json();
    //     console.log(result);
    //   } catch (error) {
    //     console.error('Error:', error);
    //   }

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