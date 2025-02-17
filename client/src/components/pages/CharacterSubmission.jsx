import React, { useState } from "react";

import Navbar from "../Navbar/Navbar";

import "../../css/character-submit.css";

import { useTransactionsController } from "../../providers/TransactionsProvider";
import TxModalManager from "../txModal/TxModalManager";

import SubmitCharacter from "../SubmitCharacter/SubmitCharacter";

import Submissions from "../Submissions/Submissions";

import Switch from 'react-switch';

const CharacterSubmission = () => {
    const { isModalOpen } = useTransactionsController();
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = () => {
        setIsChecked(!isChecked)
    }

    return (
        <div className="character-submission-container sidenav-scrollbar">
            <Navbar />
            <div style={{marginTop: '60px'}}>
                <div className='d-flex gap-2'style={{padding: '5px', color: 'white'}}>
                    <p className="m-0 marykate" style={{ fontSize: '1.3rem' }}>Submit</p>
                    <Switch
                        onChange={handleChange}
                        checked={isChecked}
                        offColor="#888"
                        onColor="#6a0dad"
                        offHandleColor="#444"
                        onHandleColor="#fff"
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                    <p className="m-0 marykate" style={{ fontSize: '1.3rem' }}>Submissions</p>
                </div>
                {!isChecked ? (
                    <SubmitCharacter />
                ) : (
                    <Submissions />
                )}
            </div>

            {isModalOpen && <TxModalManager />}

        </div>
    );
};

export default CharacterSubmission;
