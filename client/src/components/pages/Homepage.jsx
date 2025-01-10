import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import SideNav from '../SideNav/SideNav';
import NFTPreview from '../NFTPreview/NFTPreview';
import NFTUpdate from '../NFTUpdate/NFTUpdate';
import { uploadIcon, uploadMetadata } from '../Utils';

import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react'
import SolConnection from '../Connection/SolConnection';

const API_KEY = import.meta.env.VITE_SERVE_KEY

const Homepage = () => {

    //Wallet connection
    const wallet = useWallet();

    const [searchParams] = useSearchParams();
    const action = searchParams.get('action'); // "create" or "view"

    //Handles Page switching for UI
    const [page, setPage] = useState(action);

    //Store Image for display
    const [image, setImage] = useState(null);

    //Refetches NFTs when flipped
    const [refetchNFTs, setRefetchNFTs] = useState(false);

    //Stores newly created metadata for?
    const [newMetadata, setNewMetadata] = useState(null);

    //Handles disabling buttons
    const [isDisabled, setIsDisabled] = useState(false);

    //States that make up Meta data information
    const [info, setInfo] = useState({ name: '', symbol: 'BOOH', description: '', image: '', external_link: 'https://boohworld.io/boohbrawlers/marketplace' });
    const [attributes, setAttributes] = useState([
        { trait_type: "blockchain", value: "solana" },
        { trait_type: "type", value: "equipment" },
        { trait_type: "subType", value: "none" },
        { trait_type: "rarity", value: "common" },
        { trait_type: "damage", value: "0" },
        { trait_type: "defense", value: "0" },
        { trait_type: "dodge", value: "0" },
        { trait_type: "coinMultiplier", value: "0" },
    ]);
    const [properties, setProperties] = useState({
        files: [
            {
                uri: null,
                type: "image/png"
            }
        ],
        category: "image"
    })
    //State that makes up Store Information
    const [storeInfo, setStoreInfo] = useState({
        available: '',
        price: '',
        season: '',
        metadataUri: '',
        creator: '',
    })

    //Function that resets local metadata when needed
    const resetMetadata = () => {
        setInfo({ name: '', symbol: 'BOOH', description: '', image: '', external_link: 'https://boohworld.io/boohbrawlers/marketplace' });
        setAttributes([
            { trait_type: "blockchain", value: "solana" },
            { trait_type: "type", value: "none" },
            { trait_type: "subType", value: "none" },
            { trait_type: "rarity", value: "common" },
            { trait_type: "damage", value: "0" },
            { trait_type: "defense", value: "0" },
            { trait_type: "dodge", value: "0" },
            { trait_type: "coinMultiplier", value: "0" },
        ]);
        setProperties({
            files: [
                {
                    uri: null,
                    type: "image/png"
                }
            ],
            category: "image"
        });
        setStoreInfo({
            available: '',
            price: '',
            season: '',
            metadataUri: '',
            creator: ''
        })

        setImage(null);
        setNewMetadata(null);
    }

    //Checks to see when a wallet is connected
    useEffect(() => {
        if (wallet.connected) {
            console.log("Wallet connected:", wallet.publicKey?.toBase58());

            if(page === 'create'){
                handleStoreChange('creator', wallet.publicKey?.toBase58());
            }
            
            // Perform actions when the user logs in
            // updateUserWallet(wallet.publicKey.toBase58());
        } else {
            console.log("Wallet disconnected");

            handleStoreChange('creator', '');
            // Perform actions when the user logs out
            // clearUserWallet();
        }
    }, [wallet.connected, wallet.publicKey]);

    useEffect(() => {
        if(page === 'create'){
            handleStoreChange('creator', wallet.publicKey?.toBase58());
        }
    }, [page])

    //Handles form input change for Info state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfo({ ...info, [name]: value });
    };

    //Handles form input change for Store Info
    const handleStoreChange = (key, value) => {
        setStoreInfo((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    //Handles image update for displaying image purposes
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Handle input change
    const handleAttributeChange = (index, field, newValue) => {
        const updatedAttributes = attributes.map((attr, i) =>
            i === index ? { ...attr, [field]: newValue } : attr
        );
        setAttributes(updatedAttributes);
    };

    //This combines Store & Metadata for any NEW adds to the Database
    const combineNewMetadataJSON = async () => {
        // Upload the image
        const iconResp = await uploadIcon(image);
        const imageURL = iconResp.url;

        console.log("Upload complete: ", imageURL);

        //Set info.image to proper URL
        setInfo({ ...info, image: imageURL });

        //Use Immediate value
        const hardInfo = {
            ...info,
            image: imageURL
        }

        //Set properties image to proper URL
        setProperties({
            files: [
                {
                    uri: imageURL,
                    type: "image/png"
                }
            ],
            category: "image"
        });


        console.log(info);

        //Use immediate value
        const hardProperties = {
            files: [
                {
                    uri: imageURL,
                    type: "image/png"
                }
            ],
            category: "image"
        }

        const metadataCombined = {
            ...hardInfo,
            attributes,
            properties: hardProperties,
            storeInfo,
        }

        return metadataCombined;
    }

    //This combines metadata & store data for db update
    const combineUpdateMetadataJSON = async () => {

        const metadataCombined = {
            ...info,
            attributes,
            properties,
            storeInfo,
        }

        return metadataCombined;
    }

    //This combines metadata for URI upload
    const combineOffchainMetatdata = async () => {
        const metadataCombined = {
            ...info,
            attributes,
            properties,
        }

        return metadataCombined;
    }

    //Add new entry or update entry to Database
    const addOrUpdateToDB = async () => {

        try {

            if (page === 'create') {
                const metadataForDB = await combineNewMetadataJSON();
                const response = await axios.post(
                    'http://localhost:5000/api/nft/create',
                    metadataForDB,
                    { headers: { 'x-api-key': API_KEY } });

                setNewMetadata(response.data);
                console.log('NFT Metadata created successfully', response.data);

                return true;
            }

            if (page === 'update') {
                //Combine Metadata
                const updateDataForDB = await combineUpdateMetadataJSON();

                //Remove ID from metadata
                const response = await axios.patch(`http://localhost:5000/api/nft/update/${updateDataForDB._id}`, updateDataForDB, { headers: { 'x-api-key': API_KEY } });
                console.log('Update Successfull,', response.data);

                setRefetchNFTs(!refetchNFTs);

                return true;
            }

        } catch (error) {
            console.error('Error creating NFT metadata:', error.response?.data || error.message);
        }
    }

    const createOffchainMetadata = async () => {

        const metadataForJSONUpload = await combineOffchainMetatdata();

        // // create new const with json data
        const metadataUri = await uploadMetadata(metadataForJSONUpload);

        let objectId;
        if (page === 'create') {
            objectId = newMetadata._id //newly created metadata
        } else {
            objectId = info._id //metadata existing in DB already
        }

        const response = await axios.patch(
            `http://localhost:5000/api/nft/locknft/${objectId}`,
            { metadataUri: metadataUri }, // Send data as an object in the request body
            { headers: { 'x-api-key': API_KEY } } // Include API key in headers
        );

        console.log('Update Successfull,', response.data);

        setRefetchNFTs(!refetchNFTs);

        if (response.status >= 200 && response.status < 300) {
            alert("Metadata Locked Successfully");
            resetMetadata();
        } else {
            alert("Metadata failed to lock");
        }
    }

    //Get all metadata objects from DB
    const getMetadata = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/nft/all');
            console.log('NFT DATA', response.data);
        } catch (e) {
            console.error('Error when accessing data', error.response?.data || error.message)
        }
    }

    // const updateMetadata = async () => {

    //     try {
    //         const response = await axios.patch(`http://localhost:5000/api/nft/update/${test_id}`,
    //             updateData,
    //             { headers: { 'x-api-key': API_KEY } });
    //         console.log('Update Successfull,', response.data);
    //     } catch (error) {
    //         console.error('Error updating data', error.response?.data || error.message);
    //     }
    // }

    const deleteMetadata = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/nft/delete/${info._id}`);
            console.log('Update Successfull,', response.data);
        } catch (error) {
            console.error('Error updating data', error.response?.data || error.message);
        }

        setRefetchNFTs(!refetchNFTs);
        resetMetadata();
    }

    return (
        <div>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "60px",
                    backgroundColor: "#1E1E1E",
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    zIndex: 1000,
                }}
            >
                <div className="d-flex justify-content-center gap-3">
                    {/* <button onClick={addOrUpdateToDB}>ADD</button> */}
                    <button onClick={getMetadata}>Get</button>
                    <SolConnection />
                    {/* <button onClick={updateMetadata}>Update</button> */}
                    {/* <button onClick={deleteMetadata}>Delete</button>
                    <button onClick={createOffchainMetadata}>Lock</button> */}
                </div>
                <div className="d-flex justify-content-center gap-3">
                    <button className="darkmode-button" onClick={() => { setPage('create'), resetMetadata(), setIsDisabled(false) }}>Create</button>
                    <button className="darkmode-button" onClick={() => { setPage('update'), resetMetadata(), setIsDisabled(false) }}>Update</button>
                </div>
            </div>
            <div className="d-flex" style={{marginTop: '60px'}}>
                <SideNav info={info}
                    attributes={attributes}
                    storeInfo={storeInfo}
                    handleInputChange={handleInputChange}
                    handleStoreChange={handleStoreChange}
                    handleAttributeChange={handleAttributeChange}
                    handleImageChange={handleImageChange}
                    addOrUpdateToDB={addOrUpdateToDB}
                    page={page}
                    createOffchainMetadata={createOffchainMetadata}
                    deleteMetadata={deleteMetadata}
                    isDisabled={isDisabled}
                    setIsDisabled={setIsDisabled} />
                {page === "create" &&
                    <NFTPreview
                        info={info}
                        attributes={attributes}
                        storeInfo={storeInfo}
                        image={image} />}
                {page === "update" &&
                    <NFTUpdate
                        setInfo={setInfo}
                        setAttributes={setAttributes}
                        setProperties={setProperties}
                        setStoreInfo={setStoreInfo}
                        refetchNFTs={refetchNFTs}
                        deleteMetadata={deleteMetadata} />}
            </div>
        </div>

    );
};

{/* {metadataURI && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <h2>Metadata URI</h2>
                    <p style={{ wordBreak: 'break-word' }}>{metadataURI}</p>
                </div>
            )} */}



export default Homepage;