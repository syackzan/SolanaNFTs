import React, { createContext, useState } from 'react';

// Create the context
export const GlobalVars = createContext();

// Create the provider component
export const GlobalVariables = ({ children }) => {
    const [inGameCurrency, setInGameCurrency] = useState(0); // First state variable
    const [boohToken, setBoohToken] = useState(0); // Second state variable

    return (
        <GlobalVars.Provider value={{ inGameCurrency, setInGameCurrency, boohToken, setBoohToken }}>
            {children}
        </GlobalVars.Provider>
    );
};