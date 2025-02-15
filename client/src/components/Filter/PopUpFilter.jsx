import React, { useState } from "react";
import { motion } from "framer-motion";
import "../../css/popup-filter.css"; // Import styles (create this file)

const PopUpFilter = ({ buttonLabel, children, selectedFiltersCount, resetFilters }) => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    console.log(selectedFiltersCount);

    return (
        <div className="popup-filter-container">

            {/* Toggle Button */}
            <button className="popup-filter-toggle-button" onClick={togglePopup}>
                {buttonLabel} {selectedFiltersCount > 0 && `(${selectedFiltersCount})`}
            </button>


            {/* Sliding Popup */}
            {isOpen && (
                <motion.div
                    className="popup-filter-panel"
                    initial={{ y: "100%" }} // Start below the screen
                    animate={{ y: 0 }} // Slide up to show
                    exit={{ y: "100%" }} // Slide down when closed
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <div className="popup-filter-content">
                        <div className='d-flex justify-content-center w-100'>
                            <button className='filter-circle' onClick={resetFilters}>Reset Filters</button>
                        </div>
                        {children} {/* This is where you can insert filters or anything */}
                    </div>

                    {/* Close Button */}
                    <button className="popup-filter-close-button" onClick={togglePopup}>
                        &times;
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default PopUpFilter;