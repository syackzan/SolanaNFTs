import React from "react";
import { useScreenContext } from "../../context/ScreenContext";
import { motion } from "framer-motion";

import { RxDoubleArrowRight } from "react-icons/rx";

import '../../css/mobile-DetailsButton.css'

const MobileDetailsButton = () => {
    const { windowWidth, isSideNavOpen, toggleSideNav } = useScreenContext();

    // Show only if window width is below 650px OR the side nav is open
    const shouldShow = windowWidth <= 650 && !isSideNavOpen;

    return (
        <motion.div
            className={`mini-open-details ${shouldShow ? "visible" : "hidden"}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: shouldShow ? 1 : 0, x: shouldShow ? 0 : -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={toggleSideNav} // Toggle the side nav when clicked
        >
            <button className="open-details-button">
                <RxDoubleArrowRight />
            </button>
            <span className="vertical-text">Details</span>
        </motion.div>
    );
};

export default MobileDetailsButton;