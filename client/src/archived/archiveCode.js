/* START - WORKING FROM A STORED PRIVATE KEY */
// Usually Keypairs are saved as Uint8Array, so you  
// need to transform it into a usable keypair.  
// let keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(import.meta.env.VITE_TEST_PRIVATE_KEY));

// Before Umi can use this Keypair you need to generate 
// a Signer type with it.  
// const signer = createSignerFromKeypair(umi, keypair);

// console.log(signer);

// umi.use(signerIdentity(signer));

/* END - WORKING FROM A STORED PRIVATE KEY */

// DESIGN FOR NFT

import {
    createProgrammableNft,
    setAndVerifyCollection,
    mplTokenMetadata,
    createNft,
    updateAsUpdateAuthorityV2,
    fetchMetadataFromSeeds,
    verifyCollectionV1,
    findMetadataPda,
    collectionToggle,
    TokenStandard
} from '@metaplex-foundation/mpl-token-metadata'

import {
    createGenericFile,
    generateSigner,
    percentAmount,
    publicKey,
    signAllTransactions,
    signerIdentity,
    sol,
    createSignerFromKeypair,
    transactionBuilder,
} from '@metaplex-foundation/umi'

// const COLLECTION_ADDRESS = "Dx8Y5Mnq35g5yfVAijzKun5DPJGGpr8EiqwSCqKyDt3u"; //Depreciated

// const COLLECTION_ADDRESS = "BA6UBeksZq9BYRkeLJV6j8PE5iNks8w5bjNxBpCLTrpb"; //Depreciated

<div>
    <div className="d-flex justify-content-between" style={{ marginBottom: '5px' }}>
        <div>Price: ${nft.storeInfo.price}</div>
        {nft.storeInfo.metadataUri ? (<div><FaLock /></div>) : (<div><FaLockOpen /></div>)}
    </div>
    <button key={index}
        className={`${rarityClass} ${isSelected ? "selected" : ""}`}
        style={{ marginBottom: "20px" }}
        onClick={() => { setEditData(nft), setSelectedIndex(index) }}>
        <div
            className="d-flex justify-content-between"
            style={{ marginBottom: "10px" }}
        >
            <div className={bannerClass}>{subType}</div>
            <div className={nftBlockchainClass}>{nftBlockchain}</div>
        </div>
        <img
            src={nft.image || "/path/to/default-image.png"} // Replace with a default image path if necessary
            alt={nft.name || "NFT"}
            style={{ width: "150px", height: "150px" }}
        />
        <h3 className="nft-name">{nft.name || "Unnamed NFT"}</h3>
        <div className="nft-stats">
            <p>
                <strong>Damage Boost:</strong> {damage > 0 ? `+${damage}%` : "-"}
            </p>
            <p>
                <strong>Defense:</strong> {defense > 0 ? `+${defense}%` : "-"}
            </p>
            <p>
                <strong>Dodge:</strong> {dodge > 0 ? `+${dodge}%` : "-"}
            </p>
            <p>
                <strong>Coin Multiplier:</strong> {coinMultiplier > 0 ? `+${coinMultiplier}%` : "-"}
            </p>
        </div>
    </button>
</div>

//SIMULATE TRANSACTION - NOT WORKING
export const simulateTransaction = async (nft, wallet) => {
    try {
        // Register Wallet Adapter to Umi
        // umi.use(walletAdapterIdentity(wallet));
        // console.log("Wallet updated:", wallet.publicKey);

        let keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(import.meta.env.VITE_TEST_PRIVATE_KEY));

        // Before Umi can use this Keypair you need to generate 
        // a Signer type with it.  
        const signer = createSignerFromKeypair(umi, keypair);

        // Tell Umi to use the new signer.
        umi.use(signerIdentity(signer))

        // const collectionAddress = await createCoreCollection(umi);

        try {
            // Fetch the collection
            const collection = await fetchCollection(umi, CORE_COLLECTION_ADDRESS);
            console.log("Collection fetched successfully:", collection);

            try {
                // Generate assetSigner and then create the asset
                const assetSigner = generateSigner(umi);
                console.log("Asset signer generated:", assetSigner);

                console.log("Creating Asset...");

                const tx = create(umi, {
                    asset: assetSigner,
                    collection: collection,
                    name: nft.name,
                    uri: nft.storeInfo.metadataUri,
                })

                // Simulate the transaction
                const simulationResult = await umi.rpc.simulate(tx);

                if (simulationResult.value.err) {
                    console.error("Simulation failed:", simulationResult.value.err);
                    return { success: false, error: simulationResult.value.err };
                }

                const fee = simulationResult.value.fee || 0; // Estimate the fee
                console.log("Simulation successful. Estimated fee:", fee);

                return { success: true, estimatedFee: fee };

                // console.log("Asset created,", assetSigner.publicKey);

                // console.log("Sending NFT");

                // await transferV1(umi, {
                //     asset: publicKey(assetSigner.publicKey),
                //     newOwner: wallet.publicKey,
                //     collection: CORE_COLLECTION_ADDRESS
                // }).sendAndConfirm(umi);

                // console.log("NFT Sent to: ", wallet.publicKey);

                console.log("Asset created and sent successfully.");
            } catch (assetCreationError) {
                console.error("Error creating asset:", assetCreationError);
            }
        } catch (collectionError) {
            console.error("Error fetching collection:", collectionError);
        }
    } catch (walletError) {
        console.error("Error registering wallet adapter:", walletError);
    }
}

