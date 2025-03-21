import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';

import { useWallet } from '@solana/wallet-adapter-react';
import SolConnection from '../Connection/SolConnection';

import { shortenAddress } from '../../Utils/generalUtils';

import '../../css/whitelist.css';
import { getWhitelistAddresses, submitWhitelistAddress } from '../../services/dbServices';
import TxModal from '../txModal/TxModal';

const Whitelist = () => {

    const wallet = useWallet();

    const isMobile = window.innerWidth < 768;

    const [response, setResponse] = useState(''); //Tracks Whitelist submissions
    const [remainingSpots, setRemainingSpots] = useState('') //Remaing whitelist spots left

    useEffect(() => {
        const fetchValue = async () => {
          try {
            const data = await getWhitelistAddresses();

            const signedUp = data.whitelistAddresses.length;
            setRemainingSpots(30 - signedUp); // Assuming { number: 42 }
          } catch (err) {
            console.error('Failed to fetch number:', err);
          }
        };
    
        fetchValue();
      }, []); // empty dependency array = only run once on mount

    const displayString = () => {
        if (isMobile) {
            return (shortenAddress(wallet.publicKey.toString()));
        } else {
            return (wallet.publicKey.toString());
        }
    }

    const addToWhitelist = async () => {
        const data = await submitWhitelistAddress(wallet.publicKey.toString());

        if(data.error){
            setResponse(data.error)
        } else {
            setResponse("Wallet Added");
        }
    }

    return (
        <>
            <Navbar />
            <div style={{ width: '100vw', height: '100vh', color: 'white' }}>
                <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '100%' }}>
                    <div >
                        <h1 className="marykate d-flex justify-content-center m-0">NFT WHITELIST</h1>
                        <h2 className="marykate d-flex justify-content-center">[ Pre-Alpha ]</h2>
                        <h4 className="marykate d-flex justify-content-center">Remaing Spots: {remainingSpots}</h4>
                        {wallet.publicKey ? (
                            <div className='d-flex flex-column align-items-center justify-content-center gap-4'>
                                <div className="address-box-whitelist">
                                    {displayString()}
                                </div>
                                {response ?
                                    (
                                        <h4>{response}</h4>
                                    ) : (
                                        <button onClick={addToWhitelist} className='button-style-regular'>Submit</button>
                                    )}
                            </div>
                        ) : (
                            <div className='d-flex flex-column align-items-center justify-content-center gap-4'>
                                <h4>Connect Wallet & Submit address</h4>
                                <SolConnection />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <TxModal />
        </>
    )
}

export default Whitelist;