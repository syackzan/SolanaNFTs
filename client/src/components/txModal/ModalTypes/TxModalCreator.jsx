import React, { useMemo } from "react";
import { Link } from 'react-router-dom';

import SolConnection from '../../Connection/SolConnection';
import TxModalHeader from "../components/TxModalHeader";

import { renderTxStateIcon, renderCreateStateIcon, renderCostSign } from "../renderStatus";

import { useWallet } from "@solana/wallet-adapter-react";
import { useTransactionsController } from '../../../providers/TransactionsProvider';
import { useGlobalVariables } from "../../../providers/GlobalVariablesProvider";

const TxModalCreator = ({ handleAddNftConcept }) => {

    const {setSearchItem} = useGlobalVariables();
    const {
        txState,
        createState,
        preCalcPayment,
        paymentTracker,
        solPriceLoaded,
        nameTracker,
        inGameSpend,
        setPage,
        simpleCloseModal
    } = useTransactionsController();

    const wallet = useWallet();

    const toEditPage = () => {
        setSearchItem(nameTracker);
        setPage('update');
        simpleCloseModal();
    }

    return (
        <>
            <TxModalHeader title={'Nft Concept'} disableSimpleClose={true}/>
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
                        <h5 className="modal-title">Processing Creator Cost</h5>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        {renderCreateStateIcon(createState)}
                        <h5 className="modal-title">Creating Nft Concept</h5>
                    </div>
                </div>
            </div>

            {/* Confirm Button */}
            <div className="d-flex justify-content-center">
                {wallet.publicKey ? (
                    <>
                        {createState !== 'complete' ? (
                            <div className="d-flex flex-column">
                                    <button className="button-style-regular" onClick={() => handleAddNftConcept()}>Confirm</button>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-2">
                                <div className='tracker-container marykate text-center d-flex flex-column' style={{ fontSize: '1.3rem' }}>
                                    <div>
                                        <strong>"{nameTracker}"</strong> has been generated!
                                    </div>
                                    <div>View your Nft Concepts on the Edit page below.</div>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <button className="button-style-regular" onClick={toEditPage} target="_blank">View Concepts</button>
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

export default TxModalCreator;
