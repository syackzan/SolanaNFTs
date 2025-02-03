//React elements
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

//Components
import SideNav from '../SideNav/SideNav';
import NFTPreview from '../NFTPreview/NFTPreview';
import NFTUpdate from '../NFTUpdate/NFTUpdate';
import Navbar from '../Navbar/Navbar';

//Utility functions
import { priceToSol, uploadIcon, uploadMetadata } from '../../Utils/Utils';
import { checkIfAdmin } from '../../Utils/checkRole';
import { createSendSolTx } from '../BlockchainInteractions/blockchainInteractions';

//Imported packages
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react';

//Configs
import { URI_SERVER } from '../../config/config';
import {
    infoData,
    getAttributesData,
    storeInfoData,
    propertiesData,
    creatorCosts
} from '../../config/gameConfig';

//Imported images
import tempImage from '../../assets/itemBGs/tempImage.png';
import { ScreenProvider } from '../../context/ScreenContext';

import { useMarketplace } from '../../context/MarketplaceProvider';

const API_KEY = import.meta.env.VITE_SERVE_KEY

const Homepage = () => {

    //Wallet connection
    const wallet = useWallet();
    const { connection } = useConnection();

    const [userRole, setUserRole] = useState(null);

    const attributesData = getAttributesData();

    useEffect(() => {

        const runAsync = async () => {


            if (wallet.publicKey) {
                // fetchAssets(wallet);

                // const success = await deductBabyBooh(wallet.publicKey);
                // console.log(success);

                // const resp = await fetchSingleNftMetadata('6789733fcce17af1b40985f3')
                // console.log(resp);
            }
        }

        runAsync();

    }, [wallet.publicKey])

    const [searchParams] = useSearchParams();
    const action = searchParams.get('action'); // "create" or "update"

    const {
        setTxState,
        setCreateState,
        setTransactionSig,
        setImageName
    } = useMarketplace();

    //Handles Page switching for UI
    const [page, setPage] = useState(action);

    //Store Image for display
    const [image, setImage] = useState(null);

    //Refetches NFTs when flipped
    const [refetchNFTs, setRefetchNFTs] = useState(false);

    //Stores newly created metadata for?
    const [newMetadata, setNewMetadata] = useState(null);

    //Handles disabling buttons
    const [isDisabled, setIsDisabled] = useState(false); //Button use for storing metadata in database
    const [lockStatus, setLockStatus] = useState(false); //Button used for creating offchain metadata
    const [createLockStatus, setCreateLockStatus] = useState(false); //Use case for if a Admin is create offchain metadata from create page
    const [disableDeleteButton, setDisabledDeleteButton] = useState(false);

    //States that make up Meta data information
    const [info, setInfo] = useState(infoData);

    const [attributes, setAttributes] = useState(attributesData);
    const [properties, setProperties] = useState(propertiesData);
    //State that makes up Store Information
    const [storeInfo, setStoreInfo] = useState(storeInfoData);

    //Function that resets local metadata when needed
    const resetMetadata = () => {
        setInfo(infoData);
        setAttributes(attributesData);
        setProperties(propertiesData);
        setStoreInfo(storeInfoData);
        setImageName('');
        setImage(null);
        setNewMetadata(null);
    }



    //Handles Wallet connection & Admin Login
    useEffect(() => {

        const checkAdminStatus = async () => {

            if (wallet.connected) {

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

    //Handle Image uploads
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the selected file

        if (file) {
            const img = new Image();
            const fileURL = URL.createObjectURL(file); // Create a temporary URL for the image

            img.onload = () => {
                const { width, height } = img;

                // Validate image dimensions
                if (width >= 512 || height >= 512 || width !== height) {
                    alert("Image dimensions must be 512x512 or smaller, and same width/height.");
                    e.target.value = ""; // Reset the file input
                } else {
                    setImage(file); // Set the image as usual if valid
                    setImageName(file.name);
                }

                URL.revokeObjectURL(fileURL); // Clean up the temporary URL
            };

            img.onerror = () => {
                alert("Invalid image file.");
                URL.revokeObjectURL(fileURL); // Clean up the temporary URL
            };

            img.src = fileURL; // Trigger the `onload` handler by setting the image source
        }
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

    const creatorPayment = async () => {

        if (userRole === 'admin') //Admins are exempt from creator costs
            return true;

        try {
            //Pay for higher level creation items
            const rarityAttribute = attributes.find(attr => attr.trait_type === "rarity");

            const paymentInUSD = creatorCosts[rarityAttribute.value];

            if (paymentInUSD === 0)
                return true;

            const paymentInSol = await priceToSol(paymentInUSD);

            const transaction = await createSendSolTx(wallet.publicKey, paymentInSol);

            if (!transaction)
                return false;

            const signature = await wallet.sendTransaction(transaction, connection);

            if (signature) {
                console.log("Creator Payment Successful")
                return true;
            } else {
                console.log("Creator Payment Failed");
                return false;
            }

        } catch (e) {
            console.log("Creator payment failed", e)
            return false;
        }
    }

    //Add new entry or update entry to Database
    const addOrUpdateToDB = async () => {

        try {

            if (page === 'create') {

                const success = await creatorPayment(); //Higher level items have creator costs

                console.log(success);
                if (!success)
                    return false;

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

            setTxState('started');

            // Combine offchain metadata
            const metadataForJSONUpload = await combineOffchainMetatdata();

            // Upload metadata and get the URI
            const metadataUri = await uploadMetadata(metadataForJSONUpload);

            setTxState('complete');

            // Determine the object ID based on the page
            let objectId;
            if (page === 'create') {
                objectId = newMetadata._id; // Newly created metadata
            } else {
                objectId = info._id; // Metadata existing in DB already
            }

            setCreateState('started')

            // Make the PATCH request to lock the NFT
            const response = await axios.patch(
                `${URI_SERVER}/api/nft/locknft/${objectId}`,
                { metadataUri: metadataUri }, // Send data as an object in the request body
                { headers: { 'x-api-key': API_KEY } } // Include API key in headers
            );

            // Handle response
            if (response.status >= 200 && response.status < 300) {
                console.log('Update Successful:', response.data);
                setCreateState('complete');
                setTransactionSig(metadataUri);
                resetMetadata(); // Reset metadata
                setRefetchNFTs(!refetchNFTs); // Trigger refetch
            } else {
                setCreateState('failed');
                console.error('Failed to update metadata:', response);
                alert("Metadata failed to lock");
            }
        } catch (error) {
            // Log and handle any errors
            console.error('Error in createOffchainMetadata:', error);
            setTxState('failed');
        }
    };

    const deleteMetadata = async () => {

        setTxState('started');
        await delay(2000);

        try {
            await axios.delete(`${URI_SERVER}/api/nft/delete/${info._id}`);
            setTxState('complete');
        } catch (error) {
            console.error('Error updating data', error.response?.data || error.message);
            setTxState('failed');
        }

        setRefetchNFTs(!refetchNFTs);
        resetMetadata();
        setDisabledDeleteButton(false);
    }

    return (
        // SCREEN PROVIDER IS TO TRACK SCREEN SIZE AND DYNAMICALLY UPDATE CSS
        <ScreenProvider>
            {/* THIS Handles bulk of Homepage Components */}
            <div style={{ overflow: 'hidden' }}>
                <Navbar setPage={setPage} resetMetadata={resetMetadata} setIsDisabled={setIsDisabled} />
                <div className="d-flex" style={{ marginTop: '60px' }}>
                    <SideNav info={info}
                        attributes={attributes}
                        storeInfo={storeInfo}
                        setStoreInfo={setStoreInfo}
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
                        lockedStatus={lockStatus}
                        createLockStatus={createLockStatus}
                        setCreateLockStatus={setCreateLockStatus}
                        disableDeleteButton={disableDeleteButton} />
                    {page === "create" &&
                        <NFTPreview
                            info={info}
                            attributes={attributes}
                            storeInfo={storeInfo}
                            image={image}
                            handleImageChange={handleImageChange} />}
                    {page === "update" &&
                        <NFTUpdate
                            setInfo={setInfo}
                            setAttributes={setAttributes}
                            setProperties={setProperties}
                            setStoreInfo={setStoreInfo}
                            refetchNFTs={refetchNFTs}
                            userRole={userRole}
                            wallet={wallet}
                            createOffchainMetadata={createOffchainMetadata}
                            deleteMetadata={deleteMetadata} />}
                </div>
            </div>
        </ScreenProvider>
    );
};

export default Homepage;