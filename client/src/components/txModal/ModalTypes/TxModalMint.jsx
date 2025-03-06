import React, { useMemo } from "react";
import { Link } from 'react-router-dom';

import SolConnection from '../../Connection/SolConnection';
import TxModalHeader from "../components/TxModalHeader";

import { renderTxStateIcon, renderCreateStateIcon, renderCostSign } from "../renderStatus";
import { IS_MAINNET } from "../../../config/config";

import { useWallet } from "@solana/wallet-adapter-react";
import { useTransactionsController } from '../../../providers/TransactionsProvider';

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
        setRedirectSecret
    } = useTransactionsController();

    const wallet = useWallet();

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
                                <div className='tracker-container text-center d-flex flex-column' style={{ fontSize: '0.9rem' }}>
                                    <div>
                                        <strong>"{nameTracker}"</strong> has been successfully minted and sent to your wallet!
                                        <div className="mt-2">
                                            <Link
                                                to="#"
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevents default navigation
                                                    window.open('/docs', '_blank', 'noopener,noreferrer,width=800,height=600');
                                                }}
                                            >
                                                Need help seeing your NFT?
                                            </Link>
                                        </div>
                                        <div className="mt-1">You can track the transaction on Solscan below.</div>
                                    </div>
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

export default TxModalMint;
