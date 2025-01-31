import React from 'react';

import { useMarketplace } from '../../context/MarketplaceProvider';

import TxModalWrapper from './TxModalWrapper';

import TxModalMint from './ModalTypes/TxModalMint';
import TxModalDelete from './ModalTypes/TxModalDelete';
import TxModalLockData from './ModalTypes/TxModalLockData';

import "../../Modal.css"; // Ensure this CSS file exists

const ModalManager = ({  resetConfirmModal, createNft, createOffchainMetadata, deleteMetadata }) => {
    
    const {
        modalType
    } = useMarketplace();

    const renderModalContent = () => {

        console.log(modalType);

        switch (modalType) {
            case "mint":
                return <TxModalMint resetConfirmModal={resetConfirmModal} createNft={createNft} />;
            case "delete":
                return <TxModalDelete resetConfirmModal={resetConfirmModal} deleteMetadata={deleteMetadata} />;
            case "lock":
                return <TxModalLockData resetConfirmModal={resetConfirmModal} createOffchainMetadata={createOffchainMetadata} />;
            default:
                return <TxModal createNft={createNft} />; //Default for Stripe Redirect
        }
    };

    return <TxModalWrapper>{renderModalContent()}</TxModalWrapper>;
};

export default ModalManager;