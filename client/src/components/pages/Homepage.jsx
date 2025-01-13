import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import SideNav from '../SideNav/SideNav';
import NFTPreview from '../NFTPreview/NFTPreview';
import NFTUpdate from '../NFTUpdate/NFTUpdate';
import { uploadIcon, uploadMetadata } from '../Utils';

import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react'
import SolConnection from '../Connection/SolConnection';
import Navbar from '../Navbar/Navbar';
import { checkIfAdmin } from '../checkRole';

const API_KEY = import.meta.env.VITE_SERVE_KEY

const Homepage = () => {

    //Wallet connection
    const wallet = useWallet();
    const [userRole, setUserRole] = useState(null);

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
        { trait_type: "type", value: "" },
        { trait_type: "subType", value: "" },
        { trait_type: "rarity", value: "common" },
        { trait_type: "affinity", value: "" },
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
            { trait_type: "type", value: "" },
            { trait_type: "subType", value: "" },
            { trait_type: "rarity", value: "common" },
            { trait_type: "affinity", value: "" },
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

    //Handles Wallet connection & Admin Login
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (wallet.connected) {
                console.log("Wallet connected:", wallet.publicKey?.toBase58());
    
                // Call the checkIfAdmin function and await the response
                const isAdmin = await checkIfAdmin(wallet.publicKey?.toBase58());
                console.log("Is Admin:", isAdmin);
    
                // Perform role-specific actions
                if (isAdmin) {
                    setUserRole("admin");
                } else {
                    setUserRole("member");
                }
    
                // Update the creator field if the page is 'create'
                if (page === 'create') {
                    handleStoreChange('creator', wallet.publicKey?.toBase58());
                }
            } else {
                console.log("Wallet disconnected");
    
                // Reset user data when the wallet disconnects
                handleStoreChange('creator', '');
                setUserRole(null);
            }
        };
    
        checkAdminStatus(); // Call the async function
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
        <div style={{overflow: 'hidden'}}>
            <Navbar setPage={setPage} resetMetadata={resetMetadata} setIsDisabled={setIsDisabled} />
            <div style={{width: '100%', height: '60px'}}>a</div>
            <div className="d-flex">
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
                    setIsDisabled={setIsDisabled}
                    userRole={userRole}
                    walletAddress={wallet.publicKey?.toBase58()} />
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