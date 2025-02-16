import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const ScreenContext = createContext();

// Provide Context
export const ScreenProvider = ({ children }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);

    // Track window resizing dynamically
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Function to toggle the sidenav
    const toggleSideNav = () => {
        setIsSideNavOpen((prev) => !prev);
    };

    // Context values to provide
    return (
        <ScreenContext.Provider value={{ windowWidth, isSideNavOpen, toggleSideNav }}>
            {children}
        </ScreenContext.Provider>
    );
};

// Hook to use in components
export const useScreen = () => {
    return useContext(ScreenContext);
};