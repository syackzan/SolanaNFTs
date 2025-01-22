import React, { useState } from 'react';

import { createCoreNft, createSendSolTx } from '../BlockchainInteractions/blockchainInteractions';

import Navbar from '../Navbar/Navbar';
import PrintNfts from '../PrintNfts/PrintNfts';

import Filter from '../Filter/Filter';
import useNFTs from '../Hooks/useNFTs';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { priceToSol } from '../../Utils/Utils';

const Marketplace = () => {

    const wallet = useWallet();
    const { connection } = useConnection();

    const {
        nfts,
        selectedIndex,
        setSelectedIndex,
        selectedType,
        setSelectedType,
        selectedSubType,
        setSelectedSubType,
        selectedRarity,
        setSelectedRarity,
        selectedCreator,
        setSelectedCreator,
        setIsFetched,
    } = useNFTs({ inStoreOnly: true });

    const payWithSol = async () => {

        const mintCosts = 0.004; //Costs to mint an NFT
        const solToSend = await priceToSol(nfts[selectedIndex].storeInfo.price, mintCosts); //Get Sol in USD per NFT price

        console.log(solToSend);

        const transaction = await createSendSolTx(wallet.publicKey, solToSend); //Built a sent sol Transaction
        const signature = await wallet.sendTransaction(transaction, connection); //Send the transaction
        console.log(`Transaction signature: ${signature}`);

        return signature; //Return sig

    }

    const payWithBabyBooh = async () => {

    }

    const payWithStripe = async () => {

    }

    const createNft = async (paymentType) => {

        if (!wallet.publicKey) {
            alert("User must sign in!");
        }

        let signature;
        try {

            if (paymentType === 'SOL') {
                signature = payWithSol(); //Pay with sol
            }

            if (signature) { //If Sig is true, create and send NFT
                try {

                    //TODO: HANDLE UI TRACKING OF PAYING WITH AND MINTING NFT
                    const resp = await createCoreNft(nfts[selectedIndex], wallet);
                    console.log(resp.data.serializedSignature);
                } catch (e) {
                    alert('Failed to send Sol');
                    console.log('Failure to create NFT: ', e)
                }

            }
        } catch (e) {
            console.log('Failure to transfer Sol', e);
        }

        return;
    }

    const setEditData = () => { }

    return (
        <div style={{ height: 'calc(100vh-60px)', marginTop: '60px' }}>
            <Navbar />
            <div style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
                <Filter
                    title={"MARKETPLACE"}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    selectedSubType={selectedSubType}
                    setSelectedSubType={setSelectedSubType}
                    selectedRarity={selectedRarity}
                    setSelectedRarity={setSelectedRarity}
                    setIsFetched={setIsFetched}
                    selectedCreator={selectedCreator}
                    setSelectedCreator={setSelectedCreator}
                />
                <PrintNfts
                    nfts={nfts}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    divWidth='100vw'
                    location='marketplace'
                    createNft={createNft}
                    setEditData={setEditData}
                />
            </div>
        </div>
    );
};

export default Marketplace;