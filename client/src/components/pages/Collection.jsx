import React, { useState } from 'react';

import Navbar from '../Navbar/Navbar';

import { useWallet } from '@solana/wallet-adapter-react'

import { createCoreCollection } from '../../services/blockchainServices';


const Collection = () => {

    const wallet = useWallet();

    const [collectionAddress, setCollectionAddress] = useState('address...');
    const [nftAddress, setNftAddress] = useState('');
    const [nftAddedMessage, setNftAddedMessage] = useState('');

    // Placeholder function for creating a collection
    const handleCreateCollection = async () => {
        try {
            
            const newCollectionAddress = await createCoreCollection();
            console.log(newCollectionAddress);

            setCollectionAddress(newCollectionAddress);
        } catch (error) {
            console.error("Error creating collection:", error);
        }
    };

    // Placeholder function for adding an NFT to a collection
    const handleAddNftToCollection = async () => {
        try {
            if (!collectionAddress) {
                alert("Please create a collection first!");
                return;
            }

            const response = updateNFT(wallet, nftAddress);

            if(response)
            {   
                setNftAddedMessage(`NFT ${nftAddress} added to collection ${collectionAddress}.`);
            } else {
                setNftAddedMessage('Failed to add collection');
            }

            // Replace with blockchain function to add NFT to the collection
            setNftAddedMessage(`NFT Added`);
            // setNftAddress(''); // Clear input
        } catch (error) {
            console.error("Error adding NFT to collection:", error);
        }
    };

    const handleTransfer = async () => {

        await transferAsset(wallet, nftAddress);
    }

    return (
        <div className="landing-page" style={{color: 'white'}}>
            <Navbar />
            <h1>Collection Management</h1>

            {/* Create Collection Section */}
            <div className="card create-collection" style={{color: 'white'}}>
                <h2>Create a Collection</h2>
                <button onClick={handleCreateCollection}>Create Collection</button>
                {collectionAddress && (
                    <p style={{color: 'white', fontSize: '1rem'}}>
                        <strong>Collection Address:</strong> {collectionAddress}
                    </p>
                )}
            </div>

            {/* Add NFT to Collection Section */}
            <div className="card add-nft">
                <h2 style={{color: 'white'}}>Add NFT to Collection</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddNftToCollection();
                    }}
                >
                    <label htmlFor="nftAddress" style={{color: 'white'}}>NFT Address:</label>
                    <input
                        id="nftAddress"
                        type="text"
                        value={nftAddress}
                        onChange={(e) => setNftAddress(e.target.value)}
                        placeholder="Enter NFT address"
                        required
                    />
                    <button type="submit">Add to Collection</button>
                </form>
                {nftAddedMessage && <p style={{color: 'white'}}>{nftAddedMessage}</p>}
            </div>
            <button onClick={() => logNftData(nftAddress)}>Log NFT data</button>
            <button onClick={handleTransfer}>Transfer</button>
        </div>
    );
};

export default Collection;