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
import { fetchAssets } from '../BlockchainInteractions/blockchainInteractions';

import { URI_SERVER } from '../config';

const API_KEY = import.meta.env.VITE_SERVE_KEY

const Homepage = () => {

    //Wallet connection
    const wallet = useWallet();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {

        fetchAssets(wallet);

    }, [wallet.publicKey])

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
    const [isDisabled, setIsDisabled] = useState(false); //Button use for Creating Metadata
    const [lockStatus, setLockStatus] = useState(false);

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
            creator: wallet.publicKey.toString()
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
                // console.log("Is Admin:", isAdmin);

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

    // useEffect(() => {
    //     const fetchCoreNFTs = async (walletPublicKey) => {

    //         if(!walletPublicKey){
    //             return;
    //         }

    //         try {
    //           const response = await axios.post(
    //             `${URI_SERVER}/api/nft/getCoreNfts`, // Replace with your actual endpoint URL
    //             {
    //               walletPublicKey: walletPublicKey, // Wallet public key as request body
    //             },
    //             {
    //               headers: {
    //                 'Content-Type': 'application/json', // Ensure JSON format
    //                 'x-api-key': API_KEY,  // Optional: Add if your endpoint requires an API key
    //               },
    //             }
    //           );
          
    //           console.log('Response:', response.data);
    //           return response.data; // Handle the data returned from the server
    //         } catch (error) {
    //           console.error('Error fetching NFTs:', error.response?.data || error.message);
    //           throw error; // Re-throw the error to handle it upstream
    //         }
    //       };

    //     fetchCoreNFTs(wallet.publicKey);
    // }, [wallet.publicKey]);


    useEffect(() => {
        if (page === 'create') {
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


        // console.log(info);

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
                    `${URI_SERVER}/api/nft/create`,
                    metadataForDB,
                    { headers: { 'x-api-key': API_KEY } });

                setNewMetadata(response.data);
                console.log('NFT Metadata created successfully', response.data);

                return true;
            }

            if (page === 'update') {
                //Combine Metadata
                const updateDataForDB = await combineUpdateMetadataJSON();

                console.log(updateDataForDB);

                //Remove ID from metadata
                const response = await axios.patch(`${URI_SERVER}/api/nft/update/${updateDataForDB._id}`, updateDataForDB, { headers: { 'x-api-key': API_KEY } });
                console.log('Update Successfull,', response.data);

                setRefetchNFTs(!refetchNFTs);

                return true;
            }

        } catch (error) {
            console.error('Error creating NFT metadata:', error.response?.data || error.message);
        }
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const createOffchainMetadata = async () => {
        
        try {

            setLockStatus(true);
            // Combine offchain metadata
            const metadataForJSONUpload = await combineOffchainMetatdata();

            // Upload metadata and get the URI
            const metadataUri = await uploadMetadata(metadataForJSONUpload);

            // Determine the object ID based on the page
            let objectId;
            if (page === 'create') {
                objectId = newMetadata._id; // Newly created metadata
            } else {
                objectId = info._id; // Metadata existing in DB already
            }

            // Make the PATCH request to lock the NFT
            const response = await axios.patch(
                `${URI_SERVER}/api/nft/locknft/${objectId}`,
                { metadataUri: metadataUri }, // Send data as an object in the request body
                { headers: { 'x-api-key': API_KEY } } // Include API key in headers
            );

            // Handle response
            if (response.status >= 200 && response.status < 300) {
                console.log('Update Successful:', response.data);
                alert("Metadata Locked Successfully");
                resetMetadata(); // Reset metadata
                setRefetchNFTs(!refetchNFTs); // Trigger refetch
                setLockStatus(false);
            } else {
                console.error('Failed to update metadata:', response);
                alert("Metadata failed to lock");
            }
        } catch (error) {
            // Log and handle any errors
            console.error('Error in createOffchainMetadata:', error);
            alert("An error occurred while locking metadata. Please try again.");
            setLockStatus(false);
        }
    };

    //Get all metadata objects from DB
    const getMetadata = async () => {
        try {
            const response = await axios.get(`${URI_SERVER}/api/nft/all`);
            console.log('NFT DATA', response.data);
        } catch (e) {
            console.error('Error when accessing data', error.response?.data || error.message)
        }
    }

    // const updateMetadata = async () => {

    //     try {
    //         const response = await axios.patch(`${URI_SERVER}/api/nft/update/${test_id}`,
    //             updateData,
    //             { headers: { 'x-api-key': API_KEY } });
    //         console.log('Update Successfull,', response.data);
    //     } catch (error) {
    //         console.error('Error updating data', error.response?.data || error.message);
    //     }
    // }

    const deleteMetadata = async (id) => {
        try {
            const response = await axios.delete(`${URI_SERVER}/api/nft/delete/${info._id}`);
            console.log('Update Successfull,', response.data);
        } catch (error) {
            console.error('Error updating data', error.response?.data || error.message);
        }

        setRefetchNFTs(!refetchNFTs);
        resetMetadata();
    }

    return (
        <div style={{ overflow: 'hidden' }}>
            <Navbar setPage={setPage} resetMetadata={resetMetadata} setIsDisabled={setIsDisabled} />
            <div className="d-flex" style={{ marginTop: '60px' }}>
                <SideNav info={info}
                    attributes={attributes}
                    storeInfo={storeInfo}
                    handleInputChange={handleInputChange}
                    handleStoreChange={handleStoreChange}
                    handleAttributeChange={handleAttributeChange}
                    handleImageChange={handleImageChange}
                    addOrUpdateToDB={addOrUpdateToDB}
                    page={page}
                    setPage={setPage}
                    createOffchainMetadata={createOffchainMetadata}
                    deleteMetadata={deleteMetadata}
                    isDisabled={isDisabled}
                    setIsDisabled={setIsDisabled}
                    userRole={userRole}
                    walletAddress={wallet.publicKey?.toBase58()}
                    resetMetadata={resetMetadata}
                    lockedStatus={lockStatus} />
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
                        userRole={userRole}
                        wallet={wallet} />}
            </div>
        </div>

    );
};

export default Homepage;