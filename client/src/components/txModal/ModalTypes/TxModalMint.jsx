import React, { useMemo } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { Link } from 'react-router-dom';

import { IS_MAINNET } from "../../../config/config";
import { useMarketplace } from '../../../context/MarketplaceProvider';

import { renderTxStateIcon, renderCreateStateIcon, renderCostSign } from "../../../Utils/renderStatus";
import TxModalHeader from "../components/TxModalHeader";

const TxModalMint = ({ createNft }) => {
    const {
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

    // Solscan URL for transaction tracking
    const solScanner = useMemo(() => {
        return IS_MAINNET
            ? `https://solscan.io/tx/${transactionSig}`
            : `https://solscan.io/tx/${transactionSig}?cluster=devnet`;
    }, [transactionSig]);

    return (
        <>
            <TxModalHeader />
            {/* Modal Body */}
            <div className="modal-body">
                <div className="tracker-container">
                    <div className="tracker-row"><span className="tracker-label">NFT Name:</span><span className="tracker-value">{nameTracker}</span></div>
                    <div className="tracker-row"><span className="tracker-label">Payment type:</span><span className="tracker-value">{paymentTracker}</span></div>
                    <div className="tracker-row">
                        <span className="tracker-label">Mint cost:</span>
                        {solPriceLoaded ? (<span className="tracker-value">-{preCalcPayment} {renderCostSign(paymentTracker)}</span>) : (<div className='loader'></div>)}
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
                        {renderTxStateIcon(txState)}
                        <h5 className="modal-title">Process Mint Cost</h5>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        {renderCreateStateIcon(createState)}
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
        </>
    );
};

export default TxModalMint;
