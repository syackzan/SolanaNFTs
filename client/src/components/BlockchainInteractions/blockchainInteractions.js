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

import { setComputeUnitLimit, setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox';

import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters' //If connecting a wallet via WalletProvider

import { computeTxUnits, getPriorityFee } from './computeUnits'

import bs58 from 'bs58';

import { IS_MAINNET } from '../config'

import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'

import axios from 'axios';

const solanaNode = IS_MAINNET ? import.meta.env.VITE_SOLANA_NODE : 'https://api.devnet.solana.com'
console.log(solanaNode);

//CREATE AND CONNECT TO UMI WITH mplTokenMetadata Program
const umi = createUmi(solanaNode)
    // .use(mplTokenMetadata());

/* START - WORKING FROM A CONNECTED WALLET */

let keypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(import.meta.env.VITE_TEST_PRIVATE_KEY));

// Before Umi can use this Keypair you need to generate 
// a Signer type with it.  
const signer = createSignerFromKeypair(umi, keypair);

import { fetchNFTsUtils } from './GetNFTsUtils';


/* END - WORKING FROM A CONNECTED WALLET */

const CORE_COLLECTION_ADDRESS = IS_MAINNET ? "CnRTKtN1piFJcrchQPgPN1AH7hagLbAMtkXuhabcruNz" : 'AQWGjfgwj8fuQsQFrfN58JzVxWG6dAosU33e35amUcPo';

const TEST_WALLET = "5ZyYTa4gR3pzMcgtHYYBfANL5nvc2za7EM5BjhB78ogz"

export const fetchAssets = async (wallet) => {

    const ownerType = new PublicKey(wallet.publicKey);
    const assetsByOwner = await fetchAssetsByOwner(umi, ownerType, {
        skipDerivePlugins: false,
      })

    console.log(assetsByOwner);

    // await fetchNFTsUtils(wallet.publicKey.toString());

}

export const createCoreNft = async (nft, wallet) => {
    try {
        // Register Wallet Adapter to Umi
        // umi.use(walletAdapterIdentity(wallet));
        // console.log("Wallet updated:", wallet.publicKey);

        const requestBody = { nft, receiverPubKey: wallet.publicKey };

        const apiUrl = 'http://localhost:8080/api/nft/createnft';

        // Make the POST request to the backend
        const responseTx = await axios.post(apiUrl, requestBody);

        return;

        // Tell Umi to use the new signer.
        umi.use(signerIdentity(signer))

        //TESTING
        const collection = await fetchCollection(umi, CORE_COLLECTION_ADDRESS);
        console.log("Collection fetched successfully:", collection);

        const assetSigner = generateSigner(umi);

        // const resp = await create(umi, {
        //     asset: assetSigner,
        //     name: 'My Asset',
        //     collection: collection,
        //     name: nft.name,
        //     uri: nft.storeInfo.metadataUri,
        // }).sendAndConfirm(umi)

        // console.log(resp);
        // return;

        const perComputeUnit = await getPriorityFee(umi, wallet);

        let builder = transactionBuilder()
            .add(setComputeUnitLimit(umi, { units: 600_000 }))
            .add(setComputeUnitPrice(umi, { microLamports: perComputeUnit }))
            .add(create(umi, {
                asset: assetSigner,
                collection: collection,
                name: nft.name,
                uri: nft.storeInfo.metadataUri,
            })).add(transferV1(umi, {
                asset: publicKey(assetSigner.publicKey),
                newOwner: wallet.publicKey,
                collection: CORE_COLLECTION_ADDRESS
            }))

        await builder.sendAndConfirm(umi);

        return;

        let transaction = await builder.buildWithLatestBlockhash(umi);

        console.log(transaction);

        transaction.message.accounts[6] = wallet.publicKey.toString();
        // transaction.message.instructions[3].accountIndexes =  [1, 2, 0, 4, 6, 4, 4];

        const mySerializedTransaction = umi.transactions.serialize(transaction)

        // Serialize the transaction to Base64
        const base64Transaction = Buffer.from(mySerializedTransaction).toString('base64');

        // Send the serialized transaction to the backend
        const response = await fetch('http://localhost:8080/api/nft/signer', {
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

    } catch (walletError) {
        console.error("Error registering wallet adapter:", walletError);
    }
};

// export const transferAsset = async (wallet, address) => {

//     // Tell Umi to use the new signer.
//     umi.use(signerIdentity(signer))

//     console.log("Sending To New wallet: ", wallet.publicKey.toString());
//     try {
//         await transferV1(umi, {
//             asset: publicKey(address),
//             newOwner: wallet.publicKey,
//             collection: CORE_COLLECTION_ADDRESS
//         }).sendAndConfirm(umi);

//         console.log("Sent to: ", wallet.publicKey.toString());
//     } catch (error) {
//         console.error("Error transferring NFT:", error);
//     }
// };

export const createSendSolTx = async (fromPubkeyString, payment = 0) => {

    const mintingCosts = .004
    const amount = mintingCosts + payment;

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

export const createCoreCollection = async () => {

    const collectionSigner = generateSigner(umi);

    // Tell Umi to use the new signer.
    umi.use(signerIdentity(signer));

    // create collection
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