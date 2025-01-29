import React, { createContext, useContext, useState } from 'react';

// Create Context
const MarketplaceContext = createContext();

// Provider Component
export const MarketplaceProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [txState, setTxState] = useState('empty');
    const [createState, setCreateState] = useState('empty');
    const [transactionSig, setTransactionSig] = useState(null);
    const [preCalcPayment, setPreCalcPayment] = useState(0);
    const [paymentTracker, setPaymentTracker] = useState('none');
    const [solPriceLoaded, setSolPriceLoaded] = useState(false);
    const [stripeSecret, setStripeSecret] = useState(null);
    const [stripeModal, setStripeModal] = useState(false);
    const [redirectSecret, setRedirectSecret] = useState('');
    const [nameTracker, setNameTracker] = useState('');
    const [inGameSpend, setInGameSpend] = useState(null);

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
                setInGameSpend
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