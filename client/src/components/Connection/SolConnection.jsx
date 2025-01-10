import React from 'react';

import {
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

import { useWallet } from '@solana/wallet-adapter-react'

const SolConnection = () => {

    const wallet = useWallet();

    return(
        <>
        {!wallet.connected ? <WalletMultiButton/> : <WalletDisconnectButton />}
        </>
    )
}

export default SolConnection;