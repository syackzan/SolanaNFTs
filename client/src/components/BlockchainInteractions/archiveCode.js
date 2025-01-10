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