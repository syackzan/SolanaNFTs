import React, {useMemo} from "react";

import {Link} from 'react-router-dom'
import "../../Modal.css"; // Optional for styling

import { IS_MAINNET } from "../../config/config";

import BoohLogo from '../../assets/BoohCoinLogo.svg';

const TxModal = ({ isOpen, onClose, title, mintCost, paymentType, txState, createState, signature, createNft, solPriceLoaded }) => {
    if (!isOpen) return null;

    console.log("title", title);

    //Solscanner depending on testnet or mainnet
    const solScanner = useMemo(() => {
        return IS_MAINNET
            ? `https://solscan.io/tx/${signature}`
            : `https://solscan.io/tx/${signature}?cluster=devnet`;
    }, [signature]);

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
        <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
            <div className="modal-tx">
                
                <div className="d-flex justify-content-end">
                    <button className="modal-close-top-right" onClick={onClose}>&times;</button>
                </div>

                <div className='d-flex justify-content-center align-items-center gap-2' style={{marginBottom: '10px'}}>
                    <img src={BoohLogo} style={{width: '40px', height: '40px'}} />
                    <h2 className="modal-header marykate m-0" style={{ fontSize: '2rem' }}>Confirmation</h2>
                </div>
                <div className="modal-body">
                    <div className="tracker-container">
                        <div className="tracker-row">
                            <span className="tracker-label">NFT Name:</span>
                            <span className="tracker-value">{title}</span>
                        </div>
                        <div className="tracker-row">
                            <span className="tracker-label">Payment type:</span>
                            <span className="tracker-value">{paymentType}</span>
                        </div>
                        <div className="tracker-row">
                            <span className="tracker-label">Mint cost:</span>
                            {solPriceLoaded ? (<span className="tracker-value">{mintCost}</span>) : (<div className='loader'></div>)}
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
                    {!signature ? (
                        <button className="button-style-regular" onClick={() => createNft()}>Confirm</button>
                    ) : (
                        <Link className="button-style-regular" to={solScanner} target='_blank'>View Transaction</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TxModal;