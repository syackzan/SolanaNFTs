import React, { useState, useEffect } from 'react';

import { createCoreNft, createSendSolTx } from '../BlockchainInteractions/blockchainInteractions';

import Navbar from '../Navbar/Navbar';
import PrintNfts from '../PrintNfts/PrintNfts';

import Filter from '../Filter/Filter';
import useNFTs from '../Hooks/useNFTs';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { priceToSol } from '../../Utils/Utils';

import TxModalManager from '../txModal/TxModalManager'
import { deductBabyBooh } from '../../Utils/babyBooh';
import { createPaymentIntent } from '../../Utils/stripeInteractions';

import Stripe from '../Stripe/Stripe';

import { useParams } from 'react-router-dom';
import { fetchSingleNftMetadata } from '../../Utils/backendCalls';

import { PublicKey } from '@solana/web3.js';

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
        inGameSpend,
        setInGameSpend
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

            const mintCosts = 0.004; // Cost to mint an NFT

            try {
                switch (paymentTracker) {
                    case 'SOL':
                        if (nfts[selectedIndex]?.storeInfo?.price) {
                            const priceInSol = await priceToSol(nfts[selectedIndex].storeInfo.price, mintCosts);
                            setPreCalcPayment(priceInSol.toFixed(4)); // Set SOL price in USD per NFT price
                            setSolPriceLoaded(true);
                        } else {
                            console.error("Invalid NFT data or selectedIndex for SOL payment.");
                        }
                        break;

                    case 'BABYBOOH':
                        console.log('In Baby Booh');
                        // TODO: Implement conversion rate for BABY BOOH
                        setPreCalcPayment(mintCosts);
                        setSolPriceLoaded(true);
                        setInGameSpend(5);
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

    const payWithSol = async () => {

        try {
            const transaction = await createSendSolTx(wallet.publicKey, preCalcPayment); //Built a sent sol Transaction
            const signature = await wallet.sendTransaction(transaction, connection); //Send the transaction
            console.log(`Transaction signature: ${signature}`);
            return signature; //Return sig

        } catch (e) {
            setTxState('failed');
            console.log(e);
            return false;
        }

        
    }

    const payWithBabyBooh = async () => {

        try{
            const success = await deductBabyBooh(wallet.publicKey.toString(), inGameSpend);
            return success;
        }catch(e){
            console.log(e);
            setTxState('failed');
            return false;
        }
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

                signature = await payWithSol(); //First send Sol Transaction

                if (signature) {
                    signature = await payWithBabyBooh(); //Then pay Booh Amount
                }
                
                if(signature){
                    setTxState('complete');
                }  
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
            const success = await handleNFTCreation(nftToCreate, walletConstruct);

            if(!success){
                setCreateState('failed');
                return;
            }

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

            return resp.data.serializedSignature;
        } catch (error) {
            // Handle and log errors during the NFT creation process
            console.error("Error during NFT creation:", error);
            // Optionally: Add error handling logic (e.g., show a message to the user)
            return false;
        }
    };

    const setEditData = () => { }

    return (
        <div style={{ height: 'calc(100vh-60px)', marginTop: '60px', width: '100vw' }}>
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

                    location='marketplace'
                    openModal={openModal}
                    setEditData={setEditData}
                    setPaymentTracker={setPaymentTracker}
                />
            </div>
            {isModalOpen && <TxModalManager
                createNft={createNft}
            />}
            {(stripeSecret || redirectSecret) && (
                <Stripe
                    nft={nfts[selectedIndex]}
                    handleSuccessfulStripePayment={handleSuccessfulStripePayment}
                />
            )}
        </div>
    );
};

export default Marketplace;