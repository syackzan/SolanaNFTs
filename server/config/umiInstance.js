const {
    signerIdentity,
    createSignerFromKeypair,
} = require('@metaplex-foundation/umi'); 

const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');

const bs58 = require('bs58');

function initializeUmi() {
    const solanaNode = process.env.IS_MAINNET === 'true' ? process.env.SOLANA_NODE : 'https://api.devnet.solana.com';
    console.log(solanaNode);

    const umi = createUmi(solanaNode);

    // Load the private key securely
    const privateKey = bs58.default.decode(process.env.TEST_WALLET_KEY);
    const keypair = umi.eddsa.createKeypairFromSecretKey(privateKey);

    const signer = createSignerFromKeypair(umi, keypair);

    umi.use(signerIdentity(signer));
    return umi;
}

module.exports = { initializeUmi };