import React from 'react';
import TxModalManager from './TxModalManager';

import { useTransactionsController } from '../../providers/TransactionsProvider';

const TxModal = () => {

    const {
            isModalOpen
        } = useTransactionsController();

    return(
        <>
        {isModalOpen && <TxModalManager />}
        </>
    )
}

export default TxModal;