import React, {useState} from 'react';

import { createCoreNft, createSendSolTx } from '../BlockchainInteractions/blockchainInteractions';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import PrintNfts from '../PrintNfts/PrintNfts';

import Filter from '../Filter/Filter';
import useNFTs from '../Hooks/useNFTs';

import TxModal from '../txModal/TxModal';

import { defaultMintCost } from '../../config/gameConfig';

import { useMarketplace } from '../../context/MarketplaceProvider';

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
    } = useNFTs({inStoreOnly: false, refetchNFTs});

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
        } = useMarketplace();

    const openModal = () => {
        
        setIsModalOpen(true);
        setNameTracker(nfts[selectedIndex].name);
        setPreCalcPayment(defaultMintCost);
        setSolPriceLoaded(true);
        setPaymentTracker('SOL');
    };

    const resetConfirmModal = () => {
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
        <div className="d-flex flex-column sidenav" style={{ backgroundColor: 'rgb(30, 30, 30)', height: 'calc(100vh - 60px)' }}>
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
                setIsFetched={setIsFetched}
            />
            <PrintNfts
                nfts={nfts}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                location='creator-hub'
                openModal={openModal}
                isAdmin={isAdmin}
                setEditData={setEditData}
            />
            {isModalOpen && <TxModal
                resetConfirmModal={resetConfirmModal}
                createNft={createNft}
            /> }
        </div>
    );
};


export default NFTUpdate;