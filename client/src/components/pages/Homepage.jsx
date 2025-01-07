import React, { useState, useEffect } from 'react';

import SideNav from '../SideNav/SideNav';
import NFTPreview from '../NFTPreview/NFTPreview';

import axios from 'axios';

import { uploadIcon, uploadMetadata } from '../Utils';

import { createProgrammableNft, mplTokenMetadata, createNft, updateAsUpdateAuthorityV2, fetchMetadataFromSeeds, } from '@metaplex-foundation/mpl-token-metadata'
import {
    createGenericFile,
    generateSigner,
    percentAmount,
    publicKey,
    signAllTransactions,
    signerIdentity,
    sol,
    createSignerFromKeypair
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

import { verifyCollectionV1, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

import { collectionToggle, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
// import { getMplTokenAuthRulesProgramId } from '@metaplex-foundation/umi';

import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

import bs58 from 'bs58';
import NFTUpdate from '../NFTUpdate/NFTUpdate';

const TEST_INFO = {
    name: 'Arrow',
    symbol: 'ARR',
    description: 'Arrow to attack',
    image: 'http://res.cloudinary.com/dagu222du/image/upload/v1735557380/azixlkhngmnkfoijbfis.png'
}

const TEST_IMAGE_URL = 'https://api.cloudinary.com/v1_1/dagu222du/upload/http://res.cloudinary.com/dagu222du/image/upload/v1735903280/seilyo7pgqkokklydsgk.png';

const TEST_METADATA = 'https://black-leading-beetle-899.mypinata.cloud/ipfs/bafkreiamgwgjgnnztikjaqpvfdwt72lope4syjmnh3eedoy6efnxj6gptu';

const COLLECTION_ADDRESS = '12z6CvtaeAYtCpeo2sUacFDKyDvZdzCHnyCVPFJ98coc'

const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata());

//WORKING FROM FILE SECRET KEY
// Usually Keypairs are saved as Uint8Array, so you  
// need to transform it into a usable keypair.  
let keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(import.meta.env.VITE_TEST_PRIVATE_KEY));

// Before Umi can use this Keypair you need to generate 
// a Signer type with it.  
const signer = createSignerFromKeypair(umi, keypair);

// console.log(signer);

// umi.use(signerIdentity(signer));

// //WORKING FROM FILE SECRET KEY

const Homepage = () => {

    const [page, setPage] = useState('create');

    const [image, setImage] = useState(null);
    const [metadataURI, setMetadataURI] = useState('');
    const [refetchNFTs, setRefetchNFTs] = useState(false);

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

    const [storeInfo, setStoreInfo] = useState({
        available: '',
        price: '',
        season: ''
    })

    const resetMetadata = () => {
        setInfo({ name: '', symbol: 'BOOH', description: '', image: '', external_link: 'https://boohworld.io/boohbrawlers/marketplace' });
        setAttributes([
            { trait_type: "blockchain", value: "none" },
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
            season: ''
        })
    }

    const wallet = useWallet();

    // Register Wallet Adapter to Umi
    umi.use(walletAdapterIdentity(wallet))

    useEffect(() => {
        if (wallet.connected) {
            console.log("Wallet connected:", wallet.publicKey?.toBase58());
            // Perform actions when the user logs in
            // updateUserWallet(wallet.publicKey.toBase58());
        } else {
            console.log("Wallet disconnected");
            // Perform actions when the user logs out
            // clearUserWallet();
        }
    }, [wallet.connected, wallet.publicKey]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfo({ ...info, [name]: value });
    };

    const handleStoreChange = (key, value) => {
        setStoreInfo((prev) => ({
            ...prev,
            [key]: value
        }));
    };

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

    // Add a new attribute
    const handleAddAttribute = () => {
        setAttributes([...attributes, { trait_type: "", value: "" }]);
    };

    // Remove an attribute
    const handleRemoveAttribute = (index) => {
        setAttributes(attributes.filter((_, i) => i !== index));
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

    const createMetadataJSON = async () => {
        // Upload the image
        const iconResp = await uploadIcon(image);
        const imageURL = iconResp.url;

        console.log("Upload complete: ", imageURL);

        //Set info.image to proper URL
        setInfo({ ...info, image: imageURL });

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

        const metadataCombined = {
            ...info,
            attributes,
            properties,
            storeInfo,
        }

        return metadataCombined;
    }

    const createUpdateMetadataJSON = async () => {

        const metadataCombined = {
            ...info,
            attributes,
            properties,
            storeInfo,
        }

        return metadataCombined;
    }

    const createOffChainData = async () => {
        try {

            if (!image) {
                alert('Please upload an image.');
                return;
            }

            console.log("Uploading Image");



            console.log(metadataCombined);

            //Upload metadata
            const metadataUri = await uploadMetadata(metadataCombined);

            console.log('Metadata URI:', metadataUri);

            setMetadataURI(metadataUri);

            createNFTFromMeta(metadataUri);
        } catch (error) {
            console.error('Error creating NFT data:', error);
            alert('There was an error creating the NFT. Please try again.');
        }
    };

    const createNFTFromMeta = async (metadataUri) => {

        const nftSigner = generateSigner(umi);

        // Decide on a ruleset for the Nft.
        // Metaplex ruleset - publicKey("eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9")
        // Compatability ruleset - publicKey("AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5")
        const ruleset = null // or set a publicKey from above

        console.log("Creating Nft...");
        const tx = await createProgrammableNft(umi, {
            mint: nftSigner,
            sellerFeeBasisPoints: percentAmount(5.5),
            name: info.name,
            uri: metadataUri,
            // symbol: 'BOOH',
            ruleSet: ruleset,
        }).sendAndConfirm(umi);

        console.log(tx);

        // Finally we can deserialize the signature that we can check on chain.
        // const signature = bs58.deserialize(tx.signature)[0];

        // Log out the signature and the links to the transaction and the NFT.
        console.log("\npNFT Created")
        console.log("View Transaction on Solana Explorer");
        // console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        console.log("\n");
        console.log("View NFT on Metaplex Explorer");
        console.log(`https://explorer.solana.com/address/${nftSigner.publicKey}?cluster=devnet`);
    }

    const airdropTestSol = async () => {
        console.log("Airdropping 1 SOL to identity");
        await umi.rpc.airdrop("5ZyYTa4gR3pzMcgtHYYBfANL5nvc2za7EM5BjhB78ogz", sol(1));
    }

    const createCollection = async () => {

        try {
            const collectionMint = generateSigner(umi);
            const tx = await createNft(umi, {
                mint: collectionMint,
                name: 'My Collection',
                uri: 'https://example.com/my-collection.json',
                sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
                isCollection: true,
            }).sendAndConfirm(umi);

            console.log(collectionMint.publicKey)
        } catch (e) {
            console.log("Failed collection creation", e)
        }
    }

    const updateNFT = async () => {

        try {

            const mintId = '4GcTdbfhpu4EHzZ8PegSgGzynxLHWMn9kdyuPhcimf5X'
            const nftAddress = publicKey(mintId);

            const collectionAddress = publicKey(COLLECTION_ADDRESS);

            // Fetch the Metadata of the pNFT Asset
            const metadata = await fetchMetadataFromSeeds(umi, { mint: mintId })

            const txRes = await updateAsUpdateAuthorityV2(umi, {
                mint: nftAddress,
                data: metadata, // Leave empty if no metadata updates are needed
                tokenStandard: TokenStandard.ProgrammableNonFungible,
                collection: collectionToggle('Set', [
                    {
                        key: collectionAddress,
                        verified: false,
                    },
                ])
                // authorizationRules:
                //     unwrapOptionRecursively(metadata.programmableConfig)?.ruleSet || undefined, // If your pNFT has rules
                // authorizationRulesProgram: getMplTokenAuthRulesProgramId(umi), // The rules program ID
                // authorizationData: undefined, // Use if required by your authorization rules
            }).sendAndConfirm(umi);

            console.log('Collection successfully set:', txRes);
        } catch (e) {
            console.error('Error setting collection:', e);
        }
    }

    const logNftData = async () => {
        const mintId = '4GcTdbfhpu4EHzZ8PegSgGzynxLHWMn9kdyuPhcimf5X'

        // Fetch the Metadata of the pNFT Asset
        const metadata = await fetchMetadataFromSeeds(umi, { mint: mintId })
        console.log(metadata);
    }

    const verifyCollectionNow = async () => {

        const mintId = '4GcTdbfhpu4EHzZ8PegSgGzynxLHWMn9kdyuPhcimf5X'

        try {
            // first find the metadata PDA to use later
            const metadata = findMetadataPda(umi, {
                mint: publicKey(mintId)
            });

            await verifyCollectionV1(umi, {
                metadata,
                collectionMint: publicKey(COLLECTION_ADDRESS),
                authority: signer,
            }).sendAndConfirm(umi)
        } catch (e) {
            console.log("Failed verification", e);
        }
    }

    const addToDB = async () => {

        try {

            if (page === 'create') {
                const metadataForDB = await createMetadataJSON();
                const response = await axios.post('http://localhost:5000/api/nft/create', metadataForDB);
                console.log('NFT Metadata created successfully:', response.data);
            }

            if (page === 'update') {
                //Combine Metadata
                const updateDataForDB = await createUpdateMetadataJSON();

                //Remove ID from metadata
                const response = await axios.patch(`http://localhost:5000/api/nft/update/${updateDataForDB._id}`, updateDataForDB);
                console.log('Update Successfull,', response.data);

                setRefetchNFTs(!refetchNFTs);
            }

        } catch (error) {
            console.error('Error creating NFT metadata:', error.response?.data || error.message);
        }
    }

    const getMetadata = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/nft/all');
            console.log('NFT DATA', response.data);
        } catch (e) {
            console.error('Error when accessing data', error.response?.data || error.message)
        }
    }

    const updateMetadata = async () => {
        const test_id = '6779125c1f57bea446943b1f';
        const updateData = { name: 'Spear' };

        try {
            const response = await axios.patch(`http://localhost:5000/api/nft/update/${test_id}`, updateData);
            console.log('Update Successfull,', response.data);
        } catch (error) {
            console.error('Error updating data', error.response?.data || error.message);
        }
    }

    const deleteMetadata = async () => {
        const test_delete_id = '677d38beaf09a827e3fd976d';

        try {
            const response = await axios.delete(`http://localhost:5000/api/nft/delete/${test_delete_id}`);
            console.log('Update Successfull,', response.data);
        } catch (error) {
            console.error('Error updating data', error.response?.data || error.message);
        }

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
                    <button onClick={createCollection}>create collection</button>
                    <button onClick={updateNFT}>update NFT</button>
                    <button onClick={logNftData}>Log NFT</button>
                    <button onClick={verifyCollectionNow}>Verify</button>
                    <button onClick={addToDB}>ADD</button>
                    <button onClick={getMetadata}>Get</button>
                    <button onClick={updateMetadata}>Update</button>
                    <button onClick={deleteMetadata}>Delete</button>
                </div>
                <div className="d-flex justify-content-center gap-3">
                    <button className="darkmode-button" onClick={() => { setPage('create'), resetMetadata() }}>Create</button>
                    <button className="darkmode-button" onClick={() => { setPage('update'), resetMetadata() }}>Update</button>
                </div>
            </div>
            <div className="d-flex">
                <SideNav info={info}
                    attributes={attributes}
                    storeInfo={storeInfo}
                    handleInputChange={handleInputChange}
                    handleStoreChange={handleStoreChange}
                    handleAttributeChange={handleAttributeChange}
                    handleImageChange={handleImageChange}
                    addToDB={addToDB}
                    page={page} />
                {page === "create" && <NFTPreview info={info} attributes={attributes} storeInfo={storeInfo} image={image}  />}
                {page === "update" && <NFTUpdate setInfo={setInfo} setAttributes={setAttributes} setProperties={setProperties} setStoreInfo={setStoreInfo} refetchNFTs={refetchNFTs} />}
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