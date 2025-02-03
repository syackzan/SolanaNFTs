import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

import { useMarketplace } from '../../context/MarketplaceProvider';

const SolConnection = () => {
    const walletModal = useWalletModal(); // Wallet modal hook
    const { publicKey, connected, disconnect } = useWallet(); // Wallet hook

    const [selectedAddress, setSelectedAddress] = useState('');

    const {setIsModalOpen, setModalType} = useMarketplace();

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

    // Function to shorten long wallet addresses
    const shortenAddress = (address, chars = 4) => {
        if (!address) return '';
        return `${address.slice(0, chars)}...${address.slice(-chars)}`;
    };

    const connectOrDisconnect = () => {
        if (connected) {
            // disconnect(); // Disconnect if already connected
            setIsModalOpen(true);
            setModalType('disconnect');
        } else {
            connectWallet('sol'); // Attempt to connect
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
