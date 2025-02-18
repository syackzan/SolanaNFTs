import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

import { useTransactionsController } from '../../providers/TransactionsProvider';

import { isSolanaWalletApp } from '../../Utils/generalUtils';

import { shortenAddress } from '../../Utils/generalUtils';

const SolConnection = () => {

    const walletModal = useWalletModal(); // Wallet modal hook
    const { publicKey, connected, disconnect } = useWallet(); // Wallet hook

    const [selectedAddress, setSelectedAddress] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

    const {setIsModalOpen, setModalType} = useTransactionsController();

    const isWalletApp = isSolanaWalletApp();

    // Update the selected address whenever the wallet connection changes
    useEffect(() => {
        if (publicKey) {
            setSelectedAddress(publicKey.toString());
        } else {
            setSelectedAddress('');
        }
    }, [publicKey, connected]);

    // Function to handle wallet connection or disconnection
    const connectWallet = async (blockchain) => {
        if (blockchain === 'sol') {
            if (!publicKey) {
                try {
                    console.log('Trying to connect...');
                    
                    // On desktop, just open the modal normally
                    walletModal.setVisible(true);
                    
                } catch (e) {
                    console.error('Failed to open wallet modal:', e);
                }
            } else {
                try {
                    await disconnect(); // Disconnect the wallet
                } catch (e) {
                    console.error('Failed to disconnect wallet:', e);
                }
            }
        }
    };

    const connectOrDisconnect = () => {
        if (connected) {
            // disconnect(); // Disconnect if already connected
            setIsModalOpen(true);
            setModalType('disconnect');
        } else {

            if(isMobile && !isWalletApp){
                setIsModalOpen(true);
                setModalType('appRedirect');
            } else {
                connectWallet('sol'); // Attempt to connect
            }
        }
    };

    return (
        <button
            className={`${connected ? 'disconnect-button' : 'login-nav-button'}`}
            onClick={connectOrDisconnect}
        >
            {connected ? shortenAddress(selectedAddress, 4) : 'CONNECT WALLET'}
        </button>
    );
};

export default SolConnection;
