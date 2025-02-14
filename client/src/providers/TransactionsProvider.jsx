import React, { createContext, useContext, useState } from 'react';

// Create Context
const TransactionsContext = createContext();

// Provider Component
export const TransactionProvider = ({ children }) => {

    //Modal Type
    const [modalType, setModalType] = useState(''); //mint, create, lock, delete

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

    //TRACK UPLOADED IMAGES NAME
    const [imageName, setImageName] = useState('');

    //MANAGES PAGE SWITCH BETWEEN CREATE & EDIT
    const [page, setPage] = useState(null);

    const resetTxModal = () => {
        setIsModalOpen(false);
        reloadStates();
        setTransactionSig(null);
        setSolPriceLoaded(false);
        setStripeSecret(null);
        setInGameSpend(null);
    };

    const loadTxModal = (type, name = 'unknown', payment = 0, paymentType =  'none', isPriceLoaded = false ) => {
        setIsModalOpen(true);
        setModalType(type);
        setNameTracker(name);
        setPreCalcPayment(payment);
        setSolPriceLoaded(isPriceLoaded);
        setPaymentTracker(paymentType);
    }

    const reloadStates = () =>{
        setTxState('empty');
        setCreateState('empty');
    }

    const simpleCloseModal = () => {
        reloadStates();
        setIsModalOpen(false);
        setModalType('');
    }

    return (
        <TransactionsContext.Provider
            value={{
                modalType,
                setModalType,
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
                setIsLockModalOpen,
                resetTxModal,
                imageName,
                setImageName,
                page,
                setPage,
                loadTxModal,
                simpleCloseModal
            }}
        >
            {children}
        </TransactionsContext.Provider>
    );
};

// Custom Hook for Consuming Context
export const useTransactionsController = () => {
    return useContext(TransactionsContext);
};