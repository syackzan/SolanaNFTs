import { 
    createProgrammableNft, 
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
    createSignerFromKeypair
} from '@metaplex-foundation/umi'

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'

import { useWallet } from '@solana/wallet-adapter-react'

import bs58 from 'bs58';

//CREATE AND CONNECT TO UMI WITH mplTokenMetadata Program
const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata());

/* START - WORKING FROM A CONNECTED WALLET */

const wallet = useWallet();

// Register Wallet Adapter to Umi
umi.use(walletAdapterIdentity(wallet))

/* END - WORKING FROM A CONNECTED WALLET */

export const createNFTFromMeta = async (metadataUri, umi) => {

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

export const createCollection = async (umi) => {

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

export const updateNFT = async () => {

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

export const airdropTestSol = async () => {
    console.log("Airdropping 1 SOL to identity");
    await umi.rpc.airdrop("5ZyYTa4gR3pzMcgtHYYBfANL5nvc2za7EM5BjhB78ogz", sol(1));
}

export const logNftData = async () => {
    const mintId = '4GcTdbfhpu4EHzZ8PegSgGzynxLHWMn9kdyuPhcimf5X'

    // Fetch the Metadata of the pNFT Asset
    const metadata = await fetchMetadataFromSeeds(umi, { mint: mintId })
    console.log(metadata);
}

export const verifyCollectionNow = async () => {

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