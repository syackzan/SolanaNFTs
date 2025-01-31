import React, { useMemo, useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import "../../Modal.css"; // Ensure this CSS file exists

import { IS_MAINNET } from "../../config/config";
import BoohLogo from '../../assets/BoohLogo.svg';
import { useMarketplace } from '../../context/MarketplaceProvider';

const TxModalDelete = ({ resetConfirmModal, deleteMetadata }) => {
    const {
        isDeleteModalOpen,
        txState,
        transactionSig,
        nameTracker,
    } = useMarketplace();

    // Detect if mobile
    const isMobile = window.innerWidth <= 650;

    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Solscan URL for transaction tracking
    // const solScanner = useMemo(() => {
    //     return IS_MAINNET
    //         ? `https://solscan.io/tx/${transactionSig}`
    //         : `https://solscan.io/tx/${transactionSig}?cluster=devnet`;
    // }, [transactionSig]);

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

    return (
        <motion.div
            className={`modal-overlay ${isDeleteModalOpen ? "open" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isDeleteModalOpen ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="modal-tx"
                initial={isMobile ? { y: "100%" } : { scale: 0.95 }}
                animate={isDeleteModalOpen ? { y: 0, scale: 1 } : isMobile ? { y: "100%" } : { scale: 0.95 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
            >
                {/* Close button */}
                <div className="d-flex justify-content-end">
                    <button className="modal-close-top-right" onClick={resetConfirmModal}>&times;</button>
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
                    </div>
                    {/* Status Indicators */}
                    <div className="loading-details">
                        <div className="d-flex gap-2 align-items-center">
                            {renderTxStateIcon()}
                            <h5 className="modal-title">Deleting Object</h5>
                        </div>
                    </div>
                </div>

                {/* Confirm Button */}
                <div className="d-flex justify-content-center">
                    {txState !== 'complete' ? (
                        <div className="d-flex flex-column">
                            <p>Please type <strong>"DELETE"</strong> to confirm.</p>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="..."
                                className="form-control"
                                style={{marginBottom: '5px'}}
                            />
                            <button
                                className="button-style-regular"
                                onClick={deleteMetadata}
                                disabled={deleteConfirmText !== "DELETE"}
                            >
                                Delete
                            </button>
                        </div>
                    ) : (
                        <h5 style={{margin: '0px'}}>[Item Deleted]</h5>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TxModalDelete;
