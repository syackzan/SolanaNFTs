import React, { useState } from 'react';

import { createCoreNft, createSendSolTx } from '../../services/blockchainServices';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import PrintNfts from '../PrintNfts/PrintNfts';

import Filter from '../Filter/Filter';
import { useNFTs } from '../../hooks/useNFTs';

import { defaultMintCost } from '../../config/gameConfig';

import { useTransactionsController } from '../../providers/TransactionsProvider';

import MobileDetailsButton from '../MobileDetailsButton/MobileDetailsButton';
import TxModalManager from '../txModal/TxModalManager';

const NFTUpdate = ({ setInfo, setAttributes, setProperties, setStoreInfo, userRole, wallet, createOffchainMetadata, handleDeleteNftConcept }) => {

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
        nftConceptsLoadingState
    } = useNFTs({ inStoreOnly: false });

    const {
        isModalOpen, //stores main transaction modal state
        setIsModalOpen, //updates main transaction state
        setTxState, //updates payment transaction state to handle UI render
        setCreateState,
        setTransactionSig,
        setPreCalcPayment,
        setPaymentTracker,
        setSolPriceLoaded,
        setNameTracker,
        setModalType
    } = useTransactionsController();

    const openModal = () => {
        setIsModalOpen(true);
        setModalType('mint');
        setNameTracker(nfts[selectedIndex].name);
        setPreCalcPayment(defaultMintCost);
        setSolPriceLoaded(true);
        setPaymentTracker('SOL');
    };

    const resetConfirmModal = () => {
        console.log("Reset");
        setIsModalOpen(false);
        setTxState('empty');
        setCreateState('empty');
        setTransactionSig(null);
    };

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
        setNameTracker(nft.name);
    }


    const isAdmin = userRole === "admin";

    const createNft = async () => {

        if (!publicKey) {
            alert("User must sign in!");
        }

        setTxState('started');

        try {

            const transaction = await createSendSolTx(publicKey, defaultMintCost);
            const signature = await sendTransaction(transaction, connection);
            console.log(`Transaction signature: ${signature}`);

            setTxState('complete');

            if (signature) {
                try {

                    setCreateState('started')

                    const resp = await createCoreNft(nfts[selectedIndex], wallet);
                    console.log(resp.data.serializedSignature);
                    setTransactionSig(resp.data.serializedSignature);

                    setCreateState('complete')
                } catch (e) {
                    console.log('Failure to create NFT: ', e)
                    setCreateState('failed')
                }

            }
        } catch (e) {
            console.log('Failure to transfer Sol', e);
            setTxState('failed');
        }

        return;
    }

    return (
        <div className="print-nfts-styling sidenav-scrollbar" style={{ height: 'calc(100vh - 60px)' }}>
            {/* <button onClick={() => openModal()}>Open</button> */}
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
                filterByCreator={true}
            />
            <PrintNfts
                nfts={nfts}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                location='creator-hub'
                openModal={openModal}
                isAdmin={isAdmin}
                setEditData={setEditData}
                createOffchainMetadata={createOffchainMetadata}
                nftConceptsLoadingState={nftConceptsLoadingState}
            />
            {isModalOpen && <TxModalManager
                resetConfirmModal={resetConfirmModal}
                createNft={createNft}
                createOffchainMetadata={createOffchainMetadata}
                handleDeleteNftConcept={handleDeleteNftConcept}
                
            />}
            <MobileDetailsButton />
        </div>
    );
};


export default NFTUpdate;