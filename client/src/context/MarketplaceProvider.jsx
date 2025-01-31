import React, { createContext, useContext, useState } from 'react';

// Create Context
const MarketplaceContext = createContext();

// Provider Component
export const MarketplaceProvider = ({ children }) => {
    
    //MODAL CONTROLLERS
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);

    //STATE UI CONTROLLERS
    const [txState, setTxState] = useState('empty'); // 'empty', 'started', 'complete', 'failed'
    const [createState, setCreateState] = useState('empty');

    //TRANSACTION SIG CONTROLLER
    const [transactionSig, setTransactionSig] = useState(null);

    //PAYMENT & PRICE CONTROLLERS
    const [preCalcPayment, setPreCalcPayment] = useState(0);
    const [paymentTracker, setPaymentTracker] = useState('none');
    const [solPriceLoaded, setSolPriceLoaded] = useState(false);
    const [inGameSpend, setInGameSpend] = useState(null);

    //STRIPE CONTROLLERS
    const [stripeSecret, setStripeSecret] = useState(null);
    const [stripeModal, setStripeModal] = useState(false);
    const [redirectSecret, setRedirectSecret] = useState('');

    //RENDER INFO CONTROLLER
    const [nameTracker, setNameTracker] = useState('');

    return (
        <MarketplaceContext.Provider
            value={{
                isModalOpen,
                setIsModalOpen,
                txState,
                setTxState,
                createState,
                setCreateState,
                transactionSig,
                setTransactionSig,
                preCalcPayment,
                setPreCalcPayment,
                paymentTracker,
                setPaymentTracker,
                solPriceLoaded,
                setSolPriceLoaded,
                stripeSecret,
                setStripeSecret,
                stripeModal,
                setStripeModal,
                redirectSecret,
                setRedirectSecret,
                nameTracker,
                setNameTracker,
                inGameSpend,
                setInGameSpend,
                isDeleteModalOpen,
                setIsDeleteModalOpen,
                isLockModalOpen,
                setIsLockModalOpen
            }}
        >
            {children}
        </MarketplaceContext.Provider>
    );
};

// Custom Hook for Consuming Context
export const useMarketplace = () => {
    return useContext(MarketplaceContext);
};