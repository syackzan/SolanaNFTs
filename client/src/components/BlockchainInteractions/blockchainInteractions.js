import {
    mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'

import {
    generateSigner,
    publicKey,
    signerIdentity,
    sol,
    createSignerFromKeypair,
    transactionBuilder,
    signTransaction
} from '@metaplex-foundation/umi'

import {
    createCollection,
    create,
    fetchCollection,
    fetchAsset,
    transferV1
} from '@metaplex-foundation/mpl-core'

import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

// import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters' //If connecting a wallet via WalletProvider

import bs58 from 'bs58';

//CREATE AND CONNECT TO UMI WITH mplTokenMetadata Program
const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata());

/* START - WORKING FROM A CONNECTED WALLET */

let keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(import.meta.env.VITE_TEST_PRIVATE_KEY));

// Before Umi can use this Keypair you need to generate 
// a Signer type with it.  
const signer = createSignerFromKeypair(umi, keypair);

/* END - WORKING FROM A CONNECTED WALLET */

const CORE_COLLECTION_ADDRESS = 'AQWGjfgwj8fuQsQFrfN58JzVxWG6dAosU33e35amUcPo';

const TEST_WALLET = "5ZyYTa4gR3pzMcgtHYYBfANL5nvc2za7EM5BjhB78ogz"

export const createCoreNft = async (nft, wallet) => {
    try {
        // Register Wallet Adapter to Umi
        // umi.use(walletAdapterIdentity(wallet));
        // console.log("Wallet updated:", wallet.publicKey);

        // Tell Umi to use the new signer.
        umi.use(signerIdentity(signer))

        // const collectionAddress = await createCoreCollection(umi);


        //TESTING
        const collection = await fetchCollection(umi, CORE_COLLECTION_ADDRESS);
        console.log("Collection fetched successfully:", collection);

        const assetSigner = generateSigner(umi);

        let builder = transactionBuilder()
            .add(create(umi, {
                asset: assetSigner,
                collection: collection,
                name: nft.name,
                uri: nft.storeInfo.metadataUri,
            }))

        const transaction = await builder.buildWithLatestBlockhash(umi);
        console.log(transaction);

        // const mySigners = [signer, assetSigner];

        // const signedTransaction = await signTransaction(transaction, mySigners);
        // console.log(signedTransaction);

        // const signature = await umi.rpc.sendTransaction(signedTransaction);
        // console.log(signature);

        // const signedTransaction = await builder.buildAndSign(umi);
        // console.log(signedTransaction);

        // const yes = await builder.setLatestBlockhash(umi);
        // console.log(yes);

        // const transactionTest = await builder.buildAndSign(umi);
        // console.log(transactionTest);
        // return;

        const mySerializedTransaction = umi.transactions.serialize(transaction)
        console.log(mySerializedTransaction);

        // Serialize the transaction to Base64
        const base64Transaction = Buffer.from(mySerializedTransaction).toString('base64');

        // Send the serialized transaction to the backend
        const response = await fetch('http://localhost:5000/api/nft/signer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                transaction: base64Transaction,
                assetSigner: {
                    publicKey: assetSigner.publicKey,
                    secretKey: Array.from(assetSigner.secretKey)
                } 
            }),
        });

        const result = await response.json();
        console.log('Transaction Result:', result);

        return;
        ///TESTING

        try {
            // Fetch the collection
            const collection = await fetchCollection(umi, CORE_COLLECTION_ADDRESS);
            console.log("Collection fetched successfully:", collection);

            try {
                // Generate assetSigner and then create the asset
                const assetSigner = generateSigner(umi);
                console.log("Asset signer generated:", assetSigner);

                console.log("Creating Asset...");

                await create(umi, {
                    asset: assetSigner,
                    collection: collection,
                    name: nft.name,
                    uri: nft.storeInfo.metadataUri,
                }).sendAndConfirm(umi);

                console.log("Asset created,", assetSigner.publicKey);

                console.log("Sending NFT");

                await transferV1(umi, {
                    asset: publicKey(assetSigner.publicKey),
                    newOwner: wallet.publicKey,
                    collection: CORE_COLLECTION_ADDRESS
                }).sendAndConfirm(umi);

                console.log("NFT Sent to: ", wallet.publicKey);

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
};

export const transferAsset = async (wallet, address) => {

    // Tell Umi to use the new signer.
    umi.use(signerIdentity(signer))

    console.log("Sending To New wallet: ", wallet.publicKey.toString());
    try {
        await transferV1(umi, {
            asset: publicKey(address),
            newOwner: wallet.publicKey,
            collection: CORE_COLLECTION_ADDRESS
        }).sendAndConfirm(umi);

        console.log("Sent to: ", wallet.publicKey.toString());
    } catch (error) {
        console.error("Error transferring NFT:", error);
    }
};

export const sendSol = async (fromPubkeyString) => {

    const amount = .004;

    const fromPubkey = new PublicKey(fromPubkeyString);
    const toPubkey = new PublicKey(TEST_WALLET)

    console.log("Building Send Trasaction to: ", TEST_WALLET)

    try {

        const transaction = new Transaction();
        const sendSolInstruction = SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: amount * 1_000_000_000,
        });

        transaction.add(sendSolInstruction);

        console.log("Transaction built");

        return transaction;
    } catch (error) {
        console.error("Error sending SOL:", error);
    }
};

export const createCoreCollection = async (umi) => {

    const collectionSigner = generateSigner(umi)

    // create collection
    // if you are doing this in a single script you may have
    // to use a sleep function or commitment level of 'finalized'
    // so the collection is fully written to change before fetching it.
    await createCollection(umi, {
        collection: collectionSigner,
        name: 'Booh Brawlers Core Test',
        uri: 'https://example.com/my-collection.json',
    }).sendAndConfirm(umi)

    return collectionSigner.publicKey;
}

export const airdropTestSol = async () => {
    console.log("Airdropping 1 SOL to identity");
    await umi.rpc.airdrop("5ZyYTa4gR3pzMcgtHYYBfANL5nvc2za7EM5BjhB78ogz", sol(1));
}

export const logNftData = async (address) => {

    //CORE
    const asset = await fetchAsset(umi, address, {
        skipDerivePlugins: false
    })

    console.log(asset);
}