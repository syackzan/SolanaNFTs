import React, { useMemo } from "react";
import { Link } from 'react-router-dom';

import SolConnection from '../../Connection/SolConnection';
import TxModalHeader from "../components/TxModalHeader";

import { renderTxStateIcon, renderCreateStateIcon, renderCostSign } from "../renderStatus";
import { IS_MAINNET } from "../../../config/config";

import { useWallet } from "@solana/wallet-adapter-react";
import { useTransactionsController } from '../../../providers/TransactionsProvider';

const TxCreatorModal = ({ createNft }) => {
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
        setRedirectSecret
    } = useTransactionsController();

    const wallet = useWallet();

    return (
        <>
            <TxModalHeader />
            {/* Modal Body */}
            <div className="modal-body">
                <div className="tracker-container">
                    <div className="tracker-row"><span className="tracker-label">NFT Name:</span><span className="tracker-value">{nameTracker}</span></div>
                    <div className="tracker-row"><span className="tracker-label">Payment type:</span><span className="tracker-value">{paymentTracker}</span></div>
                    <div className="tracker-row">
                        <span className="tracker-label">Creator cost:</span>
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
                {wallet.publicKey ? (
                    <>
                        {!transactionSig ? (
                            <div className="d-flex flex-column">
                                {redirectSecret && <div className='center-text'>[DO NOT LEAVE PAGE! SENDING NFT!]</div>}
                                {redirectSecret ?
                                    (<div className="text-center">
                                        Generating...</div>) :
                                    (
                                    <button className="button-style-regular" onClick={() => createNft()}>Confirm</button>
                                    )}
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-2">
                                <div className='tracker-container marykate text-center d-flex flex-column' style={{ fontSize: '1.3rem' }}>
                                    <div>
                                        <strong>"{nameTracker}"</strong> has been sent to your wallet! Please open your wallet to confirm.
                                    </div>
                                    <div>View the transaction on Solscan below.</div>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <Link className="button-style-regular" to={solScanner} target="_blank">View Transaction</Link>
                                </div>
                            </div>

                        )}
                    </>
                ) : (
                    <SolConnection />
                )}
            </div>
        </>
    );
};

export default TxCreatorModal;
