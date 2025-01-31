import React, { useState } from "react";

import { useMarketplace } from '../../../context/MarketplaceProvider';
import TxModalHeader from "../components/TxModalHeader";

import { renderTxStateIcon } from "../../../Utils/renderStatus";

const TxModalDelete = ({ deleteMetadata }) => {
    const {
        txState,
        nameTracker,
    } = useMarketplace();

    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    return (
        <>
            {/* Close button */}
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
                            style={{ marginBottom: '5px' }}
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
                    <h5 style={{ margin: '0px' }}>[Item Deleted!]</h5>
                )}
            </div>
        </>
    );
};

export default TxModalDelete;
