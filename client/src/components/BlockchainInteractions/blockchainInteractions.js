import {
    generateSigner,
    sol,
} from '@metaplex-foundation/umi'

import {
    createCollection,
    fetchAsset,
} from '@metaplex-foundation/mpl-core'

import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters' //If connecting a wallet via WalletProvider
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'

import { IS_MAINNET } from '../../config/config'
import axios from 'axios';
import { URI_SERVER } from '../../config/config'
// import { computeTxUnits, getPriorityFee } from './computeUnits'

const solanaNode = IS_MAINNET ? import.meta.env.VITE_SOLANA_NODE : 'https://api.devnet.solana.com'

const TEST_WALLET = "5ZyYTa4gR3pzMcgtHYYBfANL5nvc2za7EM5BjhB78ogz"

//CREATE AND CONNECT TO UMI WITH mplTokenMetadata Program
const umi = createUmi(solanaNode)

export const fetchAssets = async (wallet) => {

    const ownerType = new PublicKey(wallet.publicKey);
    const assetsByOwner = await fetchAssetsByOwner(umi, ownerType, {
        skipDerivePlugins: false,
    })

    console.log(assetsByOwner);

}

export const createCoreNft = async (nft, wallet) => {
    try {
        const requestBody = { nft, receiverPubKey: wallet.publicKey };

        const apiUrl = `${URI_SERVER}/api/nft/createnft`;

        // Make the POST request to the backend
        const signature = await axios.post(apiUrl, requestBody);

        console.log(signature);

    } catch (walletError) {
        console.error("Error registering wallet adapter:", walletError);
    }
};

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

    // Register Wallet Adapter to Umi
    umi.use(walletAdapterIdentity(wallet));
    console.log("Wallet updated:", wallet.publicKey);

    const collectionSigner = generateSigner(umi);

    // create collection
    await createCollection(umi, {
        collection: collectionSigner,
        name: 'Booh Brawlers Core Test',
        uri: 'https://nft.boohworld.io',
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