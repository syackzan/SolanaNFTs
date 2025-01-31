import React from "react";
import { Link } from 'react-router-dom';

import { IS_MAINNET } from "../../../config/config";

import { useMarketplace } from '../../../context/MarketplaceProvider';
import TxModalHeader from "../components/TxModalHeader";

import { renderTxStateIcon, renderCreateStateIcon } from "../../../Utils/renderStatus";

const TxModalLockData = ({ createOffchainMetadata }) => {
    const {
        txState,
        createState,
        transactionSig,
        nameTracker,
    } = useMarketplace();

    return (
        <>
            {/* TX Header */}
            <TxModalHeader />

            {/* Modal Body */}
            <div className="modal-body">
                <div className="tracker-container">
                    <div className="tracker-row"><span className="tracker-label">NFT Name:</span><span className="tracker-value">{nameTracker}</span></div>
                </div>
                {/* Status Indicators */}
                <div className="loading-details">
                    <div className="d-flex gap-2 align-items-center">
                        {renderTxStateIcon(txState)}
                        <h5 className="modal-title">Create OffChain Data</h5>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        {renderCreateStateIcon(createState)}
                        <h5 className="modal-title">Update Database</h5>
                    </div>
                </div>
            </div>

            {/* Confirm Button */}
            <div className="d-flex justify-content-center">
                {!transactionSig ? (
                    <div className="d-flex flex-column">
                        <button className="button-style-regular"
                            onClick={() => createOffchainMetadata()}
                            disabled={txState === 'started' || createState === 'started'}>
                            Confirm
                        </button>
                    </div>
                ) : (
                    <Link className="button-style-regular" to={transactionSig} target="_blank">View Off Chain Data</Link>
                )}
            </div>
        </>
    );
};

export default TxModalLockData;
