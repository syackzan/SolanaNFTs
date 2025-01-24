import React, { useState, useEffect } from 'react';

import { createCoreNft, createSendSolTx } from '../BlockchainInteractions/blockchainInteractions';

import Navbar from '../Navbar/Navbar';
import PrintNfts from '../PrintNfts/PrintNfts';

import Filter from '../Filter/Filter';
import useNFTs from '../Hooks/useNFTs';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { priceToSol } from '../../Utils/Utils';

import TxModal from '../txModal/TxModal';

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

        const [isModalOpen, setIsModalOpen] = useState(false);
        const [txState, setTxState] = useState('empty'); //empty, started, complete, failed
        const [createState, setCreateState] = useState('empty'); //empty, started, complete, failed
        const [transactionSig, setTransactionSig] = useState(null);
        const [preCalcPayment, setPreCalcPayment] = useState(0);
        const [paymentTracker, setPaymentTracker] = useState('none');
        const [solPriceLoaded, setSolPriceLoaded] = useState(false);

        useEffect(() => {

            const setUpModalPricing = async () => {
                if(paymentTracker === 'SOL' && isModalOpen == true){

                    const mintCosts = 0.004; //Costs to mint an NFT
                    const priceInSol = await priceToSol(nfts[selectedIndex].storeInfo.price);
                    setPreCalcPayment(priceInSol, mintCosts); //Get Sol in USD per NFT price
                    setSolPriceLoaded(true);
                }
            }

            setUpModalPricing();

        }, [isModalOpen])
    
        const openModal = async () => {

            setIsModalOpen(true);

        };
    
        const closeModal = () => {
            setIsModalOpen(false);
            setTxState('empty');
            setCreateState('empty');
            setTransactionSig(null);
            setSolPriceLoaded(false);
        };

    const payWithSol = async () => {

        const transaction = await createSendSolTx(wallet.publicKey, preCalcPayment); //Built a sent sol Transaction
        const signature = await wallet.sendTransaction(transaction, connection); //Send the transaction
        console.log(`Transaction signature: ${signature}`);

        return signature; //Return sig

    }

    const payWithBabyBooh = async () => {

    }

    const payWithStripe = async () => {

    }

    const createNft = async () => {

        if (!wallet.publicKey) {
            alert("User must sign in!");
        }

        setTxState('started');

        let signature;
        console.log('createNft');
        try {

            if (paymentTracker === 'SOL') {
                signature = await payWithSol(); //Pay with sol
                setTxState('complete');
            }

            if (signature) { //If Sig is true, create and send NFT
                try {

                    setCreateState('started')

                    //TODO: HANDLE UI TRACKING OF PAYING WITH AND MINTING NFT
                    const resp = await createCoreNft(nfts[selectedIndex], wallet);
                    console.log(resp.data.serializedSignature);
                    setTransactionSig(resp.data.serializedSignature);

                    setCreateState('complete')
                } catch (e) {
                    alert('Failed to send Sol');
                    console.log('Failure to create NFT: ', e)
                    setCreateState('failed')
                    setTxState('failed');
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
                    createNft={openModal}
                    setEditData={setEditData}
                    setPaymentTracker={setPaymentTracker}
                />
            </div>
            <TxModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={nfts[selectedIndex]?.name || ''}
                mintCost={preCalcPayment}
                paymentType={paymentTracker}
                txState={txState}
                createState={createState}
                signature={transactionSig}
                createNft={createNft}
                solPriceLoaded={solPriceLoaded}
            />
        </div>
    );
};

export default Marketplace;