//ORIGNAL META VERIFIFICATION FOR A COLLECTION
export const verifyCollectionNow = async (address, umi) => {

    console.log("Verifying NFT Collection");
    // Usually Keypairs are saved as Uint8Array, so you  
    // need to transform it into a usable keypair.  
    let keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(import.meta.env.VITE_TEST_PRIVATE_KEY));

    // Before Umi can use this Keypair you need to generate 
    // a Signer type with it.  
    const signer = createSignerFromKeypair(umi, keypair);

    // Tell Umi to use the new signer.
    umi.use(signerIdentity(signer))

    const mintId = address;

    console.log(mintId);

    try {
        // first find the metadata PDA to use later
        const metadata = findMetadataPda(umi, {
            mint: publicKey(mintId)
        });

        console.log(metadata);

        await verifyCollectionV1(umi, {
            metadata,
            collectionMint: publicKey(COLLECTION_ADDRESS),
            authority: signer,
        }).sendAndConfirm(umi)

        console.log("NFT Verified to collection");
    } catch (e) {
        console.log("Failed verification", e);
    }
}

//ORIGINAL WAY TO LOG NFT & CREATE NFT & CREATE COLLECTION

export const logNftData = async (address) => {

    //STANDARD
    const mintId = address;
    // Fetch the Metadata of the pNFT Asset
    const metadata = await fetchMetadataFromSeeds(umi, { mint: mintId })
    console.log(metadata);
}

export const createNFTFromMeta = async (nft, wallet) => {

    // Register Wallet Adapter to Umi
    umi.use(walletAdapterIdentity(wallet))

    //Convert Collection address to Public Key
    const collectionAddress = publicKey(COLLECTION_ADDRESS);

    //Generate a keypair for NFT creation (this will be NFT's token address)
    const nftSigner = generateSigner(umi);

    //No rulesets as of now
    const ruleset = null // or set a publicKey from above

    //UI Log
    console.log("Creating Nft...");

    //Create the NFT
    const tx = await createProgrammableNft(umi, {
        mint: nftSigner,
        sellerFeeBasisPoints: percentAmount(5.5),
        name: nft.name,
        uri: nft.storeInfo.metadataUri,
        ruleSet: ruleset,
        tokenStandard: TokenStandard.ProgrammableNonFungible,
        collection: {
            key: new PublicKey(collectionAddress),
            verified: false,
        },
    }).sendAndConfirm(umi);

    //UI LOG
    console.log("\npNFT Created")
    console.log("View Transaction on Solana Explorer");

    //Verify Collection
    await verifyCollectionNow(nftSigner.publicKey, umi);

    console.log(`https://explorer.solana.com/address/${nftSigner.publicKey}?cluster=devnet`);

    return tx;
}

export const newCollection = async (wallet) => {

    // Register Wallet Adapter to Umi
    umi.use(walletAdapterIdentity(wallet))

    try {
        const collectionMint = generateSigner(umi);

        const tx = await createNft(umi, {
            mint: collectionMint,
            name: 'Booh Brawlers testnet',
            uri: 'https://example.com/my-collection.json',
            sellerFeeBasisPoints: percentAmount(2.5), // 5.5%
            isCollection: true,
        }).sendAndConfirm(umi);

        console.log(tx);
        console.log("Collection Mint", collectionMint.publicKey)

        return collectionMint.publicKey;
    } catch (e) {
        console.log("Failed collection creation", e)
    }
}

export const updateNFT = async (wallet, mintId, collectionId) => {

    // Register Wallet Adapter to Umi
    umi.use(walletAdapterIdentity(wallet))
    console.log("update wallet", wallet.publicKey);

    try {

        console.log("Updating NFT Collection");
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

        console.log("NFT updated");

        await verifyCollectionNow(mintId, umi);

        console.log('Collection successfully set:', txRes);
    } catch (e) {
        console.error('Error setting collection:', e);
    }
}

/* CODE TO ALLOW ONLY SKINS AS DIVISION ITEMS*/
// <>
//     {attributes.find((attr) => attr.trait_type === "type")?.value === 'skin' ? (
//         <>
//             <select
//                 value={attribute.value}
//                 onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
//                 disabled={!canEditFields || (page === 'update' && !isAdmin)}
//                 style={{
//                     width: "100%",
//                     padding: "10px",
//                     borderRadius: "4px",
//                     border: "1px solid #555",
//                     backgroundColor: "#2E2E2E",
//                     color: "#FFF",
//                 }}
//             >
//                 <option value="">Select...</option>
//                 {divisionOptions.map((division, i) => (
//                     <option key={i} value={division}>
//                         {division.charAt(0).toUpperCase() + division.slice(1)}
//                     </option>
//                 ))}
//             </select>
//         </>
//     ) : (
//         <>
//             <select
//                 value={attribute.value}
//                 onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
//                 disabled={true}
//                 style={{
//                     width: "100%",
//                     padding: "10px",
//                     borderRadius: "4px",
//                     border: "1px solid #555",
//                     backgroundColor: "#2E2E2E",
//                     color: "#FFF",
//                 }}
//             >
//                 <option value="none">None [Skins Only]</option>
//             </select>
//         </>
//     )}
// </>