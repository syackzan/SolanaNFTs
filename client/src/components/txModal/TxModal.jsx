import React, { useMemo  } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { Link } from 'react-router-dom';
import "../../Modal.css"; // Ensure this CSS file exists

import { IS_MAINNET } from "../../config/config";
import BoohLogo from '../../assets/BoohCoinLogo.svg';
import { useMarketplace } from '../../context/MarketplaceProvider';

const TxModal = ({ resetConfirmModal, createNft }) => {
    const {
        isModalOpen,
        txState,
        createState,
        preCalcPayment,
        paymentTracker,
        solPriceLoaded,
        transactionSig,
        redirectSecret,
        nameTracker,
        inGameSpend,
    } = useMarketplace();

    // Detect if mobile
    const isMobile = window.innerWidth <= 650;

    // Solscan URL for transaction tracking
    const solScanner = useMemo(() => {
        return IS_MAINNET
            ? `https://solscan.io/tx/${transactionSig}`
            : `https://solscan.io/tx/${transactionSig}?cluster=devnet`;
    }, [transactionSig]);

    // Function to handle closing and redirecting
    const handleClose = (e) => {
        e.preventDefault();
        resetConfirmModal();
        window.location.href = '/marketplace';
    };

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

    const renderCostSign = () => {
        let sign = ''; // Local variable to store the correct value
    
        switch (paymentTracker) {
            case 'CARD':
                sign = 'usd';
                break;
            case 'SOL':
            case 'BABYBOOH': // Both cases set sign to 'sol'
                sign = 'sol';
                break;
            default:
                sign = '';
                break;
        }
    
        return <>{sign}</>;
    };

    return (
        <motion.div
            className={`modal-overlay ${isModalOpen ? "open" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isModalOpen ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="modal-tx"
                initial={isMobile ? { y: "100%" } : { scale: 0.95 }}
                animate={isModalOpen ? { y: 0, scale: 1 } : isMobile ? { y: "100%" } : { scale: 0.95 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
            >
                {/* Close button */}
                <div className="d-flex justify-content-end">
                    {redirectSecret ? (
                        <a href="/marketplace" className="modal-close-top-right" onClick={handleClose}>&times;</a>
                    ) : (
                        <button className="modal-close-top-right" onClick={resetConfirmModal}>&times;</button>
                    )}
                </div>

                {/* Header */}
                <div className="d-flex justify-content-center align-items-center gap-2" style={{ marginBottom: '10px' }}>
                    <img src={BoohLogo} style={{ width: "40px", height: "40px" }} />
                    <h2 className="modal-header marykate m-0" style={{ fontSize: "2rem" }}>Confirmation</h2>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    <div className="tracker-container">
                        <div className="tracker-row"><span className="tracker-label">NFT Name:</span><span className="tracker-value">{nameTracker}</span></div>
                        <div className="tracker-row"><span className="tracker-label">Payment type:</span><span className="tracker-value">{paymentTracker}</span></div>
                        <div className="tracker-row">
                            <span className="tracker-label">Mint cost:</span>
                            {solPriceLoaded ? (<span className="tracker-value">-{preCalcPayment} {renderCostSign()}</span>) : (<div className='loader'></div>)}
                        </div>
                        {(inGameSpend >= 0 && paymentTracker === 'BABYBOOH') &&
                            <div className="tracker-row">
                                <span className="tracker-label">In Game Currency:</span>
                                <span className="tracker-value">-{inGameSpend}</span>
                            </div>}
                    </div>

                    {/* Status Indicators */}
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

                {/* Confirm Button */}
                <div className="d-flex justify-content-center">
                    {!transactionSig ? (
                        <div className="d-flex flex-column">
                            {redirectSecret && <div>[DO NOT LEAVE PAGE! NFT CREATION WILL FAIL]</div>}
                            {redirectSecret ? 
                            (<div className="button-style-regular">Creating...</div>) : 
                            (<button className="button-style-regular" onClick={() => createNft()}>Confirm</button>)}
                        </div>
                    ) : (
                        <Link className="button-style-regular" to={solScanner} target="_blank">View Transaction</Link>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TxModal;
