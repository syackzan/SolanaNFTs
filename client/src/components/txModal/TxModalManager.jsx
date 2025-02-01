import React from 'react';

import { useMarketplace } from '../../context/MarketplaceProvider';

import TxModalWrapper from './TxModalWrapper';

import TxModalMint from './ModalTypes/TxModalMint';
import TxModalDelete from './ModalTypes/TxModalDelete';
import TxModalLockData from './ModalTypes/TxModalLockData';

import "../../Modal.css"; // Ensure this CSS file exists
import TxModalUploadImage from './ModalTypes/TxModalUploadImage';

const ModalManager = ({  createNft, createOffchainMetadata, deleteMetadata, handleImageChange }) => {
    
    const {
        modalType
    } = useMarketplace();

    const renderModalContent = () => {

        console.log(modalType);

        switch (modalType) {
            case "mint":
                return <TxModalMint createNft={createNft} />;
            case "delete":
                return <TxModalDelete deleteMetadata={deleteMetadata} />;
            case "lock":
                return <TxModalLockData createOffchainMetadata={createOffchainMetadata} />;
            case "image":
                return <TxModalUploadImage handleImageChange={handleImageChange} />
            default:
                return <TxModalMint createNft={createNft} />; //Default for Stripe Redirect
        }
    };

    return <TxModalWrapper>{renderModalContent()}</TxModalWrapper>;
};

export default ModalManager;