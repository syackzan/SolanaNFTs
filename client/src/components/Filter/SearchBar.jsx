import React from 'react';

import { useGlobalVariables } from '../../providers/GlobalVariablesProvider';

import { LuRefreshCcw } from "react-icons/lu";

const SearchBar = () => {

    const { searchItem, setSearchItem, refetchNftConcepts } = useGlobalVariables();

    const handleSearch = (event) => {
        setSearchItem(event.target.value);
    };

    return (
        <div className='d-flex gap-2'>
            <div className="searchbox">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '20px' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 17a7 7 0 100-14 7 7 0 000 14zM21 21l-4.35-4.35"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchItem}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
            <button className="strip-button" onClick={() => {setSearchItem('')}}>
                <LuRefreshCcw />
            </button>
        </div>
    );
};

export default SearchBar;