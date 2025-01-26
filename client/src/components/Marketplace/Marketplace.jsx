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
import { deductBabyBooh } from '../../Utils/babyBooh';
import { createPaymentIntent } from '../../Utils/stripeInteractions';

import Stripe from '../Stripe/Stripe';

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
        const [stripeSecret, setStripeSecret] = useState(null);
        const [stripeModal, setStripeModal] = useState(false);

        useEffect(() => {
            const setUpModalPricing = async () => {
                if (!isModalOpen) return; // Exit early if modal is not open
        
                try {
                    if (paymentTracker === 'SOL') {
                        const mintCosts = 0.004; // Cost to mint an NFT
                        if (nfts[selectedIndex]?.storeInfo?.price) {
                            const priceInSol = await priceToSol(nfts[selectedIndex].storeInfo.price, mintCosts);
                            setPreCalcPayment(priceInSol); // Set SOL price in USD per NFT price
                            setSolPriceLoaded(true);
                        } else {
                            console.error("Invalid NFT data or selectedIndex for SOL payment.");
                        }
                    }
        
                    if (paymentTracker === 'BABYBOOH') {
                        // TODO: Implement conversion rate for BABY BOOH
                        console.warn("Conversion rate for BABY BOOH is not implemented yet.")
                    }
        
                    if (paymentTracker === 'CARD') {
                        if (nfts[selectedIndex]?.storeInfo?.price) {
                            const toNumber = Number(nfts[selectedIndex].storeInfo.price);
        
                            // Create a PaymentIntent
                            const data = await createPaymentIntent(toNumber);
                            if (data?.client_secret) {
                                setStripeSecret(data.client_secret);
                                setPreCalcPayment(toNumber);
                                setSolPriceLoaded(true); // Hard value already stored
                            } else {
                                console.error("Failed to retrieve client_secret from PaymentIntent.");
                            }
                        } else {
                            console.error("Invalid NFT data or selectedIndex for CARD payment.");
                        }
                    }
                } catch (error) {
                    console.error("Error setting up modal pricing:", error.message);
                }
            };
        
            setUpModalPricing();
        }, [isModalOpen]);
    
        const openModal = async () => {

            setIsModalOpen(true);

        };
    
        const resetConfirmModal = () => {
            setIsModalOpen(false);
            setTxState('empty');
            setCreateState('empty');
            setTransactionSig(null);
            setSolPriceLoaded(false);
            setClientSecret(null);
        };

    const payWithSol = async () => {

        const transaction = await createSendSolTx(wallet.publicKey, preCalcPayment); //Built a sent sol Transaction
        const signature = await wallet.sendTransaction(transaction, connection); //Send the transaction
        console.log(`Transaction signature: ${signature}`);

        return signature; //Return sig

    }

    const payWithBabyBooh = async () => {

        const success = deductBabyBooh(wallet.publicKey.toString(), preCalcPayment);
        return success;

    }

    const payWithCard = async () => {
        setStripeModal(true);
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

            if(paymentTracker === 'BABYBOOH'){
                signature = await payWithBabyBooh();
                setTxState('complete');
            }

            if(paymentTracker === 'CARD'){
                await payWithCard();
                setIsModalOpen(false);
                return //Different work flow with Card payments
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

            } else {
                alert('Payment Failed');
            }
        } catch (e) {
            console.log('Payment Type Failed', e);
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
                onClose={resetConfirmModal}
                title={nfts[selectedIndex]?.name || ''}
                mintCost={preCalcPayment}
                paymentType={paymentTracker}
                txState={txState}
                createState={createState}
                signature={transactionSig}
                createNft={createNft}
                solPriceLoaded={solPriceLoaded}
            />
            {stripeModal && <Stripe 
            clientSecret={stripeSecret} 
            setStripeModal={setStripeModal} 
            name={nfts[selectedIndex].name}  
            payment={preCalcPayment}
            resetConfirmModal={resetConfirmModal}/>}
        </div>
    );
};

export default Marketplace;