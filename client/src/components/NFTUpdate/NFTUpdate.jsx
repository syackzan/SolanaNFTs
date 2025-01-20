import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

import { createCoreNft, createSendSolTx } from '../BlockchainInteractions/blockchainInteractions';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import PrintNfts from '../PrintNfts/PrintNfts';

import Filter from '../Filter/Filter';
import useNFTs from '../Hooks/useNFTs';

const NFTUpdate = ({ setInfo, setAttributes, setProperties, setStoreInfo, refetchNFTs, userRole, wallet }) => {

    const { publicKey, sendTransaction } = useWallet();
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
    } = useNFTs({inStoreOnly: false});

    const setEditData = async (nft) => {
        console.log(nft);

        const infoToUpdate = {
            name: nft.name,
            description: nft.description,
            external_link: nft.external_link,
            image: nft.image,
            symbol: nft.symbol,
            _id: nft._id,
            _v: nft._v
        }
        setInfo(infoToUpdate);
        setProperties(nft.properties);
        setAttributes(nft.attributes);
        setStoreInfo(nft.storeInfo);
    }


    const isAdmin = userRole === "admin";

    const createNft = async () => {

        if (!publicKey) {
            alert("User must sign in!");
        }

        await createCoreNft(nfts[selectedIndex], wallet);
        return;

        try {
            const transaction = await createSendSolTx(publicKey);
            const signature = await sendTransaction(transaction, connection);
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

    return (
        <div className="d-flex flex-column" style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
            <Filter
                title={"CREATOR HUB"}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedSubType={selectedSubType}
                setSelectedSubType={setSelectedSubType}
                selectedRarity={selectedRarity}
                setSelectedRarity={setSelectedRarity}
                selectedCreator={selectedCreator}
                setSelectedCreator={setSelectedCreator}
                setIsFetched={setIsFetched}
            />
            <PrintNfts
                nfts={nfts}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                location='creator-hub'
                createNft={createNft}
                isAdmin={isAdmin}
                setEditData={setEditData}
            />
        </div>
    );
};


export default NFTUpdate;