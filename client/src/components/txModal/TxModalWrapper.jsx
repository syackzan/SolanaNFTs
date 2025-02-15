import React from 'react';
import { motion } from "framer-motion"; // Import Framer Motion
import { useTransactionsController } from '../../providers/TransactionsProvider';

const TxModalWrapper  = ({ children }) => {
    const { isModalOpen } = useTransactionsController();

    // Detect if mobile
    const isMobile = window.innerWidth <= 650;

    return (
        <>
            {isModalOpen && ( // ⬅️ Only render when open to avoid visual flickering
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="modal-tx"
                        initial={isMobile ? { y: "100%" } : { scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={isMobile ? { y: "100%" } : { scale: 0.95 }}
                        transition={{
                            duration: 0.2, // ⏩ Controls how fast the animation is
                            ease: "easeOut" // 🔥 Ensures a smooth motion without bounces
                        }}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};

export default TxModalWrapper;