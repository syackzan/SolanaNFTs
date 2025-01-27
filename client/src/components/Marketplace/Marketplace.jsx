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

import { useParams } from 'react-router-dom';
import { fetchSingleNftMetadata } from '../../Utils/backendCalls';

import {PublicKey} from '@solana/web3.js';

import { useMarketplace } from '../../context/MarketplaceProvider';

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

    const {
        isModalOpen, //stores main transaction modal state
        setIsModalOpen, //updates main transaction state
        setTxState, //updates payment transaction state to handle UI render
        setCreateState,
        setTransactionSig,
        preCalcPayment,
        setPreCalcPayment,
        paymentTracker,
        setPaymentTracker,
        setSolPriceLoaded,
        stripeSecret,
        setStripeSecret,
        setStripeModal,
        redirectSecret,
        setRedirectSecret,
        setNameTracker,
    } = useMarketplace();
    

    //Handle Stripe re-direction & confirmed payment
    const { id, redirectAddress } = useParams();

    useEffect(() => {
        // Retrieve the "payment_intent_client_secret" query parameter appended to
        // your return_url by Stripe.js
        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );

        if (clientSecret) {
            console.log(clientSecret);
            setRedirectSecret(clientSecret);
        }
    }, []);

    useEffect(() => {
        const setUpModalPricing = async () => {
            if (!isModalOpen) return; // Exit early if modal is not open
            if (selectedIndex === null) return;
    
            setNameTracker(nfts[selectedIndex].name);
    
            try {
                switch (paymentTracker) {
                    case 'SOL':
                        const mintCosts = 0.004; // Cost to mint an NFT
                        if (nfts[selectedIndex]?.storeInfo?.price) {
                            const priceInSol = await priceToSol(nfts[selectedIndex].storeInfo.price, mintCosts);
                            setPreCalcPayment(priceInSol); // Set SOL price in USD per NFT price
                            setSolPriceLoaded(true);
                        } else {
                            console.error("Invalid NFT data or selectedIndex for SOL payment.");
                        }
                        break;
    
                    case 'BABYBOOH':
                        // TODO: Implement conversion rate for BABY BOOH
                        console.warn("Conversion rate for BABY BOOH is not implemented yet.");
                        break;
    
                    case 'CARD':
                        if (nfts[selectedIndex]?.storeInfo?.price) {
                            const toNumber = Number(nfts[selectedIndex].storeInfo.price);
    
                            // Create a PaymentIntent
                            const data = await createPaymentIntent(toNumber, nfts[selectedIndex]._id, wallet.publicKey.toString());
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
                        break;
    
                    default:
                        console.warn("Unhandled payment method:", paymentTracker);
                        break;
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
        setStripeSecret(null);
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

            if (paymentTracker === 'BABYBOOH') {
                signature = await payWithBabyBooh();
                setTxState('complete');
            }

            if (paymentTracker === 'CARD') {
                await payWithCard();
                setIsModalOpen(false);
                return //Different work flow with Card payments
            }

            if (signature) { //If Sig is true, create and send NFT
                try {

                    setCreateState('started');

                    //TODO: HANDLE UI TRACKING OF PAYING WITH AND MINTING NFT
                    await handleNFTCreation(nfts[selectedIndex], wallet);

                    setCreateState('complete');
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

    const handleSuccessfulStripePayment = async () => {
        try {
            // Open modal and initialize states for transaction and creation process
            setIsModalOpen(true); // Open the modal to indicate payment success
            setTxState('complete'); // Mark the transaction as complete
            setCreateState('started'); // Begin the NFT creation process
            setSolPriceLoaded(true); // Indicate that the Solana price has been successfully loaded
            setPaymentTracker('CARD'); // Set the payment method to "Card"
    
            // Fetch the NFT metadata using the provided ID
            const nftToCreate = await fetchSingleNftMetadata(id);
    
            // Update state with NFT details
            setPreCalcPayment(nftToCreate.storeInfo.price); // Set the payment amount for the NFT
            setNameTracker(nftToCreate.name); // Set the NFT's name in the tracker
    
            // Construct a wallet object using the redirect address
            let walletConstruct = {
                publicKey: new PublicKey(redirectAddress),
            };
    
            // Handle the NFT creation process
            await handleNFTCreation(nftToCreate, walletConstruct);
    
            // Mark the creation process as complete
            setCreateState('complete');
        } catch (error) {
            console.error("Error in handleSuccessfulStripePayment:", error);
            // Optionally add error handling here (e.g., show an error message to the user)
        }
    };

    const handleNFTCreation = async (nft, wallet) => {
        try {
            // Ensure NFT and wallet are provided
            if (!nft || !wallet) {
                console.error("Invalid NFT or wallet data provided.");
                return; // Exit early if required data is missing
            }
    
            // Call the function to create the NFT on the blockchain
            const resp = await createCoreNft(nft, wallet);
    
            // Log the serialized transaction signature (useful for debugging)
            console.log("Serialized Transaction Signature:", resp.data.serializedSignature);
    
            // Update state with the transaction signature
            setTransactionSig(resp.data.serializedSignature);
        } catch (error) {
            // Handle and log errors during the NFT creation process
            console.error("Error during NFT creation:", error);
            // Optionally: Add error handling logic (e.g., show a message to the user)
        }
    };

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
                    openModal={openModal}
                    setEditData={setEditData}
                    setPaymentTracker={setPaymentTracker}
                />
            </div>
            {isModalOpen && <TxModal
                resetConfirmModal={resetConfirmModal}
                createNft={createNft}
            />}
            {(stripeSecret || redirectSecret) && (
                <Stripe
                    nft={nfts[selectedIndex]}
                    resetConfirmModal={resetConfirmModal}
                    handleSuccessfulStripePayment={handleSuccessfulStripePayment}
                />
            )}
        </div>
    );
};

export default Marketplace;