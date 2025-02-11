import React from 'react';

import { motion } from "framer-motion"; // Import Framer Motion

import { useTransactionsController } from '../../providers/TransactionsProvider';

const TxModalWrapper  = ({children}) => {

    const {
        isModalOpen
    } = useTransactionsController();

    // Detect if mobile
    const isMobile = window.innerWidth <= 650;

    return(
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
                {children}
            </motion.div>
        </motion.div>
    )
}

export default TxModalWrapper;