import React from "react";
import "../../Modal.css"; // Optional for styling

const TxModal = ({ isOpen, onClose, title, content, txState, createState }) => {
    if (!isOpen) return null;

    console.log("title", title);

    return (
        <div className="modal-overlay">
            <div className="modal-tx">
                <h2>Confirmation</h2>
                <div>Nft: </div>
                <div>Mint cost: </div>
                <div>Payment type: </div>
                <div className="d-flex gap-2 align-items-center">
                    <div className='loader'></div>
                    <h3 className="modal-title">Send Tx</h3>
                </div>
                
                <h3 className="modal-title">Create & Send NFT</h3>
                <div className="modal-content">{content}</div>
                <button className="modal-close" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default TxModal;