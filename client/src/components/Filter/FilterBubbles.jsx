import React from "react";

const FilterBubbles = ({ 
    label, 
    selectedValue, 
    options, 
    onSelect 
}) => {

    return (
        <div className="filter-bubbles-container">
            {/* Label */}
            <div className="filter-label marykate">{label}</div>

            {/* Bubbles */}
            <div className="filter-bubble-group">
                {options.map((item) => (
                    <button
                        key={item}
                        className={`filter-bubble ${selectedValue === item ? "selected" : ""}`}
                        onClick={() => onSelect(item)}
                    >
                        {item.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBubbles;
