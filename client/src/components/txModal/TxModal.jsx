import React, { useMemo } from "react";

import { Link } from 'react-router-dom'
import "../../Modal.css"; // Optional for styling

import { IS_MAINNET } from "../../config/config";

import BoohLogo from '../../assets/BoohCoinLogo.svg';

import { useMarketplace } from '../../context/MarketplaceProvider';

const TxModal = ({ resetConfirmModal, createNft }) => {

    const {
        isModalOpen, //stores main transaction modal state
        txState, //stores payment transaction state to handle UI render
        createState,
        preCalcPayment,
        paymentTracker,
        solPriceLoaded,
        transactionSig,
        redirectSecret,
        nameTracker,
    } = useMarketplace();

    //Solscanner depending on testnet or mainnet
    const solScanner = useMemo(() => {
        return IS_MAINNET
            ? `https://solscan.io/tx/${transactionSig}`
            : `https://solscan.io/tx/${transactionSig}?cluster=devnet`;
    }, [transactionSig]);

    const renderTxStateIcon = () => {
        switch (txState) {
            case 'empty':
                return <div className="tx-state-icon circle"></div>;
            case 'started':
                return <div className="loader"></div>;
            case 'complete':
                return <div className="tx-state-icon checkmark">✅</div>;
            case 'failed':
                return <div className="tx-state-icon red-x">❌</div>;
            default:
                return null;
        }
    };

    const rendercreateStateIcon = () => {
        switch (createState) {
            case 'empty':
                return <div className="tx-state-icon circle"></div>;
            case 'started':
                return <div className="loader"></div>;
            case 'complete':
                return <div className="tx-state-icon checkmark">✅</div>;
            case 'failed':
                return <div className="tx-state-icon red-x">❌</div>;
            default:
                return null;
        }
    };

    return (
        <div className={`modal-overlay ${isModalOpen ? "open" : ""}`}>
            <div className="modal-tx">

                <div className="d-flex justify-content-end">
                    {redirectSecret ? (
                        <a to='/marketplace'
                            className="modal-close-top-right" onClick={(e) => {
                                e.preventDefault(); // Prevent the default anchor behavior
                                resetConfirmModal(); // Call your modal reset function
                                window.location.href = '/marketplace'; // Refresh the page
                            }}>&times;
                        </a>
                    ) : (
                        <button className="modal-close-top-right" onClick={resetConfirmModal}>&times;</button>
                    )}
                </div>
                <div className='d-flex justify-content-center align-items-center gap-2' style={{ marginBottom: '10px' }}>
                    <img src={BoohLogo} style={{ width: '40px', height: '40px' }} />
                    <h2 className="modal-header marykate m-0" style={{ fontSize: '2rem' }}>Confirmation</h2>
                </div>
                <div className="modal-body">
                    <div className="tracker-container">
                        <div className="tracker-row">
                            <span className="tracker-label">NFT Name:</span>
                            <span className="tracker-value">{nameTracker}</span>
                        </div>
                        <div className="tracker-row">
                            <span className="tracker-label">Payment type:</span>
                            <span className="tracker-value">{paymentTracker}</span>
                        </div>
                        <div className="tracker-row">
                            <span className="tracker-label">Mint cost:</span>
                            {solPriceLoaded ? (<span className="tracker-value">{preCalcPayment}</span>) : (<div className='loader'></div>)}
                        </div>
                    </div>
                    <div className="loading-details">
                        <div className="d-flex gap-2 align-items-center">
                            {renderTxStateIcon()}
                            <h5 className="modal-title">Process Mint Cost</h5>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            {rendercreateStateIcon()}
                            <h5 className="modal-title">Create & Send NFT</h5>
                        </div>
                    </div>
                </div>
                {/* Confirm button at the bottom */}
                <div className='d-flex justify-content-center'>
                    {!transactionSig ? (
                        <div className="d-flex flex-column">
                            {redirectSecret && <div>[DO NOT LEAVE PAGE! NFT CREATION WILL FAIL]</div>}
                            {redirectSecret ? (<div className="button-style-regular">Creating...</div>) : (<button className="button-style-regular" onClick={() => createNft()}>Confirm</button>)}
                        </div>
                    ) : (
                        <Link className="button-style-regular" to={solScanner} target='_blank'>View Transaction</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TxModal;