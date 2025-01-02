import React, { useState } from 'react';

import { uploadIcon, uploadMetadata } from '../Utils';

const TestInfo = {
    name: 'Arrow',
    symbol: 'ARR',
    description: 'Arrow to attack',
    image: 'http://res.cloudinary.com/dagu222du/image/upload/v1735557380/azixlkhngmnkfoijbfis.png'
}

const TestImageURL = 'http://res.cloudinary.com/dagu222du/image/upload/v1735557380/azixlkhngmnkfoijbfis.png';

const Homepage = () => {
    const [info, setInfo] = useState({ name: '', symbol: '', description: '' });
    const [image, setImage] = useState(null);
    const [metadataURI, setMetadataURI] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfo({ ...info, [name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const fetchData = async () => {
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

    const createOffChainData = async () => {
        try {
            // if (!image) {
            //     alert('Please upload an image.');
            //     return;
            // }

            // // Upload the image
            // const iconResp = await uploadIcon(image);
            // const imageURL = iconResp.url;
            // console.log('Image URL:', imageURL);

            // Upload metadata
            const metadataResp = await uploadMetadata(TestInfo, TestImageURL);
            const metadataURI = metadataResp.cloud.url;
            console.log('Metadata URI:', metadataURI);

            setMetadataURI(metadataURI);
        } catch (error) {
            console.error('Error creating NFT data:', error);
            alert('There was an error creating the NFT. Please try again.');
        }
    };

    return (
        <div style={{ backgroundColor: '#121212', color: '#FFFFFF', padding: '20px', fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center' }}>Create a Solana NFT</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createOffChainData();
                }}
                style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#1E1E1E', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)' }}
            >
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>NFT Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={info.name}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2E2E2E', color: '#FFF' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="symbol" style={{ display: 'block', marginBottom: '5px' }}>Symbol:</label>
                    <input
                        type="text"
                        id="symbol"
                        name="symbol"
                        value={info.symbol}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2E2E2E', color: '#FFF' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={info.description}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2E2E2E', color: '#FFF', minHeight: '100px' }}
                    ></textarea>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>Upload Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2E2E2E', color: '#FFF' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', backgroundColor: '#3A3A3A', color: '#FFF', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#505050')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#3A3A3A')}
                >
                    Generate NFT Metadata
                </button>
            </form>
            <button onClick={fetchData}>Get User</button>

            {metadataURI && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <h2>Metadata URI</h2>
                    <p style={{ wordBreak: 'break-word' }}>{metadataURI}</p>
                </div>
            )}
        </div>
    );
};

export default Homepage;