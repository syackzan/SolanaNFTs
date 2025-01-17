import React, { useState } from 'react';

import { createCoreNft, createSendSolTx } from '../BlockchainInteractions/blockchainInteractions';

import Navbar from '../Navbar/Navbar';
import PrintNfts from '../PrintNfts/PrintNfts';

import Filter from '../Filter/Filter';
import useNFTs from '../Hooks/useNFTs';

const Marketplace = () => {

    // const [selectedIndex, setSelectedIndex] = useState(null); // Track the selected button

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
    } = useNFTs({inStoreOnly: true});

    const SOL_TO_USD = 200;

    const createNft = async (paymentType) => {

        if (!wallet.publicKey) {
            alert("User must sign in!");
        }

        const payment = paymentType === "SOL" ? (nfts[selectedIndex].storeInfo.price / SOL_TO_USD) : 0;

        try {
            const transaction = await createSendSolTx(wallet.publicKey, payment);
            const signature = await wallet.sendTransaction(transaction, connection);
            console.log(`Transaction signature: ${signature}`);

            if (signature) {
                try {
                    await createCoreNft(nfts[selectedIndex], wallet);
                } catch (e) {
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
        <>
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
        </>
    );
};

export default Marketplace;